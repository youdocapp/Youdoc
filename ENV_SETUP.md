# Environment Setup Guide

## API Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Backend API Base URL
EXPO_PUBLIC_API_BASE_URL=https://youdoc.onrender.com/api

# Optional: For local development
# EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Installation

1. Copy the environment example:
```bash
# Create .env file from example
cp .env.example .env
```

2. Edit `.env` and add your API base URL

3. Install dependencies:
```bash
npm install
# or
bun install
```

## Google Fit Integration (Android)

For health tracking with Google Fit on Android, you'll need:

1. **Google Sign-In Setup:**
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Sign-In API
   - Create OAuth 2.0 credentials
   - Add your Android package name and SHA-1 fingerprint

2. **Google Fit API:**
   - Enable Google Fit API in your Google Cloud project
   - Configure OAuth consent screen
   - Request necessary scopes for health data access

3. **Android Configuration:**
   - Add your Google Sign-In configuration to `app.json` or `android/app/google-services.json`
   - Configure permissions in `android/app/src/main/AndroidManifest.xml`

## Apple Health Integration (iOS)

For health tracking with Apple Health on iOS:

1. **Capabilities:**
   - Enable HealthKit in Xcode project capabilities
   - Add HealthKit framework to your project

2. **Info.plist:**
   - Add `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` keys
   - Provide user-facing descriptions for health data access

3. **Permissions:**
   - Request HealthKit permissions at runtime
   - Handle authorization status appropriately

## Notes

- The API base URL defaults to `https://youdoc.onrender.com/api` if not set
- All API endpoints require authentication except registration, login, and password reset
- JWT tokens are automatically stored and refreshed
- Health tracking integrations require platform-specific setup

