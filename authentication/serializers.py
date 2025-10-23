from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User
import secrets
import string
from datetime import datetime, timedelta


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
             'first_name', 'last_name', 'email', 'password', 'password_confirm',
            'mobile', 'date_of_birth', 'gender', 'blood_type', 'height', 'weight'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists")
        return value
    
    def create(self, validated_data):
        """Create new user"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        email = validated_data.pop('email')  # Extract email to avoid duplication
        
        # Generate 6-digit OTP for email verification
        otp_code = ''.join(secrets.choice(string.digits) for _ in range(6))
        
        user = User.objects.create_user(
            email=email,
            password=password,
            email_verification_token=otp_code,
            email_verification_sent_at=datetime.now(),
            **validated_data
        )
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        """Validate user credentials"""
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            if not user.is_email_verified:
                raise serializers.ValidationError('Please verify your email address before logging in. Check your email for the verification code.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password')


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile data
    """
    public_id = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'public_id', 'email', 'first_name', 'last_name', 'mobile',
            'date_of_birth', 'gender', 'blood_type', 'height', 'weight',
            'is_email_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['public_id', 'email', 'is_email_verified', 'created_at', 'updated_at']


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change
    """
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        """Validate old password"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for password reset request
    """
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """Validate email exists"""
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for password reset confirmation
    """
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        """Validate password confirmation and token"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        # Validate token
        try:
            user = User.objects.get(password_reset_token=attrs['token'])
            if not user.password_reset_sent_at:
                raise serializers.ValidationError("Invalid reset token")
            
            # Check if token is expired (24 hours)
            if datetime.now() - user.password_reset_sent_at > timedelta(hours=24):
                raise serializers.ValidationError("Reset token has expired")
            
            attrs['user'] = user
            return attrs
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid reset token")


class EmailVerificationSerializer(serializers.Serializer):
    """
    Serializer for email verification
    """
    token = serializers.CharField()
    
    def validate_token(self, value):
        """Validate verification token"""
        try:
            user = User.objects.get(email_verification_token=value)
            if user.is_email_verified:
                raise serializers.ValidationError("Email is already verified")
            
            # Check if token is expired (10 minutes for OTP)
            if user.email_verification_sent_at and datetime.now() - user.email_verification_sent_at > timedelta(minutes=10):
                raise serializers.ValidationError("Verification code has expired")
            
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid verification code")
