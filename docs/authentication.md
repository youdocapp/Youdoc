# Authentication API Documentation

## Overview
The Authentication API provides user registration, login, profile management, and email verification functionality for the Youdoc Health Platform. This API uses JWT tokens for authentication and includes comprehensive email verification and password reset features.

## Base URL
```
https://youdoc.onrender.com/auth
```

## Authentication
All endpoints (except registration, login, password reset, and email verification) require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. User Registration
**POST** `/register`

Register a new user account. An OTP verification code will be sent to the user's email.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "passwordConfirm": "SecurePassword123!",
  "mobile": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "bloodType": "O+",
  "height": 175.5,
  "weight": 70.2
}
```

#### Required Fields
- `firstName` (string): User's first name
- `lastName` (string): User's last name  
- `email` (string): Valid email address
- `password` (string): Strong password (min 8 chars, mixed case, numbers, symbols)
- `passwordConfirm` (string): Must match password

#### Optional Fields
- `mobile` (string): Phone number
- `dateOfBirth` (string): Date in YYYY-MM-DD format
- `gender` (string): "male", "female", "other", "prefer_not_to_say"
- `bloodType` (string): "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
- `height` (number): Height in cm
- `weight` (number): Weight in kg

#### Success Response (201)
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for the verification code.",
  "email": "john.doe@example.com",
  "requiresVerification": true
}
```

#### Error Response (400)
```json
{
  "error": true,
  "message": "Registration failed",
  "details": {
    "email": ["A user with this email already exists"],
    "password": ["This password is too common"]
  }
}
```

---

### 2. User Login
**POST** `/login`

Authenticate user and return JWT tokens. Email must be verified before login.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "publicId": "abc123def4",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "mobile": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "bloodType": "O+",
    "height": 175.5,
    "weight": 70.2,
    "isEmailVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Response (400)
```json
{
  "error": true,
  "message": "Please verify your email address before logging in. Check your email for the verification code.",
  "details": {}
}
```

---

### 3. Email Verification (OTP)
**POST** `/verify-otp`

Verify user's email using the 6-digit OTP code sent during registration.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Email verified successfully! Welcome to Youdoc!",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "publicId": "abc123def4",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    // ... other user fields
  }
}
```

#### Error Response (400)
```json
{
  "error": true,
  "message": "Invalid OTP code",
  "details": {}
}
```

---

### 4. Resend Verification Email
**POST** `/resend-verification`

Resend OTP verification code to user's email.

#### Request Body
```json
{
  "email": "john.doe@example.com"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Verification code sent successfully. Please check your email."
}
```

---

### 5. Get User Profile
**GET** `/profile`

Get current user's profile information.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (200)
```json
{
  "publicId": "abc123def4",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "mobile": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "bloodType": "O+",
  "height": 175.5,
  "weight": 70.2,
  "isEmailVerified": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### 6. Update User Profile
**PUT/PATCH** `/profile`

Update current user's profile information.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body (PATCH - partial update)
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "mobile": "+1987654321",
  "height": 180.0,
  "weight": 75.0
}
```

#### Success Response (200)
```json
{
  "message": "Profile updated successfully",
  "user": {
    "publicId": "abc123def4",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "mobile": "+1987654321",
    "height": 180.0,
    "weight": 75.0,
    // ... other user fields
  }
}
```

---

### 7. Change Password
**POST** `/change-password`

Change user's password (requires current password).

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword456!",
  "newPasswordConfirm": "NewSecurePassword456!"
}
```

#### Success Response (200)
```json
{
  "message": "Password changed successfully"
}
```

---

### 8. Password Reset Request
**POST** `/password-reset-request`

Request password reset link to be sent to user's email.

#### Request Body
```json
{
  "email": "john.doe@example.com"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Password reset email sent successfully. Please check your email."
}
```

---

### 9. Password Reset Confirm
**POST** `/password-reset-confirm`

Confirm password reset using the token from email.

#### Request Body
```json
{
  "token": "abc123def456ghi789",
  "newPassword": "NewSecurePassword456!",
  "newPasswordConfirm": "NewSecurePassword456!"
}
```

#### Success Response (200)
```json
{
  "message": "Password reset successfully"
}
```

---

### 10. Logout
**POST** `/logout`

Logout user and blacklist refresh token.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Request Body
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Success Response (200)
```json
{
  "message": "Logged out successfully"
}
```

---

