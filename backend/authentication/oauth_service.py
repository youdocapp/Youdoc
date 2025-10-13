"""
Custom OAuth service for Google and Apple authentication
Production-ready implementation that works with UUID user models
"""
import json
import logging
from typing import Dict, Optional, Tuple
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import base64

logger = logging.getLogger(__name__)
User = get_user_model()


class GoogleOAuthService:
    """Google OAuth2 service"""
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict]:
        """
        Verify Google ID token and return user info
        """
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                settings.GOOGLE_OAUTH2_CLIENT_ID
            )
            
            # Verify the issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            return {
                'id': idinfo['sub'],
                'email': idinfo['email'],
                'email_verified': idinfo.get('email_verified', False),
                'name': idinfo.get('name', ''),
                'given_name': idinfo.get('given_name', ''),
                'family_name': idinfo.get('family_name', ''),
                'picture': idinfo.get('picture', ''),
                'provider': 'google'
            }
            
        except ValueError as e:
            logger.error(f"Google token verification failed: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in Google token verification: {str(e)}")
            return None


class AppleOAuthService:
    """Apple Sign In service"""
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict]:
        """
        Verify Apple ID token and return user info
        """
        try:
            # Get Apple's public keys
            apple_keys_url = 'https://appleid.apple.com/auth/keys'
            response = requests.get(apple_keys_url)
            apple_keys = response.json()
            
            # Decode the token header to get the key ID
            header = jwt.get_unverified_header(token)
            key_id = header['kid']
            
            # Find the matching public key
            public_key = None
            for key in apple_keys['keys']:
                if key['kid'] == key_id:
                    public_key = key
                    break
            
            if not public_key:
                raise ValueError('Apple public key not found')
            
            # Convert JWK to PEM format
            pem_key = AppleOAuthService._jwk_to_pem(public_key)
            
            # Verify the token
            payload = jwt.decode(
                token,
                pem_key,
                algorithms=['RS256'],
                audience=settings.APPLE_CLIENT_ID,
                issuer='https://appleid.apple.com'
            )
            
            return {
                'id': payload['sub'],
                'email': payload.get('email', ''),
                'email_verified': True,  # Apple tokens are always verified
                'name': '',  # Apple doesn't provide name in subsequent logins
                'given_name': '',
                'family_name': '',
                'picture': '',
                'provider': 'apple'
            }
            
        except Exception as e:
            logger.error(f"Apple token verification failed: {str(e)}")
            return None
    
    @staticmethod
    def _jwk_to_pem(jwk: Dict) -> str:
        """
        Convert JWK to PEM format for JWT verification
        """
        import base64
        from cryptography.hazmat.primitives.asymmetric import rsa
        from cryptography.hazmat.primitives import serialization
        
        # Decode the key components
        n = base64.urlsafe_b64decode(jwk['n'] + '==')
        e = base64.urlsafe_b64decode(jwk['e'] + '==')
        
        # Create RSA public key
        public_key = rsa.RSAPublicNumbers(
            int.from_bytes(e, 'big'),
            int.from_bytes(n, 'big')
        ).public_key()
        
        # Convert to PEM format
        pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        return pem.decode('utf-8')


class OAuthService:
    """Main OAuth service that handles both Google and Apple"""
    
    @staticmethod
    def authenticate_user(provider: str, token: str) -> Tuple[Optional[User], Optional[Dict]]:
        """
        Authenticate user with OAuth provider
        Returns (user, user_info) or (None, None) if authentication fails
        """
        user_info = None
        
        if provider == 'google':
            user_info = GoogleOAuthService.verify_token(token)
        elif provider == 'apple':
            user_info = AppleOAuthService.verify_token(token)
        else:
            logger.error(f"Unsupported OAuth provider: {provider}")
            return None, None
        
        if not user_info:
            return None, None
        
        # Find or create user
        user = OAuthService._get_or_create_user(user_info)
        return user, user_info
    
    @staticmethod
    def _get_or_create_user(user_info: Dict) -> User:
        """
        Get existing user or create new one based on OAuth info
        """
        email = user_info['email']
        
        # Try to find existing user by email
        try:
            user = User.objects.get(email=email)
            # Update user info if needed
            if not user.first_name and user_info.get('given_name'):
                user.first_name = user_info['given_name']
            if not user.last_name and user_info.get('family_name'):
                user.last_name = user_info['family_name']
            if not user.is_email_verified and user_info.get('email_verified'):
                user.is_email_verified = True
            user.save()
            return user
        except User.DoesNotExist:
            pass
        
        # Create new user
        user = User.objects.create_user(
            email=email,
            first_name=user_info.get('given_name', ''),
            last_name=user_info.get('family_name', ''),
            is_email_verified=user_info.get('email_verified', False)
        )
        
        return user
    
    @staticmethod
    def generate_jwt_tokens(user: User) -> Dict[str, str]:
        """
        Generate JWT tokens for authenticated user
        """
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        return {
            'access': str(access),
            'refresh': str(refresh)
        }
