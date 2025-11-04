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
import logging
import threading

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

logger = logging.getLogger(__name__)


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
    logger.info("Registration request received")
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        logger.info("Serializer created, validating...")
        
        if serializer.is_valid():
            logger.info("Serializer is valid, creating user...")
            
            # Create user - serializer already generates OTP and sets email_verification_sent_at
            user = serializer.save()
            logger.info(f"User created: {user.email}")
            
            # Prepare response data immediately after user creation
            response_data = {
                'success': True,
                'message': 'Registration successful! Please check your email for the verification code.',
                'email': user.email,
                'requires_verification': True
            }
            
            # Get OTP code from user (already set by serializer)
            otp_code = user.email_verification_token
            logger.info(f"OTP code generated for {user.email}")
            
            # Send OTP email in background thread to avoid blocking the request
            # This MUST happen after response is prepared to ensure non-blocking
            def send_email_async():
                try:
                    logger.info(f"Background thread: Starting email send to {user.email}")
                    send_otp_email(user.email, otp_code, user.first_name or user.email.split('@')[0])
                    logger.info(f"Background thread: OTP email sent successfully to {user.email}")
                except Exception as email_error:
                    logger.error(f"Background thread: Failed to send OTP email to {user.email}: {str(email_error)}", exc_info=True)
            
            # Start email sending in background thread
            logger.info(f"Starting background email thread for {user.email}")
            email_thread = threading.Thread(target=send_email_async, daemon=True)
            email_thread.start()
            logger.info(f"Background email thread started, returning response for {user.email}")
            
            # Return response immediately - don't wait for email
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        # Return validation errors in proper JSON format
        return Response({
            'error': True,
            'message': 'Registration failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
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
        
        # Send password reset email in background thread to avoid blocking
        def send_email_async():
            try:
                send_password_reset_email(user.email, token, user.first_name or user.email.split('@')[0])
                logger.info(f"Password reset email sent successfully to {user.email}")
            except Exception as email_error:
                logger.error(f"Failed to send password reset email to {user.email}: {str(email_error)}", exc_info=True)
        
        # Start email sending in background thread
        email_thread = threading.Thread(target=send_email_async, daemon=True)
        email_thread.start()
        
        return Response({
            'success': True,
            'message': 'Password reset email sent successfully. Please check your email.'
        }, status=status.HTTP_200_OK)
    
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
        
        # Send OTP verification email in background thread to avoid blocking
        def send_email_async():
            try:
                send_otp_email(user.email, otp_code, user.first_name or user.email.split('@')[0])
                logger.info(f"Resend OTP email sent successfully to {user.email}")
            except Exception as email_error:
                logger.error(f"Failed to send resend OTP email to {user.email}: {str(email_error)}", exc_info=True)
        
        # Start email sending in background thread
        email_thread = threading.Thread(target=send_email_async, daemon=True)
        email_thread.start()
        
        return Response({
            'success': True,
            'message': 'Verification code sent successfully. Please check your email.'
        }, status=status.HTTP_200_OK)
    
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
        
        # Send welcome email in background thread after successful verification
        def send_email_async():
            try:
                send_welcome_email(user.email, user.first_name or user.email.split('@')[0])
                logger.info(f"Welcome email sent successfully to {user.email}")
            except Exception as email_error:
                logger.error(f"Failed to send welcome email to {user.email}: {str(email_error)}", exc_info=True)
        
        # Start email sending in background thread
        email_thread = threading.Thread(target=send_email_async, daemon=True)
        email_thread.start()
        
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


@api_view(['POST'])
@permission_classes([AllowAny])
def test_email(request):
    """
    Test email sending functionality
    """
    try:
        from django.conf import settings
        from django.core.mail import send_mail
        
        # Get email from request or use default
        test_email = request.data.get('email', settings.EMAIL_HOST_USER)
        
        if not test_email:
            return Response({
                'error': True,
                'message': 'Email address is required. Provide email in request body or set EMAIL_HOST_USER in settings.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check email configuration
        email_config = {
            'EMAIL_BACKEND': getattr(settings, 'EMAIL_BACKEND', 'Not set'),
            'EMAIL_HOST': getattr(settings, 'EMAIL_HOST', 'Not set'),
            'EMAIL_PORT': getattr(settings, 'EMAIL_PORT', 'Not set'),
            'EMAIL_USE_TLS': getattr(settings, 'EMAIL_USE_TLS', 'Not set'),
            'EMAIL_HOST_USER': getattr(settings, 'EMAIL_HOST_USER', 'Not set'),
            'DEFAULT_FROM_EMAIL': getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not set'),
            'EMAIL_HOST_PASSWORD': '***' if getattr(settings, 'EMAIL_HOST_PASSWORD', None) else 'Not set',
        }
        
        # Try to send test email
        try:
            result = send_mail(
                subject='Youdoc - Email Test',
                message='This is a test email to verify email configuration is working correctly.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[test_email],
                fail_silently=False,
            )
            
            if result == 1:
                return Response({
                    'success': True,
                    'message': f'Test email sent successfully to {test_email}',
                    'email_config': email_config,
                    'result': 'Email sent successfully'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': True,
                    'message': f'Failed to send email. Result: {result}',
                    'email_config': email_config,
                    'result': result
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as email_error:
            logger.error(f"Email test failed: {str(email_error)}", exc_info=True)
            return Response({
                'error': True,
                'message': f'Failed to send test email: {str(email_error)}',
                'email_config': email_config,
                'error_details': str(email_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        logger.error(f"Email test error: {str(e)}", exc_info=True)
        return Response({
            'error': True,
            'message': f'An unexpected error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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