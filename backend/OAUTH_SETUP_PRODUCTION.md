# Production OAuth Setup Guide

This guide explains how to set up Google and Apple OAuth authentication for the YouDoc backend using our **custom production-ready implementation**.

## 🚀 **Production-Ready Features**

- ✅ **UUID User Model Support** - Works seamlessly with our UUID-based user system
- ✅ **Custom OAuth Service** - No dependency on `social-auth-app-django`
- ✅ **Google & Apple Support** - Both providers fully implemented
- ✅ **JWT Token Integration** - Seamless integration with our JWT authentication
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Security** - Production-grade token verification

## 📋 Prerequisites

1. **Google Cloud Console Account**
2. **Apple Developer Account**
3. **Django Backend with Custom OAuth Service**

## 🔧 Google OAuth2 Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### Step 2: Create OAuth2 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Configure the consent screen if prompted
4. Select **Web application** as the application type
5. Add authorized redirect URIs:
   - `http://localhost:8000/api/auth/google/` (development)
   - `https://yourdomain.com/api/auth/google/` (production)

### Step 3: Get Credentials

Copy the **Client ID** and **Client Secret** for configuration.

## 🍎 Apple Sign In Setup

### Step 1: Apple Developer Account Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a new **App ID** or select existing one
4. Enable **Sign In with Apple** capability

### Step 2: Create Service ID

1. Go to **Identifiers** > **Services IDs**
2. Create a new Service ID
3. Configure **Sign In with Apple**:
   - Primary App ID: Your app's bundle ID
   - Domains and Subdomains: Your domain
   - Return URLs: `https://yourdomain.com/api/auth/apple/`

### Step 3: Create Private Key

1. Go to **Keys** section
2. Create a new key with **Sign In with Apple** enabled
3. Download the `.p8` file
4. Note the **Key ID** and **Team ID**

## ⚙️ Backend Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Google OAuth2
GOOGLE_OAUTH2_CLIENT_ID=your_google_client_id_here

# Apple Sign In
APPLE_CLIENT_ID=your_apple_service_id_here
```

### Dependencies

The following packages are already installed:

```txt
google-auth==2.23.4
google-auth-oauthlib==1.1.0
google-auth-httplib2==0.1.1
PyJWT==2.10.1
cryptography==46.0.2
```

## 🔌 API Endpoints

### Google Authentication

**Endpoint:** `POST /api/auth/google/`

**Request:**
```json
{
    "access_token": "google_id_token_here"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Google authentication successful",
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token",
    "user": {
        "id": "uuid_string",
        "publicId": "short_public_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "isEmailVerified": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
}
```

### Apple Authentication

**Endpoint:** `POST /api/auth/apple/`

**Request:**
```json
{
    "access_token": "apple_id_token_here"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Apple authentication successful",
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token",
    "user": {
        "id": "uuid_string",
        "publicId": "short_public_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "isEmailVerified": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
}
```

## 📱 Frontend Integration

### Web (React/Next.js)

```javascript
// Google Sign In
import { GoogleLogin } from '@react-oauth/google';

const handleGoogleSuccess = async (credentialResponse) => {
    const response = await fetch('/api/auth/google/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_token: credentialResponse.credential
        })
    });
    
    const data = await response.json();
    if (data.success) {
        // Store JWT tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // Redirect to dashboard
    }
};

// Apple Sign In
import { useAppleSignIn } from '@react-oauth/apple';

const handleAppleSuccess = async (credentialResponse) => {
    const response = await fetch('/api/auth/apple/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_token: credentialResponse.credential
        })
    });
    
    const data = await response.json();
    if (data.success) {
        // Store JWT tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // Redirect to dashboard
    }
};
```

### React Native

```javascript
// Google Sign In
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        
        const response = await fetch('https://your-api.com/api/auth/google/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: userInfo.idToken
            })
        });
        
        const data = await response.json();
        if (data.success) {
            // Store JWT tokens securely
            await AsyncStorage.setItem('access_token', data.access);
            await AsyncStorage.setItem('refresh_token', data.refresh);
        }
    } catch (error) {
        console.error('Google Sign In Error:', error);
    }
};

