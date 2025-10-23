from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.http import JsonResponse
from rest_framework.views import exception_handler
from datetime import datetime, timedelta
import secrets
import string

from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    EmailVerificationSerializer
)
from .email_utils import send_otp_email, send_password_reset_email, send_welcome_email


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token obtain view that returns user data along with tokens
    """
    def post(self, request, *args, **kwargs):
        try:
            serializer = UserLoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access = refresh.access_token
                
                # Return tokens and user data
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'access': str(access),
                    'refresh': str(refresh),
                    'user': user.get_profile_data()
                }, status=status.HTTP_200_OK)
            
            # Return validation errors in proper JSON format
            return Response({
                'error': True,
                'message': 'Invalid credentials',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'error': True,
                'message': 'An unexpected error occurred',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    User registration endpoint
    """
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Send OTP verification email (welcome email will be sent after verification)
            try:
                # Generate 6-digit OTP
                otp_code = ''.join(secrets.choice(string.digits) for _ in range(6))
                user.email_verification_token = otp_code
                user.email_verification_sent_at = timezone.now()
                user.save()
                
                send_otp_email(user.email, otp_code, user.first_name or user.email.split('@')[0])
            except Exception as email_error:
                # Log email error but don't fail registration
                print(f"Failed to send OTP email: {email_error}")
            
            return Response({
                'success': True,
                'message': 'Registration successful! Please check your email for the verification code.',
                'email': user.email,
                'requires_verification': True
            }, status=status.HTTP_201_CREATED)
        
        # Return validation errors in proper JSON format
        return Response({
            'error': True,
            'message': 'Registration failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': True,
            'message': 'An unexpected error occurred during registration',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    Get or update user profile
    """
    user = request.user
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = UserProfileSerializer(user, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'user': user.get_profile_data()
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change user password
    """
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """
    Request password reset
    """
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Generate reset token
        token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
        user.password_reset_token = token
        user.password_reset_sent_at = timezone.now()
        user.save()
        
        # Send password reset email
        try:
            send_password_reset_email(user.email, token, user.first_name or user.email.split('@')[0])
            return Response({
                'success': True,
                'message': 'Password reset email sent successfully. Please check your email.'
            }, status=status.HTTP_200_OK)
        except Exception as email_error:
            return Response({
                'error': True,
                'message': 'Failed to send password reset email. Please try again.',
                'details': str(email_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'error': True,
        'message': 'Invalid email address',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """
    Confirm password reset with token
    """
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        new_password = serializer.validated_data['new_password']
        
        # Update password and clear reset token
        user.set_password(new_password)
        user.password_reset_token = None
        user.password_reset_sent_at = None
        user.save()
        
        return Response({
            'message': 'Password reset successfully'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    """
    Verify user email with token
    """
    serializer = EmailVerificationSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data['token']
        user = User.objects.get(email_verification_token=token)
        
        # Mark email as verified and clear token
        user.is_email_verified = True
        user.email_verification_token = None
        user.email_verification_sent_at = None
        user.save()
        
        return Response({
            'message': 'Email verified successfully'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    """
    Resend email verification OTP
    """
    email = request.data.get('email')
    if not email:
        return Response({
            'error': True,
            'message': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        if user.is_email_verified:
            return Response({
                'error': True,
                'message': 'Email is already verified'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate new 6-digit OTP
        otp_code = ''.join(secrets.choice(string.digits) for _ in range(6))
        user.email_verification_token = otp_code
        user.email_verification_sent_at = timezone.now()
        user.save()
        
        # Send OTP verification email
        try:
            send_otp_email(user.email, otp_code, user.first_name or user.email.split('@')[0])
            return Response({
                'success': True,
                'message': 'Verification code sent successfully. Please check your email.'
            }, status=status.HTTP_200_OK)
        except Exception as email_error:
            return Response({
                'error': True,
                'message': 'Failed to send verification email. Please try again.',
                'details': str(email_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except User.DoesNotExist:
        return Response({
            'error': True,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user (blacklist refresh token)
    """
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    """
    Delete user account
    """
    user = request.user
    user.delete()
    
    return Response({
        'message': 'Account deleted successfully'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verify OTP code for email verification
    """
    otp_code = request.data.get('otp')
    email = request.data.get('email')
    
    if not otp_code or not email:
        return Response({
            'error': True,
            'message': 'OTP code and email are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        
        if user.is_email_verified:
            return Response({
                'error': True,
                'message': 'Email is already verified'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if user.email_verification_token != otp_code:
            return Response({
                'error': True,
                'message': 'Invalid OTP code'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if OTP is expired (10 minutes)
        if user.email_verification_sent_at and timezone.now() - user.email_verification_sent_at > timedelta(minutes=10):
            return Response({
                'error': True,
                'message': 'OTP code has expired. Please request a new one.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark email as verified and clear token
        user.is_email_verified = True
        user.email_verification_token = None
        user.email_verification_sent_at = None
        user.save()
        
        # Send welcome email after successful verification
        try:
            send_welcome_email(user.email, user.first_name or user.email.split('@')[0])
        except Exception as email_error:
            # Log email error but don't fail verification
            print(f"Failed to send welcome email: {email_error}")
        
        # Generate JWT tokens after successful verification (user is now logged in)
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        return Response({
            'success': True,
            'message': 'Email verified successfully! Welcome to Youdoc!',
            'access': str(access),
            'refresh': str(refresh),
            'user': user.get_profile_data()
        }, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({
            'error': True,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


# Custom exception handler for JSON error responses
def custom_exception_handler(exc, context):
    """
    Custom exception handler to return JSON error responses
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'error': True,
            'message': 'An error occurred',
            'details': {}
        }
        
        if hasattr(exc, 'detail'):
            if isinstance(exc.detail, dict):
                custom_response_data['details'] = exc.detail
                # Get the first error message as the main message
                if exc.detail:
                    first_key = list(exc.detail.keys())[0]
                    if isinstance(exc.detail[first_key], list):
                        custom_response_data['message'] = exc.detail[first_key][0]
                    else:
                        custom_response_data['message'] = str(exc.detail[first_key])
            elif isinstance(exc.detail, list):
                custom_response_data['message'] = exc.detail[0] if exc.detail else 'An error occurred'
            else:
                custom_response_data['message'] = str(exc.detail)
        else:
            custom_response_data['message'] = str(exc)
        
        response.data = custom_response_data
    
    return response