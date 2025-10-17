# Authentication App Documentation

## Overview
The authentication app handles user registration, login, email verification, and password management for the Youdoc health platform. It uses JWT tokens for authentication and requires email verification before users can access the platform.

## Models

### User Model
**File**: `authentication/models.py`

Custom user model extending Django's AbstractUser with additional health-related fields.

#### Key Fields:
- **id**: UUID primary key for security
- **public_id**: Short, user-friendly identifier (10 characters)
- **email**: Unique email address (used as username)
- **first_name, last_name**: User's name
- **mobile**: Phone number
- **date_of_birth**: Birth date
- **gender**: Gender selection (male, female, other, prefer_not_to_say)
- **blood_type**: Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **height**: Height in cm
- **weight**: Weight in kg
- **is_email_verified**: Email verification status
- **email_verification_token**: OTP code for verification
- **password_reset_token**: Token for password reset
- **notification_preferences**: JSON field for user preferences

#### Key Methods:
- `generate_public_id()`: Creates unique 10-character ID
- `get_profile_data()`: Returns formatted user data for frontend
- `full_name`: Property returning formatted full name

### BloodType Enum
Predefined blood type choices following international medical standards.

## Serializers

### UserRegistrationSerializer
**File**: `authentication/serializers.py`

Handles user registration with validation:
- Email uniqueness validation
- Password confirmation matching
- Generates 6-digit OTP for email verification
- Creates user with `is_email_verified=False`

### UserLoginSerializer
**File**: `authentication/serializers.py`

Handles user authentication:
- Validates email and password
- **Requires email verification** before login
- Returns user object on successful authentication

### UserProfileSerializer
**File**: `authentication/serializers.py`

Manages user profile updates with read-only fields for security.

### PasswordChangeSerializer
**File**: `authentication/serializers.py`

Handles password changes with old password validation.

### PasswordResetRequestSerializer
**File**: `authentication/serializers.py`

Validates email exists for password reset requests.

### PasswordResetConfirmSerializer
**File**: `authentication/serializers.py`

Validates reset token and new password confirmation.

### EmailVerificationSerializer
**File**: `authentication/serializers.py`

Validates OTP codes for email verification with 10-minute expiration.

## Views

### Registration Flow
**Endpoint**: `POST /api/auth/register/`

**Process**:
1. Validates registration data
2. Creates user account with `is_email_verified=False`
3. Generates 6-digit OTP
4. Sends OTP via email
5. Returns success message (NO JWT tokens)

**Response**:
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for the verification code.",
  "email": "user@example.com",
  "requires_verification": true
}
```

### Email Verification
**Endpoint**: `POST /api/auth/verify-otp/`

**Process**:
1. Validates 6-digit OTP code
2. Checks expiration (10 minutes)
3. Marks email as verified
4. Sends welcome email
5. Generates JWT tokens
6. User is now logged in

**Request**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully! Welcome to Youdoc!",
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": { ... }
}
```

### Login
**Endpoint**: `POST /api/auth/login/`

**Process**:
1. Validates email and password
2. **Checks if email is verified**
3. Returns JWT tokens if verified
4. Returns error if not verified

**Response (Verified)**:
```json
{
  "success": true,
  "message": "Login successful",
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": { ... }
}
```

**Response (Not Verified)**:
```json
{
  "error": true,
  "message": "Please verify your email address before logging in. Check your email for the verification code."
}
```

### Resend OTP
**Endpoint**: `POST /api/auth/resend-verification/`

**Process**:
1. Validates email exists
2. Checks if already verified
3. Generates new 6-digit OTP
4. Sends OTP via email

### Password Reset
**Endpoint**: `POST /api/auth/password-reset-request/`

**Process**:
1. Validates email exists
2. Generates 32-character reset token
3. Sends password reset email with link
4. Stores token with timestamp

**Endpoint**: `POST /api/auth/password-reset-confirm/`

**Process**:
1. Validates reset token
2. Checks expiration (24 hours)
3. Updates password
4. Clears reset token

### Profile Management
**Endpoint**: `GET/PUT/PATCH /api/auth/profile/`