// Apple Sign In
import { appleAuth } from '@invertase/react-native-apple-authentication';

const signInWithApple = async () => {
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        
        const response = await fetch('https://your-api.com/api/auth/apple/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: appleAuthRequestResponse.identityToken
            })
        });
        
        const data = await response.json();
        if (data.success) {
            // Store JWT tokens securely
            await AsyncStorage.setItem('access_token', data.access);
            await AsyncStorage.setItem('refresh_token', data.refresh);
        }
    } catch (error) {
        console.error('Apple Sign In Error:', error);
    }
};
```

### iOS Swift

```swift
import AuthenticationServices
import GoogleSignIn

// Google Sign In
func signInWithGoogle() {
    guard let presentingViewController = UIApplication.shared.windows.first?.rootViewController else {
        return
    }
    
    GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { result, error in
        if let error = error {
            print("Google Sign In Error: \(error)")
            return
        }
        
        guard let user = result?.user,
              let idToken = user.idToken?.tokenString else {
            return
        }
        
        // Send token to backend
        authenticateWithBackend(provider: "google", token: idToken)
    }
}

// Apple Sign In
func signInWithApple() {
    let request = ASAuthorizationAppleIDProvider().createRequest()
    request.requestedScopes = [.fullName, .email]
    
    let authorizationController = ASAuthorizationController(authorizationRequests: [request])
    authorizationController.delegate = self
    authorizationController.performRequests()
}

func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
    if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential,
       let identityToken = appleIDCredential.identityToken,
       let idTokenString = String(data: identityToken, encoding: .utf8) {
        
        // Send token to backend
        authenticateWithBackend(provider: "apple", token: idTokenString)
    }
}

func authenticateWithBackend(provider: String, token: String) {
    let url = URL(string: "https://your-api.com/api/auth/\(provider)/")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = ["access_token": token]
    request.httpBody = try? JSONSerialization.data(withJSONObject: body)
    
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let data = data,
           let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
           let success = json["success"] as? Bool, success {
            
            // Store JWT tokens securely
            if let accessToken = json["access"] as? String,
               let refreshToken = json["refresh"] as? String {
                KeychainHelper.store(accessToken, forKey: "access_token")
                KeychainHelper.store(refreshToken, forKey: "refresh_token")
            }
        }
    }.resume()
}
```

### Android Kotlin

```kotlin
// Google Sign In
class GoogleSignInActivity : AppCompatActivity() {
    private lateinit var googleSignInClient: GoogleSignInClient
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.google_client_id))
            .requestEmail()
            .build()
        
        googleSignInClient = GoogleSignIn.getClient(this, gso)
    }
    
    private fun signInWithGoogle() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }
    
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                account?.idToken?.let { idToken ->
                    authenticateWithBackend("google", idToken)
                }
            } catch (e: ApiException) {
                Log.e("GoogleSignIn", "Google sign in failed", e)
            }
        }
    }
}

// Apple Sign In (using Sign in with Apple for Android)
private fun signInWithApple() {
    // Use Sign in with Apple for Android library
    val appleSignInRequest = AppleSignInRequest.Builder()
        .setRequestedScopes(AppleSignInRequest.Scope.EMAIL, AppleSignInRequest.Scope.FULL_NAME)
        .build()
    
    AppleSignInManager.signIn(this, appleSignInRequest) { result ->
        when (result.status) {
            AppleSignInStatus.SUCCESS -> {
                result.idToken?.let { idToken ->
                    authenticateWithBackend("apple", idToken)
                }
            }
            AppleSignInStatus.ERROR -> {
                Log.e("AppleSignIn", "Apple sign in failed: ${result.error}")
            }
        }
    }
}

