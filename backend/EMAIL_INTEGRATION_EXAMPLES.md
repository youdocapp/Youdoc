# Email Integration Examples

## Overview
The email configuration has been successfully set up for your Youdoc backend. Here are examples of how to integrate email functionality into your existing authentication system.

## Email Configuration Status ✅
- ✅ Django settings updated with email configuration
- ✅ Environment variables configured
- ✅ Email utility functions created
- ✅ Management command for testing created
- ⚠️ **Action Required**: Set up Gmail App Password

## Quick Setup
1. **Generate Gmail App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Update `.env` file with the 16-character password

2. **Test Configuration**:
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py test_email
   ```

## Integration Examples

### 1. OTP Email Verification
```python
from authentication.email_utils import send_otp_email

# In your registration or login view
def send_verification_otp(user_email, otp_code, user_name=None):
    success = send_otp_email(user_email, otp_code, user_name)
    if success:
        return Response({'message': 'OTP sent successfully'})
    else:
        return Response({'error': 'Failed to send OTP'}, status=500)
```

### 2. Password Reset Email
```python
from authentication.email_utils import send_password_reset_email

# In your password reset view
def send_password_reset(user_email, reset_token, user_name=None):
    success = send_password_reset_email(user_email, reset_token, user_name)
    if success:
        return Response({'message': 'Password reset email sent'})
    else:
        return Response({'error': 'Failed to send reset email'}, status=500)
```

### 3. Welcome Email
```python
from authentication.email_utils import send_welcome_email

# After successful user registration
def send_welcome_to_new_user(user_email, user_name):
    success = send_welcome_email(user_email, user_name)
    if success:
        print(f"Welcome email sent to {user_email}")
    else:
        print(f"Failed to send welcome email to {user_email}")
```

### 4. Integration with Existing Views
Update your existing authentication views to include email functionality:

```python
# In authentication/views.py
from .email_utils import send_otp_email, send_welcome_email

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Send welcome email
        send_welcome_email(user.email, user.first_name or user.username)
        
        # Send OTP for email verification
        otp_code = generate_otp()  # Your OTP generation logic
        send_otp_email(user.email, otp_code, user.first_name)
        
        return Response({
            'message': 'User registered successfully. Please check your email for verification.',
            'user_id': user.id
        })
    return Response(serializer.errors, status=400)
```

## Available Email Functions

### `send_otp_email(user_email, otp_code, user_name=None)`
- Sends OTP verification email with HTML formatting
- Includes expiration time (10 minutes)
- Returns: `True` if successful, `False` if failed

### `send_password_reset_email(user_email, reset_token, user_name=None)`
- Sends password reset email with reset link
- Includes expiration time (1 hour)
- Returns: `True` if successful, `False` if failed

### `send_welcome_email(user_email, user_name)`
- Sends welcome email to new users
- Includes getting started information
- Returns: `True` if successful, `False` if failed

### `test_email_connection()`
- Tests basic email configuration
- Sends test email to EMAIL_HOST_USER
- Returns: `True` if successful, `False` if failed

## Testing Commands

### Basic Email Test
```bash
python manage.py test_email
```

### OTP Email Test
```bash
python manage.py test_email --otp --email user@example.com
```

## Environment Variables Required
Create a `.env` file in the backend directory:
```env
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=Youdocapp@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=Youdocapp@gmail.com
```

## Security Best Practices
- ✅ Use App Passwords instead of regular passwords
- ✅ Store credentials in environment variables
- ✅ Enable TLS encryption
- ✅ Log email sending attempts
- ✅ Handle email failures gracefully
- ⚠️ Never commit `.env` file to version control

## Next Steps
1. **Set up Gmail App Password** (see EMAIL_SETUP_GUIDE.md)
2. **Test email functionality** using the management command
3. **Integrate email functions** into your authentication views
4. **Customize email templates** as needed for your brand
5. **Set up email logging** for production monitoring

## Troubleshooting
- **"Application-specific password required"**: Set up Gmail App Password
- **"Authentication failed"**: Check email credentials in `.env`
- **"Connection refused"**: Check EMAIL_HOST and EMAIL_PORT settings
- **"TLS/SSL errors"**: Ensure EMAIL_USE_TLS=True for Gmail
