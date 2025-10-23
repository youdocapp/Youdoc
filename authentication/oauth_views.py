"""
OAuth authentication views for Google and Apple Sign In
Production-ready custom implementation
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
import logging

from .oauth_service import OAuthService

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Google OAuth2 authentication endpoint
    """
    try:
        # Get ID token from request
        id_token = request.data.get('access_token')  # Note: keeping 'access_token' key for API compatibility
        if not id_token:
            return Response({
                'error': True,
                'message': 'ID token is required',
                'details': 'Please provide a valid Google ID token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user with Google ID token
        user, user_info = OAuthService.authenticate_user('google', id_token)
        
        if user and user.is_active:
            # Generate JWT tokens
            tokens = OAuthService.generate_jwt_tokens(user)
            
            return Response({
                'success': True,
                'message': 'Google authentication successful',
                'access': tokens['access'],
                'refresh': tokens['refresh'],
                'user': user.get_profile_data()
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': True,
                'message': 'Google authentication failed',
                'details': 'Invalid token or user creation failed'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Unexpected error in Google auth: {str(e)}")
        return Response({
            'error': True,
            'message': 'An unexpected error occurred',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def apple_auth(request):
    """
    Apple Sign In authentication endpoint
    """
    try:
        # Get ID token from request
        id_token = request.data.get('access_token')  # Note: keeping 'access_token' key for API compatibility
        if not id_token:
            return Response({
                'error': True,
                'message': 'ID token is required',
                'details': 'Please provide a valid Apple ID token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user with Apple ID token
        user, user_info = OAuthService.authenticate_user('apple', id_token)
        
        if user and user.is_active:
            # Generate JWT tokens
            tokens = OAuthService.generate_jwt_tokens(user)
            
            return Response({
                'success': True,
                'message': 'Apple authentication successful',
                'access': tokens['access'],
                'refresh': tokens['refresh'],
                'user': user.get_profile_data()
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': True,
                'message': 'Apple authentication failed',
                'details': 'Invalid token or user creation failed'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Unexpected error in Apple auth: {str(e)}")
        return Response({
            'error': True,
            'message': 'An unexpected error occurred',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def oauth_success(request):
    """
    OAuth success redirect endpoint
    """
    return Response({
        'success': True,
        'message': 'OAuth authentication successful',
        'user': request.user.get_profile_data() if request.user.is_authenticated else None
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def oauth_error(request):
    """
    OAuth error redirect endpoint
    """
    return Response({
        'error': True,
        'message': 'OAuth authentication failed',
        'details': 'Authentication was cancelled or failed'
    }, status=status.HTTP_400_BAD_REQUEST)


# Note: OAuth URL generation is now handled by the frontend
# The frontend should use the official Google/Apple SDKs to get tokens
# and then send those tokens to our authentication endpoints
