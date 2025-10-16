# Email Configuration Setup Guide

## Current Status ✅
The email configuration has been successfully added to your Django backend. The test shows that the configuration is working correctly, but Gmail requires an App Password for authentication.

## Configuration Added

### Django Settings (youdoc_backend/settings.py)
```python
# Email Configuration
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='Youdocapp@gmail.com')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='Youdoc@2025')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='Youdocapp@gmail.com')
```

### Environment Variables (.env file)
Create a `.env` file in the backend directory with:
```env
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=Youdocapp@gmail.com
EMAIL_HOST_PASSWORD=Youdoc@2025
DEFAULT_FROM_EMAIL=Youdocapp@gmail.com
```

## Next Steps Required

### 1. Generate Gmail App Password
Since Gmail requires an App Password for SMTP authentication:

1. **Enable 2-Factor Authentication** on your Gmail account (Youdocapp@gmail.com)
2. **Generate an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 2. Update Environment Variables
Replace `Youdoc@2025` in your `.env` file with the generated App Password:
```env
EMAIL_HOST_PASSWORD=your-16-character-app-password
```

### 3. Test Email Functionality
Run the test script again:
```bash
cd backend
source venv/bin/activate
python test_email.py
```

## Email Features Available

### Basic Email Sending
```python
from django.core.mail import send_mail

send_mail(
    subject='Subject',
    message='Message body',
    from_email='Youdocapp@gmail.com',
    recipient_list=['recipient@example.com'],
    fail_silently=False,
)
```

### HTML Email Sending
```python
from django.core.mail import EmailMessage

email = EmailMessage(
    subject='Subject',
    body='<h1>HTML Content</h1>',
    from_email='Youdocapp@gmail.com',
    to=['recipient@example.com'],
)
email.content_subtype = "html"
email.send()
```

## Security Notes
- ✅ App Passwords are more secure than regular passwords
- ✅ TLS encryption is enabled
- ✅ Configuration uses environment variables
- ⚠️ Never commit `.env` file to version control
- ⚠️ Use different credentials for production

## Troubleshooting
If you encounter issues:
1. Verify 2FA is enabled on Gmail account
2. Check App Password is correctly generated
3. Ensure `.env` file is in the backend directory
4. Verify no extra spaces in environment variables
5. Check Gmail account isn't locked or restricted

## Production Considerations
For production deployment:
- Use a dedicated email service (SendGrid, AWS SES, etc.)
- Store credentials in secure environment variables
- Consider rate limiting for email sending
- Implement email templates for consistent branding
