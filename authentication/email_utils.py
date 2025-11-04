"""
Email utility functions for Youdoc authentication system.
"""

from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


def send_otp_email(user_email, otp_code, user_name=None):
    """
    Send OTP verification email to user.
    
    Args:
        user_email (str): User's email address
        otp_code (str): OTP code to send
        user_name (str, optional): User's name for personalization
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = 'Youdoc - Email Verification Code'
        
        # Simple HTML template for OTP email
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">Youdoc Health Platform</h2>
                <h3 style="color: #34495e;">Email Verification</h3>
                <p style="font-size: 16px; color: #555; margin: 20px 0;">
                    {'Hi ' + user_name + ',' if user_name else 'Hello,'}
                </p>
                <p style="font-size: 16px; color: #555; margin: 20px 0;">
                    Your verification code is:
                </p>
                <div style="background-color: #3498db; color: white; font-size: 24px; font-weight: bold; 
                            padding: 15px; border-radius: 5px; margin: 20px 0; letter-spacing: 3px;">
                    {otp_code}
                </div>
                <p style="font-size: 14px; color: #777; margin: 20px 0;">
                    This code will expire in 10 minutes. Please do not share this code with anyone.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #999;">
                    If you didn't request this code, please ignore this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        plain_message = f"""
        Youdoc Health Platform - Email Verification
        
        {'Hi ' + user_name + ',' if user_name else 'Hello,'}
        
        Your verification code is: {otp_code}
        
        This code will expire in 10 minutes. Please do not share this code with anyone.
        
        If you didn't request this code, please ignore this email.
        
        Best regards,
        Youdoc Team
        """
        
        # Gmail SMTP - try multiple configurations for cloud compatibility
        smtp_configs = [
            # Try port 465 with SSL (often works better on cloud)
            {
                'host': 'smtp.gmail.com',
                'port': 465,
                'use_tls': False,
                'use_ssl': True,
                'name': 'Gmail SMTP (port 465 SSL)'
            },
            # Try port 587 with TLS (standard)
            {
                'host': 'smtp.gmail.com',
                'port': 587,
                'use_tls': True,
                'use_ssl': False,
                'name': 'Gmail SMTP (port 587 TLS)'
            },
            # Try port 25 (sometimes allowed on cloud)
            {
                'host': 'smtp.gmail.com',
                'port': 25,
                'use_tls': True,
                'use_ssl': False,
                'name': 'Gmail SMTP (port 25 TLS)'
            },
        ]
        
        # Also try with current settings if different
        current_host = getattr(settings, 'EMAIL_HOST', 'smtp.gmail.com')
        current_port = getattr(settings, 'EMAIL_PORT', 587)
        current_use_ssl = getattr(settings, 'EMAIL_USE_SSL', False)
        current_use_tls = getattr(settings, 'EMAIL_USE_TLS', True)
        
        if {'host': current_host, 'port': current_port, 'use_tls': current_use_tls, 'use_ssl': current_use_ssl} not in smtp_configs:
            smtp_configs.insert(0, {
                'host': current_host,
                'port': current_port,
                'use_tls': current_use_tls,
                'use_ssl': current_use_ssl,
                'name': f'Current SMTP config ({current_host}:{current_port})'
            })
        
        last_error = None
        for config in smtp_configs:
            try:
                logger.info(f"Trying {config['name']} to send email to {user_email}")
                
                # Create a custom email backend for this configuration
                from django.core.mail.backends.smtp import EmailBackend
                
                backend = EmailBackend(
                    host=config['host'],
                    port=config['port'],
                    username=settings.EMAIL_HOST_USER,
                    password=settings.EMAIL_HOST_PASSWORD,
                    use_tls=config['use_tls'],
                    use_ssl=config['use_ssl'],
                    fail_silently=False,
                    timeout=getattr(settings, 'EMAIL_TIMEOUT', 30)
                )
                
                # Create email message
                from django.core.mail.message import EmailMultiAlternatives
                email = EmailMultiAlternatives(
                    subject=subject,
                    body=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user_email],
                    connection=backend
                )
                email.attach_alternative(html_message, "text/html")
                
                # Send email
                result = email.send()
                
                if result:
                    logger.info(f"{config['name']}: OTP email sent successfully to {user_email}")
                    return True
                else:
                    logger.warning(f"{config['name']}: Email send returned {result}")
                    
            except Exception as smtp_error:
                error_msg = str(smtp_error)
                last_error = smtp_error
                logger.warning(f"{config['name']} failed: {error_msg}")
                
                # If it's a network unreachable error, try next config
                if 'network is unreachable' in error_msg.lower() or 'errno 101' in error_msg.lower():
                    continue  # Try next configuration
                elif 'authentication' in error_msg.lower() or '535' in error_msg:
                    # Authentication error - don't try other configs
                    logger.error(f"SMTP authentication failed - check EMAIL_HOST_USER and EMAIL_HOST_PASSWORD")
                    raise
                # For other errors, try next config
                continue
        
        # All configurations failed
        if last_error:
            error_msg = str(last_error)
            logger.error(f"All SMTP configurations failed. Last error: {error_msg}", exc_info=True)
            
            if 'network is unreachable' in error_msg.lower() or 'errno 101' in error_msg.lower():
                logger.error(f"Network unreachable - Render may be blocking SMTP. Solutions:")
                logger.error(f"1. Use SendGrid API: Set SENDGRID_API_KEY environment variable")
                logger.error(f"2. Use Gmail API instead of SMTP")
                logger.error(f"3. Contact Render support about SMTP port restrictions")
            
            raise last_error
        
    except Exception as e:
        logger.error(f"Failed to send OTP email to {user_email}: {str(e)}", exc_info=True)
        return False


def send_password_reset_email(user_email, reset_token, user_name=None):
    """
    Send password reset email to user.
    
    Args:
        user_email (str): User's email address
        reset_token (str): Password reset token
        user_name (str, optional): User's name for personalization
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = 'Youdoc - Password Reset Request'
        
        # Create reset URL (you'll need to adjust this based on your frontend URL)
        reset_url = f"https://yourapp.com/reset-password?token={reset_token}"
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                <h2 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">Youdoc Health Platform</h2>
                <h3 style="color: #34495e;">Password Reset Request</h3>
                <p style="font-size: 16px; color: #555; margin: 20px 0;">
                    {'Hi ' + user_name + ',' if user_name else 'Hello,'}
                </p>
                <p style="font-size: 16px; color: #555; margin: 20px 0;">
                    We received a request to reset your password. Click the button below to reset your password:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" style="background-color: #e74c3c; color: white; padding: 12px 30px; 
                       text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="font-size: 14px; color: #777; margin: 20px 0;">
                    This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #999;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    {reset_url}
                </p>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Youdoc Health Platform - Password Reset Request
        
        {'Hi ' + user_name + ',' if user_name else 'Hello,'}
        
        We received a request to reset your password. Use the link below to reset your password:
        
        {reset_url}
        
        This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
        
        Best regards,
        Youdoc Team
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Password reset email sent successfully to {user_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user_email}: {str(e)}")
        return False