Manages user profile data with authentication required.

### Account Management
**Endpoint**: `POST /api/auth/logout/`
**Endpoint**: `DELETE /api/auth/delete-account/`

Handles logout (token blacklisting) and account deletion.

## Email Integration

### Email Utils
**File**: `authentication/email_utils.py`

#### Functions:
- `send_otp_email()`: Sends 6-digit OTP verification
- `send_password_reset_email()`: Sends password reset link
- `send_welcome_email()`: Sends welcome message after verification
- `test_email_connection()`: Tests email configuration

#### Email Templates:
- **OTP Email**: Professional template with 6-digit code
- **Welcome Email**: Branded welcome with getting started info
- **Password Reset**: Security-focused with reset link

### Email Configuration
**File**: `youdoc_backend/settings.py`

Uses Gmail SMTP with environment variables:
- `EMAIL_HOST`: smtp.gmail.com
- `EMAIL_PORT`: 587
- `EMAIL_USE_TLS`: True
- `EMAIL_HOST_USER`: Youdocapp@gmail.com
- `EMAIL_HOST_PASSWORD`: App Password (required)

## Security Features

### Authentication Flow
1. **Registration**: No access until email verified
2. **Email Verification**: Required before login
3. **JWT Tokens**: Generated only after verification
4. **Token Expiration**: 60 minutes access, 7 days refresh

### Password Security
- Django's built-in password validation
- Secure password reset with tokens
- Old password verification for changes

### Email Security
- OTP expiration (10 minutes)
- Reset token expiration (24 hours)
- App passwords for Gmail authentication

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required | Email Verified |
|----------|--------|---------|---------------|----------------|
| `/register/` | POST | User registration | No | N/A |
| `/verify-otp/` | POST | Email verification | No | No |
| `/resend-verification/` | POST | Resend OTP | No | No |
| `/login/` | POST | User login | No | Yes |
| `/logout/` | POST | User logout | Yes | Yes |
| `/profile/` | GET/PUT/PATCH | Profile management | Yes | Yes |
| `/change-password/` | POST | Change password | Yes | Yes |
| `/password-reset-request/` | POST | Request password reset | No | N/A |
| `/password-reset-confirm/` | POST | Confirm password reset | No | N/A |
| `/delete-account/` | DELETE | Delete account | Yes | Yes |

## Testing

### Management Command
```bash
python manage.py test_email --otp --email test@example.com
```

### Manual Testing
1. Register user → Check email for OTP
2. Verify OTP → Should receive welcome email + JWT tokens
3. Login with verified email → Should work
4. Try login with unverified email → Should fail

## Dependencies

### Required Packages
- `django`: Web framework
- `djangorestframework`: API framework
- `djangorestframework-simplejwt`: JWT authentication
- `django-cors-headers`: CORS handling
- `python-decouple`: Environment variables
- `dj-database-url`: Database configuration

### Email Requirements
- Gmail account with 2FA enabled
- App Password generated for SMTP access
- Environment variables configured

## Error Handling

### Custom Exception Handler
**File**: `authentication/views.py`

Returns consistent JSON error responses:
```json
{
  "error": true,
  "message": "Error description",
  "details": { ... }
}
```

### Common Error Scenarios
- Invalid credentials
- Email not verified
- Expired OTP/reset tokens
- Duplicate email registration
- Invalid password format

## Frontend Integration

### Registration Flow
1. Submit registration form
2. Show "Check email for verification code"
3. Display OTP input field
4. Submit OTP → Auto-login on success

### Login Flow
1. Submit login form
2. If not verified → Show verification prompt
3. If verified → Normal login flow

### Password Reset Flow
1. Submit email on forgot password page
2. Show "Check email for reset link"
3. Handle reset link in frontend
4. Submit new password

## Best Practices

### Security
- Always verify email before granting access
- Use secure token generation
- Implement proper error handling
- Log authentication attempts

### User Experience
- Clear error messages
- Automatic login after verification
- Consistent response format
- Helpful validation messages

### Development
- Use environment variables for sensitive data
- Test email functionality thoroughly
- Implement proper logging
- Follow Django best practices
