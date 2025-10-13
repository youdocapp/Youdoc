# YouDoc Backend API Documentation

## 🚀 Overview

This document provides comprehensive API documentation for the YouDoc health platform backend. The API is built with Django REST Framework and provides authentication, user management, and health-related endpoints.

## 📡 Base URL

```
Development: http://localhost:8000/api/
Production: https://yourdomain.com/api/
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### JWT Token Configuration
- **Access Token Lifetime**: 60 minutes
- **Refresh Token Lifetime**: 7 days
- **Token Rotation**: Enabled
- **Blacklist After Rotation**: Enabled

---

## 🔑 Authentication Endpoints

### Base URL: `/api/auth/`

#### 1. User Registration
- **POST** `/register/`
- **Description**: Register a new user account
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "password_confirm": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "mobile": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "blood_type": "O+",
  "height": 175.5,
  "weight": 70.0
}
```
- **Response** (201 Created):
```json
{
  "message": "User registered successfully. Please verify your email.",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "0ae95f5a-61ea-445b-a7a2-96264aac76e0",
    "publicId": "E451yV7GjC",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "mobile": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "bloodType": "O+",
    "height": 175.5,
    "weight": 70.0,
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 2. User Login
- **POST** `/login/`
- **Description**: Authenticate user and get JWT tokens
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "0ae95f5a-61ea-445b-a7a2-96264aac76e0",
    "publicId": "E451yV7GjC",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "mobile": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "bloodType": "O+",
    "height": 175.5,
    "weight": 70.0,
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 3. Token Refresh
- **POST** `/token/refresh/`
- **Description**: Refresh JWT access token using refresh token
- **Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### 4. User Logout
- **POST** `/logout/`
- **Description**: Logout user and blacklist refresh token
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

#### 5. Get User Profile
- **GET** `/profile/`
- **Description**: Get current user profile information
- **Headers**: `Authorization: Bearer <access_token>`
- **Response** (200 OK):
```json
{
  "id": "0ae95f5a-61ea-445b-a7a2-96264aac76e0",
  "publicId": "E451yV7GjC",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "mobile": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "bloodType": "O+",
  "height": 175.5,
  "weight": 70.0,
  "isEmailVerified": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### 6. Update User Profile
- **PUT/PATCH** `/profile/`
- **Description**: Update current user profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body** (PATCH - partial update):
```json
{
  "firstName": "Jane",
  "height": 180.0,
  "weight": 75.0
}
```
- **Response** (200 OK):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "0ae95f5a-61ea-445b-a7a2-96264aac76e0",
    "publicId": "E451yV7GjC",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "mobile": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "bloodType": "O+",
    "height": 180.0,
    "weight": 75.0,
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

#### 7. Change Password
- **POST** `/change-password/`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
```json
{
  "old_password": "oldpassword",
  "new_password": "newpassword",
  "new_password_confirm": "newpassword"
}
```
- **Response** (200 OK):
```json
{
  "message": "Password changed successfully"
}
```

#### 8. Email Verification
- **POST** `/verify-email/`
- **Description**: Verify user email with verification token
- **Request Body**:
```json
{
  "token": "verification_token_here"
}
```
- **Response** (200 OK):
```json
{
  "message": "Email verified successfully"
}
```

#### 9. Resend Verification Email
- **POST** `/resend-verification/`
- **Description**: Resend email verification token
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response** (200 OK):
```json
{
  "message": "Verification email sent successfully"
}
```

#### 10. Password Reset Request
- **POST** `/password-reset-request/`
- **Description**: Request password reset email
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response** (200 OK):
```json
{
  "message": "Password reset email sent successfully"
}
```

#### 11. Password Reset Confirm
- **POST** `/password-reset-confirm/`
- **Description**: Confirm password reset with token
- **Request Body**:
```json
{
  "token": "reset_token_here",
  "new_password": "newpassword",
  "new_password_confirm": "newpassword"
}
```
- **Response** (200 OK):
```json
{
  "message": "Password reset successfully"
}
```

#### 12. Delete Account
- **DELETE** `/delete-account/`
- **Description**: Delete user account permanently
- **Headers**: `Authorization: Bearer <access_token>`
- **Response** (200 OK):
```json
{
  "message": "Account deleted successfully"
}
```

---

## 🔐 OAuth Authentication

### Important: ID Token vs Access Token

**Your OAuth endpoints expect ID TOKENS, not access tokens:**

- **ID Token**: Contains user profile information (email, name, etc.) - **This is what you need**
- **Access Token**: Used to make API calls to Google/Apple services - **Not what you need**

The API field is named `access_token` for compatibility, but it expects an **ID token**.

### Google OAuth2

#### Authenticate with Google
- **POST** `/google/`
- **Description**: Authenticate using Google OAuth2 ID token
- **Request Body**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM4YWI3MTUzMDk3MmJiYTIwYjQ5Zjc4YTA5Yzk4NTJjNDNmZjkxMTgiLCJ0eXAiOiJKV1QifQ..."
}
```
- **Note**: Despite the field name `access_token`, this endpoint expects a Google **ID token**, not an access token
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Google authentication successful",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "0ae95f5a-61ea-445b-a7a2-96264aac76e0",
    "publicId": "E451yV7GjC",
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "mobile": null,
    "dateOfBirth": null,
    "gender": null,
    "bloodType": null,
    "height": null,
    "weight": null,
    "isEmailVerified": true,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

### Apple Sign In

#### Authenticate with Apple
- **POST** `/apple/`
- **Description**: Authenticate using Apple Sign In ID token
- **Request Body**:
```json
{
  "access_token": "apple_id_token_here"
}
```
- **Note**: Despite the field name `access_token`, this endpoint expects an Apple **ID token**, not an access token
- **Response** (200 OK):
```json
{
  "success": true,
  "message": "Apple authentication successful",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "0ae95f5a-61ea-445b-a7a2-96264aac76e0",
    "publicId": "E451yV7GjC",
    "email": "user@privaterelay.appleid.com",
    "firstName": "John",
    "lastName": "Doe",
    "mobile": null,
    "dateOfBirth": null,
    "gender": null,
    "bloodType": null,
    "height": null,
    "weight": null,
    "isEmailVerified": true,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

---

## 📊 Data Models

### User Model
```json
{
  "id": "UUID (Primary Key)",
  "publicId": "String (10 chars, unique, user-friendly ID)",
  "email": "String (unique, required)",
  "firstName": "String (optional)",
  "lastName": "String (optional)",
  "mobile": "String (optional)",
  "dateOfBirth": "Date (optional)",
  "gender": "String (male|female|other|prefer_not_to_say)",
  "bloodType": "String (A+|A-|B+|B-|AB+|AB-|O+|O-)",
  "height": "Decimal (cm, optional)",
  "weight": "Decimal (kg, optional)",
  "isEmailVerified": "Boolean (default: false)",
  "createdAt": "DateTime (auto-generated)",
  "updatedAt": "DateTime (auto-updated)"
}
```

---

## ❌ Error Responses

All endpoints return appropriate HTTP status codes and error messages in JSON format.

### Standard Error Response Format:
```json
{
  "error": true,
  "message": "Main error message",
  "details": "Additional error details or field-specific errors"
}
```

### HTTP Status Codes:
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **405 Method Not Allowed**: HTTP method not supported
- **500 Internal Server Error**: Server error

### Example Error Responses:

#### Validation Error (400):
```json
{
  "error": true,
  "message": "Registration failed",
  "details": {
    "email": ["A user with this email already exists"],
    "password": ["This password is too short"]
  }
}
```

#### Authentication Error (401):
```json
{
  "error": true,
  "message": "Invalid credentials",
  "details": "Please check your email and password"
}
```

#### OAuth Error (400):
```json
{
  "error": true,
  "message": "Google authentication failed",
  "details": "Invalid token or user creation failed"
}
```

#### Method Not Allowed (405):
```json
{
  "error": true,
  "message": "Method \"GET\" not allowed",
  "details": {}
}
```

#### Server Error (500):
```json
{
  "error": true,
  "message": "An unexpected error occurred",
  "details": "Internal server error details"
}
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CORS_ALLOW_CREDENTIALS=True

# OAuth
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
APPLE_CLIENT_ID=your-apple-client-id
```

### OAuth Setup
- **Google OAuth2 Client ID**: `407408718192.apps.googleusercontent.com`
- **Apple Sign In**: Configured for production use
- **Token Verification**: Server-side verification with provider APIs

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
python manage.py migrate
```

### 3. Start Development Server
```bash
python manage.py runserver 8000
```

### 4. Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123", "password_confirm": "testpass123", "first_name": "Test", "last_name": "User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- User IDs are UUIDs for security
- Public IDs are 10-character alphanumeric strings for user-friendly references
- OAuth tokens are verified server-side for security
- All passwords are hashed using Django's built-in password hashing
- Email verification is required for full account functionality
- JWT tokens are used for stateless authentication
