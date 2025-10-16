# Authentication Email Flow

## Overview
The authentication system now uses **OTP (One-Time Password)** for email verification instead of email links. Here's the complete flow:

## Authentication Flow

### 1. User Registration
**Endpoint**: `POST /api/auth/register/`

**What happens**:
- User submits registration form with email, password, name, etc.
- User account is created in database
- **6-digit OTP is generated** and stored in `email_verification_token`
- **OTP is sent via email** to user's email address
- **NO JWT tokens returned** - user must verify email first
- **Welcome email is NOT sent yet**

**Response**:
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for the verification code.",
  "email": "user@example.com",
  "requires_verification": true
}
```

### 2. Email Verification (OTP)
**Endpoint**: `POST /api/auth/verify-otp/`

**Request**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**What happens**:
- System validates the 6-digit OTP code
- Checks if OTP is expired (10 minutes)
- If valid: marks email as verified
- **Welcome email is sent** after successful verification
- **JWT tokens are generated** - user is now logged in
- OTP token is cleared from database

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

### 3. Login (Only after email verification)
**Endpoint**: `POST /api/auth/login/`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**What happens**:
- System validates email and password
- **Checks if email is verified** - login fails if not verified
- If valid: generates JWT tokens and returns user data

**Response** (if email verified):
```json
{
  "success": true,
  "message": "Login successful",
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": { ... }
}
```

**Response** (if email not verified):
```json
{
  "error": true,
  "message": "Please verify your email address before logging in. Check your email for the verification code."
}
```

### 4. Resend OTP
**Endpoint**: `POST /api/auth/resend-verification/`

**Request**:
```json
{
  "email": "user@example.com"
}
```

**What happens**:
- Generates new 6-digit OTP
- Sends OTP via email
- Updates database with new OTP and timestamp

## Password Reset Flow

### 1. Request Password Reset
**Endpoint**: `POST /api/auth/password-reset-request/`

**Request**:
```json
{
  "email": "user@example.com"
}
```

**What happens**:
- Generates 32-character reset token
- **Sends password reset email** with reset link
- Stores token in database with timestamp

### 2. Confirm Password Reset
**Endpoint**: `POST /api/auth/password-reset-confirm/`

**Request**:
```json
{
  "token": "reset_token_here",
  "new_password": "new_password",
  "new_password_confirm": "new_password"
}
```

## Email Types

### 1. OTP Verification Email
- **When**: During registration and resend verification
- **Content**: 6-digit OTP code
- **Expires**: 10 minutes
- **Template**: Professional with Youdoc branding

### 2. Welcome Email
- **When**: After successful email verification
- **Content**: Welcome message, getting started info
- **Template**: Branded welcome with next steps

### 3. Password Reset Email
- **When**: When user requests password reset
- **Content**: Reset link with token
- **Expires**: 1 hour
- **Template**: Security-focused with clear instructions

## Key Differences

### OTP vs Email Link Verification
- **OTP**: 6-digit numeric code sent via email
- **Email Link**: Clickable link in email (not used in this system)
- **OTP is more secure** and user-friendly for mobile apps

### Timing of Welcome Email
- **Before**: Welcome email sent during registration
- **Now**: Welcome email sent after email verification
- **Reason**: Ensures user has verified their email before welcoming them

## API Endpoints Summary

| Endpoint | Method | Purpose | Email Sent |
|----------|--------|---------|------------|
| `/register/` | POST | User registration | OTP verification |
| `/verify-otp/` | POST | Verify email with OTP | Welcome email (after verification) |
| `/resend-verification/` | POST | Resend OTP | OTP verification |
| `/password-reset-request/` | POST | Request password reset | Password reset link |
| `/password-reset-confirm/` | POST | Confirm password reset | None |

## Security Features

- **OTP Expiration**: 10 minutes for email verification
- **Token Expiration**: 1 hour for password reset
- **Rate Limiting**: Prevents spam (can be added)
- **Email Validation**: Ensures valid email format
- **Secure Tokens**: Cryptographically secure random generation

## Frontend Integration

### Registration Flow
1. User fills registration form
2. Submit to `/register/` endpoint
3. Show "Check your email for verification code" message
4. Display OTP input field
5. Submit OTP to `/verify-otp/` endpoint
6. Show "Welcome to Youdoc!" message

### Password Reset Flow
1. User enters email on forgot password page
2. Submit to `/password-reset-request/` endpoint
3. Show "Check your email for reset link" message
4. User clicks link in email (handled by frontend)
5. Submit new password to `/password-reset-confirm/` endpoint

## Testing

Use the management command to test email functionality:
```bash
python manage.py test_email --otp --email test@example.com
```

This will test both basic email sending and OTP email functionality.
