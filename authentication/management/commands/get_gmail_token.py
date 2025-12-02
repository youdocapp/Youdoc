"""
Django management command to get Gmail API refresh token.
This only needs to be run once to get the refresh token.

Usage:
    python manage.py get_gmail_token

The refresh token will be printed and can be added to GMAIL_API_CREDENTIALS environment variable.
"""
from django.core.management.base import BaseCommand
from django.conf import settings
import json
import os

try:
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    GMAIL_API_AVAILABLE = True
except ImportError:
    GMAIL_API_AVAILABLE = False


class Command(BaseCommand):
    help = 'Get Gmail API refresh token (run once to set up)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--credentials-file',
            type=str,
            default='credentials.json',
            help='Path to OAuth2 credentials JSON file downloaded from Google Cloud Console',
        )

    def handle(self, *args, **options):
        if not GMAIL_API_AVAILABLE:
            self.stdout.write(
                self.style.ERROR(
                    'Gmail API libraries not installed. Install with: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client'
                )
            )
            return

        credentials_file = options['credentials_file']
        
        if not os.path.exists(credentials_file):
            self.stdout.write(
                self.style.ERROR(
                    f'Credentials file not found: {credentials_file}\n\n'
                    'To get credentials file:\n'
                    '1. Go to https://console.cloud.google.com/\n'
                    '2. Create or select a project\n'
                    '3. Enable Gmail API:\n'
                    '   - Go to "APIs & Services" > "Library"\n'
                    '   - Search for "Gmail API" and enable it\n'
                    '4. Create OAuth2 credentials:\n'
                    '   - Go to "APIs & Services" > "Credentials"\n'
                    '   - Click "Create Credentials" > "OAuth client ID"\n'
                    '   - Application type: "Desktop app"\n'
                    '   - Download the JSON file and save as "credentials.json"\n'
                )
            )
            return

        # Gmail API scopes
        SCOPES = ['https://www.googleapis.com/auth/gmail.send']

        try:
            # Create OAuth flow
            flow = InstalledAppFlow.from_client_secrets_file(
                credentials_file, SCOPES
            )
            
            self.stdout.write(
                self.style.WARNING(
                    '\n=== Gmail API Authorization ===\n'
                    'A browser window will open. Please:\n'
                    '1. Sign in with the Gmail account you want to use for sending emails\n'
                    '2. Grant permission to send emails on your behalf\n'
                    '3. The refresh token will be generated automatically\n'
                )
            )
            
            # Run the OAuth flow
            creds = flow.run_local_server(port=0)
            
            # Get the credentials as a dictionary
            creds_dict = {
                'token': creds.token,
                'refresh_token': creds.refresh_token,
                'token_uri': creds.token_uri,
                'client_id': creds.client_id,
                'client_secret': creds.client_secret,
                'scopes': creds.scopes
            }
            
            self.stdout.write(
                self.style.SUCCESS(
                    '\n✓ Successfully obtained refresh token!\n\n'
                    'Add this to your GMAIL_API_CREDENTIALS environment variable:\n'
                )
            )
            
            # Print as JSON string (for environment variable)
            creds_json = json.dumps(creds_dict)
            self.stdout.write(self.style.SUCCESS(creds_json))
            
            self.stdout.write(
                self.style.WARNING(
                    '\n\nIMPORTANT:\n'
                    '1. Copy the JSON above\n'
                    '2. Add it to your Render environment variables as GMAIL_API_CREDENTIALS\n'
                    '3. The refresh token is long-lived and should work indefinitely if:\n'
                    '   - Your app is published (not in testing mode)\n'
                    '   - You use it at least once every 6 months\n'
                    '   - The user doesn\'t revoke access\n'
                    '\n'
                    'You should NOT need to run this again unless:\n'
                    ' - The token is revoked\n'
                    ' - You haven\'t used it for 6+ months\n'
                    ' - You exceed 100 tokens per account\n'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error getting refresh token: {str(e)}')
            )

