"""
Django management command to test email sending functionality
"""
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.mail import send_mail
from authentication.email_utils import send_otp_email, test_email_connection
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Test email sending functionality'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Email address to send test email to (defaults to EMAIL_HOST_USER)',
            default=None,
        )
        parser.add_argument(
            '--type',
            type=str,
            choices=['simple', 'otp', 'connection'],
            default='simple',
            help='Type of email test: simple (basic test), otp (OTP email), connection (connection test)',
        )

    def handle(self, *args, **options):
        email = options['email'] or getattr(settings, 'EMAIL_HOST_USER', None)
        test_type = options['type']

        if not email:
            self.stdout.write(
                self.style.ERROR('Email address is required. Provide --email or set EMAIL_HOST_USER in settings.')
            )
            return

        # Display email configuration
        self.stdout.write(self.style.WARNING('\n=== Email Configuration ==='))
        self.stdout.write(f'EMAIL_BACKEND: {getattr(settings, "EMAIL_BACKEND", "Not set")}')
        self.stdout.write(f'EMAIL_HOST: {getattr(settings, "EMAIL_HOST", "Not set")}')
        self.stdout.write(f'EMAIL_PORT: {getattr(settings, "EMAIL_PORT", "Not set")}')
        self.stdout.write(f'EMAIL_USE_TLS: {getattr(settings, "EMAIL_USE_TLS", "Not set")}')
        self.stdout.write(f'EMAIL_HOST_USER: {getattr(settings, "EMAIL_HOST_USER", "Not set")}')
        self.stdout.write(f'DEFAULT_FROM_EMAIL: {getattr(settings, "DEFAULT_FROM_EMAIL", "Not set")}')
        self.stdout.write(f'EMAIL_HOST_PASSWORD: {"***" if getattr(settings, "EMAIL_HOST_PASSWORD", None) else "Not set"}')
        self.stdout.write('')

        # Run the test
        try:
            if test_type == 'connection':
                self.stdout.write(self.style.WARNING(f'Testing email connection to {email}...'))
                success = test_email_connection()
                if success:
                    self.stdout.write(self.style.SUCCESS('✓ Email connection test successful!'))
                else:
                    self.stdout.write(self.style.ERROR('✗ Email connection test failed!'))
                    
            elif test_type == 'otp':
                self.stdout.write(self.style.WARNING(f'Sending OTP test email to {email}...'))
                otp_code = '123456'  # Test OTP
                success = send_otp_email(email, otp_code, 'Test User')
                if success:
                    self.stdout.write(self.style.SUCCESS(f'✓ OTP email sent successfully to {email}!'))
                    self.stdout.write(self.style.SUCCESS(f'Test OTP Code: {otp_code}'))
                else:
                    self.stdout.write(self.style.ERROR(f'✗ Failed to send OTP email to {email}!'))
                    
            else:  # simple
                self.stdout.write(self.style.WARNING(f'Sending simple test email to {email}...'))
                result = send_mail(
                    subject='Youdoc - Email Test',
                    message='This is a test email to verify email configuration is working correctly.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
                
                if result == 1:
                    self.stdout.write(self.style.SUCCESS(f'✓ Test email sent successfully to {email}!'))
                else:
                    self.stdout.write(self.style.ERROR(f'✗ Failed to send email. Result: {result}'))
                    
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error: {str(e)}'))
            logger.error(f"Email test failed: {str(e)}", exc_info=True)