def send_welcome_email(user_email, user_name):
    """
    Send welcome email to new user.
    
    Args:
        user_email (str): User's email address
        user_name (str): User's name
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = 'Welcome to Youdoc Health Platform!'
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">Welcome to Youdoc!</h2>
                <p style="font-size: 18px; color: #555; margin: 20px 0;">
                    Hi {user_name},
                </p>
                <p style="font-size: 16px; color: #555; margin: 20px 0;">
                    Welcome to Youdoc Health Platform! We're excited to help you manage your health and wellness.
                </p>
                <div style="background-color: #27ae60; color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin: 0;">Get Started</h3>
                    <p style="margin: 10px 0 0 0;">Complete your profile and start tracking your health journey!</p>
                </div>
                <p style="font-size: 14px; color: #777; margin: 20px 0;">
                    If you have any questions, feel free to contact our support team.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #999;">
                    Best regards,<br>
                    The Youdoc Team
                </p>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Welcome to Youdoc Health Platform!
        
        Hi {user_name},
        
        Welcome to Youdoc Health Platform! We're excited to help you manage your health and wellness.
        
        Get Started:
        Complete your profile and start tracking your health journey!
        
        If you have any questions, feel free to contact our support team.
        
        Best regards,
        The Youdoc Team
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Welcome email sent successfully to {user_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email to {user_email}: {str(e)}")
        return False


def test_email_connection():
    """
    Test email configuration by sending a test email.
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        test_email = settings.EMAIL_HOST_USER  # Send to self for testing
        
        send_mail(
            subject='Youdoc - Email Configuration Test',
            message='This is a test email to verify email configuration is working correctly.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[test_email],
            fail_silently=False,
        )
        
        logger.info("Email configuration test successful")
        return True
        
    except Exception as e:
        logger.error(f"Email configuration test failed: {str(e)}")
        return False