### 11. Delete Account
**DELETE** `/delete-account`

Permanently delete user account and all associated data.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Success Response (200)
```json
{
  "message": "Account deleted successfully"
}
```

---

### 12. Token Refresh
**POST** `/token/refresh`

Refresh access token using refresh token.

#### Request Body
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Success Response (200)
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### 13. Google OAuth Authentication
**POST** `/google`

Authenticate user using Google OAuth2. The frontend should use the Google Sign-In SDK to obtain an ID token, then send it to this endpoint.

#### Request Body
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Required Fields
- `access_token` (string): Google ID token obtained from Google Sign-In SDK

#### Success Response (200)
```json
{
  "success": true,
  "message": "Google authentication successful",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "publicId": "abc123def4",
    "email": "john.doe@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "mobile": null,
    "dateOfBirth": null,
    "gender": null,
    "bloodType": null,
    "height": null,
    "weight": null,
    "isEmailVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Response (400)
```json
{
  "error": true,
  "message": "ID token is required",
  "details": "Please provide a valid Google ID token"
}
```

#### Error Response (400) - Invalid Token
```json
{
  "error": true,
  "message": "Google authentication failed",
  "details": "Invalid token or user creation failed"
}
```

#### Notes
- No authentication required for this endpoint
- If a user with the same email already exists, they will be logged in
- If no user exists, a new account will be created automatically
- Email verification is automatically set to true for Google-authenticated users

---

## React Native Integration

### 1. Authentication Service
```javascript
// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://youdoc.onrender.com/auth';

class AuthService {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async verifyOTP(email, otp) {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    return response.json();
  }

  async googleAuth(idToken) {
    const response = await fetch(`${API_BASE_URL}/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: idToken }),
    });
    return response.json();
  }

  async getProfile() {
    const token = await AsyncStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  }

  async updateProfile(profileData) {
    const token = await AsyncStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  }

  async changePassword(oldPassword, newPassword) {
    const token = await AsyncStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
        newPasswordConfirm: newPassword,
      }),
    });
    return response.json();
  }

  async logout() {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    // Clear stored tokens
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    return response.json();
  }
}

export default new AuthService();
```

### 2. Authentication Context
```javascript
// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const profile = await AuthService.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      if (response.success) {
        await AsyncStorage.setItem('accessToken', response.access);
        await AsyncStorage.setItem('refreshToken', response.refresh);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await AuthService.verifyOTP(email, otp);
      if (response.success) {
        await AsyncStorage.setItem('accessToken', response.access);
        await AsyncStorage.setItem('refreshToken', response.refresh);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Verification failed' };
    }
  };

  const googleAuth = async (idToken) => {
    try {
      const response = await AuthService.googleAuth(idToken);
      if (response.success) {
        await AsyncStorage.setItem('accessToken', response.access);
        await AsyncStorage.setItem('refreshToken', response.refresh);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Google authentication failed' };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyOTP,
    googleAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 3. Registration Screen Example
```javascript
// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegistrationScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
  });

  const handleRegister = async () => {
    const response = await register(formData);
    if (response.success) {
      Alert.alert('Success', response.message);
      navigation.navigate('OTPVerification', { email: formData.email });
    } else {
      Alert.alert('Error', response.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
      />
      <TextInput
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleRegister}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": true,
  "message": "Validation failed",
  "details": {
    "field": ["Error message"]
  }
}
```

#### 401 Unauthorized
```json
{
  "error": true,
  "message": "Authentication credentials were not provided"
}
```

#### 403 Forbidden
```json
{
  "error": true,
  "message": "You do not have permission to perform this action"
}
```

#### 500 Internal Server Error
```json
{
  "error": true,
  "message": "An unexpected error occurred",
  "details": "Error details"
}
```

---

## Security Notes

1. **JWT Tokens**: Access tokens expire in 60 minutes, refresh tokens in 7 days
2. **Email Verification**: Required before login
3. **Password Requirements**: Minimum 8 characters with mixed case, numbers, and symbols
4. **OTP Expiry**: Email verification codes expire in 10 minutes
5. **Rate Limiting**: Password reset requests are rate-limited to prevent abuse
6. **HTTPS Only**: All API calls must use HTTPS in production

---

## Testing

Use the following test credentials for development:

```json
{
  "email": "test@example.com",
  "password": "TestPassword123!"
}
```

**Note**: Replace with actual test user credentials in your development environment.
