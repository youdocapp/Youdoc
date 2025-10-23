"""
OAuth serializers for Google and Apple Sign In
"""
from rest_framework import serializers


class GoogleAuthSerializer(serializers.Serializer):
    """
    Serializer for Google OAuth2 authentication
    """
    access_token = serializers.CharField(
        required=True,
        help_text="Google OAuth2 access token"
    )
    
    def validate_access_token(self, value):
        """
        Validate the access token format
        """
        if not value or len(value) < 10:
            raise serializers.ValidationError("Invalid access token format")
        return value


class AppleAuthSerializer(serializers.Serializer):
    """
    Serializer for Apple Sign In authentication
    """
    access_token = serializers.CharField(
        required=True,
        help_text="Apple Sign In access token"
    )
    
    def validate_access_token(self, value):
        """
        Validate the access token format
        """
        if not value or len(value) < 10:
            raise serializers.ValidationError("Invalid access token format")
        return value


class OAuthUserSerializer(serializers.Serializer):
    """
    Serializer for OAuth user data
    """
    id = serializers.UUIDField(read_only=True)
    publicId = serializers.CharField(source='public_id', read_only=True)
    email = serializers.EmailField(read_only=True)
    firstName = serializers.CharField(source='first_name', read_only=True)
    lastName = serializers.CharField(source='last_name', read_only=True)
    isEmailVerified = serializers.BooleanField(source='is_email_verified', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    
    # OAuth specific fields
    provider = serializers.CharField(read_only=True)
    socialId = serializers.CharField(source='social_id', read_only=True)
    avatar = serializers.URLField(read_only=True, allow_null=True)
