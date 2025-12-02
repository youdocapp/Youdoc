"""
Helper command to create a credentials.json template file.
This helps if you can't download the credentials directly from Google Cloud Console.
"""
from django.core.management.base import BaseCommand
import json
import os


class Command(BaseCommand):
    help = 'Create a credentials.json template file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--client-id',
            type=str,
            required=True,
            help='Your OAuth2 Client ID from Google Cloud Console',
        )
        parser.add_argument(
            '--client-secret',
            type=str,
            required=True,
            help='Your OAuth2 Client Secret from Google Cloud Console',
        )
        parser.add_argument(
            '--project-id',
            type=str,
            required=True,
            help='Your Google Cloud Project ID',
        )
        parser.add_argument(
            '--output',
            type=str,
            default='credentials.json',
            help='Output file path (default: credentials.json)',
        )

    def handle(self, *args, **options):
        client_id = options['client_id']
        client_secret = options['client_secret']
        project_id = options['project_id']
        output_file = options['output']

        credentials = {
            "installed": {
                "client_id": client_id,
                "project_id": project_id,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_secret": client_secret,
                "redirect_uris": ["http://localhost"]
            }
        }

        with open(output_file, 'w') as f:
            json.dump(credentials, f, indent=2)

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Created {output_file} successfully!\n\n'
                'Now you can run:\n'
                f'  python manage.py get_gmail_token --credentials-file {output_file}\n'
            )
        )

