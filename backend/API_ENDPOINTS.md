# YouDoc Backend API Endpoints

## Authentication Endpoints

### Base URL: `/api/auth/`

#### 1. User Registration
- **POST** `/register/`
- **Description**: Register a new user
- **Body**:
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
- **Response**:
```json
{
  "message": "User registered successfully. Please verify your email.",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
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
- **Description**: Login user and get JWT tokens
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
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
- **Description**: Refresh JWT access token
- **Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### 4. User Logout
- **POST** `/logout/`
- **Description**: Logout user (blacklist refresh token)
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response**:
```json
{
  "message": "Logged out successfully"
}
```

#### 5. Get User Profile
- **GET** `/profile/`
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "mobile": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "blood_type": "O+",
  "height": "175.50",
  "weight": "70.00",
  "is_email_verified": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### 6. Update User Profile
- **PUT/PATCH** `/profile/`
- **Description**: Update current user profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Body** (PATCH - partial update):
```json
{
  "first_name": "Jane",
  "height": 180.0
}
```
- **Response**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "mobile": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "bloodType": "O+",
    "height": 180.0,
    "weight": 70.0,
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 7. Change Password
- **POST** `/change-password/`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
```json
{
  "old_password": "oldpassword",
  "new_password": "newpassword",
  "new_password_confirm": "newpassword"
}
```
- **Response**:
```json
{
  "message": "Password changed successfully"
}
```

#### 8. Email Verification
- **POST** `/verify-email/`
- **Description**: Verify user email with token
- **Body**:
```json
{
  "token": "verification_token_here"
}
```
- **Response**:
```json
{
  "message": "Email verified successfully"
}
```

#### 9. Resend Verification Email
- **POST** `/resend-verification/`
- **Description**: Resend email verification
- **Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response**:
```json
{
  "message": "Verification email sent successfully"
}
```

#### 10. Password Reset Request
- **POST** `/password-reset-request/`
- **Description**: Request password reset
- **Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response**:
```json
{
  "message": "Password reset email sent successfully"
}
```

#### 11. Password Reset Confirm
- **POST** `/password-reset-confirm/`
- **Description**: Confirm password reset with token
- **Body**:
```json
{
  "token": "reset_token_here",
  "new_password": "newpassword",
  "new_password_confirm": "newpassword"
}
```
- **Response**:
```json
{
  "message": "Password reset successfully"
}
```

#### 12. Delete Account
- **DELETE** `/delete-account/`
- **Description**: Delete user account
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
```json
{
  "message": "Account deleted successfully"
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages in JSON format:

### Standard Error Response Format:
```json
{
  "error": true,
  "message": "Main error message",
  "details": {
    "field_name": ["Field-specific error message"],
    "additional_info": "More details if needed"
  }
}
```

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
  "details": {}
}
```

#### Method Not Allowed (405):
```json
{
  "error": true,
  "message": "Method not allowed",
  "details": {
    "allowed_methods": ["POST"]
  }
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

## JWT Token Configuration

- **Access Token Lifetime**: 60 minutes
- **Refresh Token Lifetime**: 7 days
- **Token Rotation**: Enabled
- **Blacklist After Rotation**: Enabled