private fun authenticateWithBackend(provider: String, token: String) {
    val url = "https://your-api.com/api/auth/$provider/"
    val requestBody = JSONObject().apply {
        put("access_token", token)
    }
    
    val request = Request.Builder()
        .url(url)
        .post(requestBody.toString().toRequestBody("application/json".toMediaType()))
        .build()
    
    OkHttpClient().newCall(request).enqueue(object : Callback {
        override fun onResponse(call: Call, response: Response) {
            val json = JSONObject(response.body?.string() ?: "")
            if (json.getBoolean("success")) {
                val accessToken = json.getString("access")
                val refreshToken = json.getString("refresh")
                
                // Store JWT tokens securely
                SecurePreferences.store("access_token", accessToken)
                SecurePreferences.store("refresh_token", refreshToken)
            }
        }
        
        override fun onFailure(call: Call, e: IOException) {
            Log.e("Auth", "Backend authentication failed", e)
        }
    })
}
```

## 🔒 Security Considerations

### Token Verification

Our custom OAuth service includes:

1. **Google Token Verification**:
   - Verifies token signature using Google's public keys
   - Validates token issuer and audience
   - Checks token expiration

2. **Apple Token Verification**:
   - Fetches Apple's public keys dynamically
   - Verifies token signature using RSA public key
   - Validates token audience and issuer

### Best Practices

1. **Environment Variables**: Store OAuth credentials in environment variables
2. **HTTPS Only**: Use HTTPS in production for all OAuth flows
3. **Token Storage**: Store JWT tokens securely (Keychain on iOS, Keystore on Android)
4. **Error Handling**: Implement proper error handling and logging
5. **Rate Limiting**: Consider implementing rate limiting for OAuth endpoints

## 🧪 Testing

### Test OAuth Endpoints

```bash
# Test Google OAuth
curl -X POST http://localhost:8000/api/auth/google/ \
  -H "Content-Type: application/json" \
  -d '{"access_token": "your_google_id_token"}'

# Test Apple OAuth
curl -X POST http://localhost:8000/api/auth/apple/ \
  -H "Content-Type: application/json" \
  -d '{"access_token": "your_apple_id_token"}'
```

### Test User Creation

```python
# Test user creation with OAuth
from authentication.oauth_service import OAuthService

# Mock user info
user_info = {
    'id': 'google_user_123',
    'email': 'test@example.com',
    'email_verified': True,
    'name': 'Test User',
    'given_name': 'Test',
    'family_name': 'User',
    'provider': 'google'
}

# Test authentication
user, info = OAuthService.authenticate_user('google', 'mock_token')
print(f"User created: {user.email}")
```

## 🚀 Production Deployment

### Environment Variables

```env
# Production environment variables
GOOGLE_OAUTH2_CLIENT_ID=your_production_google_client_id
APPLE_CLIENT_ID=your_production_apple_service_id
SECRET_KEY=your_production_secret_key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### Database Migration

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Server Configuration

```nginx
# Nginx configuration for OAuth endpoints
location /api/auth/ {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 📚 Additional Resources

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [JWT Token Best Practices](https://tools.ietf.org/html/rfc7519)
- [Django Security Best Practices](https://docs.djangoproject.com/en/stable/topics/security/)

## 🆘 Troubleshooting

### Common Issues

1. **Token Verification Failed**:
   - Check OAuth credentials configuration
   - Verify token format and expiration
   - Check network connectivity to OAuth providers

2. **User Creation Failed**:
   - Check database connection
   - Verify User model configuration
   - Check email uniqueness constraints

3. **JWT Token Issues**:
   - Verify JWT settings in Django
   - Check token expiration times
   - Ensure proper token storage

### Debug Mode

Enable debug logging:

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'oauth_debug.log',
        },
    },
    'loggers': {
        'authentication.oauth_service': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

---

## ✅ **Production Ready Checklist**

- [ ] Google OAuth2 credentials configured
- [ ] Apple Sign In credentials configured
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] OAuth endpoints tested
- [ ] Frontend integration completed
- [ ] Security measures implemented
- [ ] Error handling tested
- [ ] Logging configured
- [ ] Production deployment completed

**🎉 Your OAuth authentication system is now production-ready!**
