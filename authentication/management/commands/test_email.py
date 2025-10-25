from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from authentication.email_utils import test_email_connection

class Command(BaseCommand):
    help = 'Test email configuration'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Email address to send test email to',
            default=None
        )

    def handle(self, *args, **options):
        self.stdout.write("🧪 Testing Email Configuration...")
        self.stdout.write("=" * 50)
        
        # Check email settings
        self.stdout.write(f"📧 Email Host: {settings.EMAIL_HOST}")
        self.stdout.write(f"📧 Email Port: {settings.EMAIL_PORT}")
        self.stdout.write(f"📧 Email User: {settings.EMAIL_HOST_USER}")
        self.stdout.write(f"📧 From Email: {settings.DEFAULT_FROM_EMAIL}")
        self.stdout.write(f"📧 Use TLS: {settings.EMAIL_USE_TLS}")
        self.stdout.write("-" * 50)
        
        # Test email connection
        try:
            if test_email_connection():
                self.stdout.write(
                    self.style.SUCCESS("✅ Email test successful! Check your inbox.")
                )
            else:
                self.stdout.write(
                    self.style.ERROR("❌ Email test failed!")
                )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Email test error: {str(e)}")
            )
        
        # Test manual email if email provided
        if options['email']:
            try:
                send_mail(
                    subject='Youdoc - Manual Email Test',
                    message='This is a manual test email from Youdoc backend.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[options['email']],
                    fail_silently=False,
                )
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Manual email sent to {options['email']}!")
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"❌ Manual email failed: {str(e)}")
                )

