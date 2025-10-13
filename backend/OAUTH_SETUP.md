# OAuth Authentication Setup Guide

This guide explains how to set up Google and Apple Sign In authentication for the Youdoc backend.

## 📋 Prerequisites

1. **Google Cloud Console Account**
2. **Apple Developer Account**
3. **Django Backend with Social Auth**

## 🔧 Google OAuth2 Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### Step 2: Create OAuth2 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:8000/api/auth/social/complete/google-oauth2/` (development)
   - `https://yourdomain.com/api/auth/social/complete/google-oauth2/` (production)

### Step 3: Get Credentials

Copy the **Client ID** and **Client Secret** from the credentials page.

## 🍎 Apple Sign In Setup

### Step 1: Apple Developer Account

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Navigate to **Certificates, Identifiers & Profiles**

### Step 2: Create App ID

1. Go to **Identifiers** > **App IDs**
2. Click **+** to create new App ID
3. Select **App** and fill in details
4. Enable **Sign In with Apple** capability

### Step 3: Create Service ID

1. Go to **Identifiers** > **Services IDs**
2. Click **+** to create new Service ID
3. Configure **Sign In with Apple**:
   - Add domain: `yourdomain.com`
   - Add redirect URL: `https://yourdomain.com/api/auth/social/complete/apple-id/`

### Step 4: Create Private Key

1. Go to **Keys** > **All**
2. Click **+** to create new key
3. Enable **Sign In with Apple**
4. Download the `.p8` file
5. Note the **Key ID**

### Step 5: Get Team ID

1. Go to **Membership** tab
2. Copy your **Team ID**

## 🔐 Environment Configuration

Add these variables to your `.env` file:

```env
# Google OAuth2 Configuration
GOOGLE_OAUTH2_CLIENT_ID=your_google_client_id_here
GOOGLE_OAUTH2_CLIENT_SECRET=your_google_client_secret_here

# Apple Sign In Configuration
APPLE_CLIENT_ID=your_apple_client_id_here
APPLE_CLIENT_SECRET=your_apple_client_secret_here
APPLE_KEY_ID=your_apple_key_id_here
APPLE_TEAM_ID=your_apple_team_id_here

# OAuth Security Settings
SOCIAL_AUTH_REDIRECT_IS_HTTPS=False  # Set to True in production
```

## 📱 API Endpoints

### Google Authentication

#### Get Google Login URL
```http
GET /api/auth/google/url/
```

**Response:**
```json
{
  "success": true,
  "auth_url": "https://accounts.google.com/oauth/authorize?...",
  "redirect_uri": "http://localhost:8000/api/auth/social/complete/google-oauth2/"
}
```

#### Authenticate with Google Token
```http
POST /api/auth/google/
Content-Type: application/json

{
  "access_token": "google_access_token_here"
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
    "id": 1,
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### Apple Sign In

#### Get Apple Login URL
```http
GET /api/auth/apple/url/
```

**Response:**
```json
{
  "success": true,
  "auth_url": "https://appleid.apple.com/auth/authorize?...",
  "redirect_uri": "http://localhost:8000/api/auth/social/complete/apple-id/"
}
```

#### Authenticate with Apple Token
```http
POST /api/auth/apple/
Content-Type: application/json

{
  "access_token": "apple_access_token_here"
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
    "id": 1,
    "email": "user@privaterelay.appleid.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

## 🔄 OAuth Flow

### 1. Web Flow (Recommended for Web Apps)

```javascript
// Frontend JavaScript
async function googleLogin() {
  // Get Google login URL
  const response = await fetch('/api/auth/google/url/');
  const data = await response.json();
  
  // Redirect to Google OAuth
  window.location.href = data.auth_url;
}

// Handle callback
async function handleGoogleCallback(code) {
  const response = await fetch('/api/auth/google/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: code
    })
  });
  
  const data = await response.json();
  if (data.success) {
    // Store JWT tokens
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    // Redirect to dashboard
  }
}
```

### 2. Mobile Flow (Recommended for Mobile Apps)

#### Google Sign In (React Native)
```javascript
// React Native example
import { GoogleSignin } from '@react-native-google-signin/google-signin';

async function googleLogin() {
  try {
    // Configure Google Sign In
    GoogleSignin.configure({
      webClientId: 'your_google_client_id',
      offlineAccess: true,
    });
    
    // Sign in
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = userInfo;
    
    // Send token to backend
    const response = await fetch('/api/auth/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: idToken
      })
    });
    
    const data = await response.json();
    if (data.success) {
      // Store JWT tokens
      await AsyncStorage.setItem('access_token', data.access);
      await AsyncStorage.setItem('refresh_token', data.refresh);
    }
  } catch (error) {
    console.error('Google login error:', error);
  }
}
```

#### Apple Sign In (React Native)
```javascript
// React Native example
import { AppleAuthentication } from 'expo-apple-authentication';
// or for bare React Native: import { appleAuth } from '@invertase/react-native-apple-authentication';

async function appleLogin() {
  try {
    // Configure Apple Sign In
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    
    const { identityToken, authorizationCode } = credential;
    
    // Send token to backend
    const response = await fetch('/api/auth/apple/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: identityToken,
        authorization_code: authorizationCode
      })
    });
    
    const data = await response.json();
    if (data.success) {
      // Store JWT tokens
      await AsyncStorage.setItem('access_token', data.access);
      await AsyncStorage.setItem('refresh_token', data.refresh);
    }
  } catch (error) {
    console.error('Apple login error:', error);
  }
}
```

#### Apple Sign In (Web - JavaScript)
```javascript
// Web JavaScript example
async function appleLogin() {
  try {
    // Check if Apple Sign In is available
    if (!window.AppleID) {
      throw new Error('Apple Sign In not available');
    }
    
    // Configure Apple Sign In
    const data = await window.AppleID.auth.signIn();
    const { authorization } = data;
    
    // Send authorization code to backend
    const response = await fetch('/api/auth/apple/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authorization.code,
        user: data.user
      })
    });
    
    const result = await response.json();
    if (result.success) {
      // Store JWT tokens
      localStorage.setItem('access_token', result.access);
      localStorage.setItem('refresh_token', result.refresh);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Apple login error:', error);
  }
}
```

#### Apple Sign In (iOS Swift)
```swift
// iOS Swift example
import AuthenticationServices

class AppleSignInManager: NSObject, ASAuthorizationControllerDelegate {
    func signInWithApple() {
        let request = ASAuthorizationAppleIDProvider().createRequest()
        request.requestedScopes = [.fullName, .email]
        
        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.performRequests()
    }
    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
            let identityToken = String(data: appleIDCredential.identityToken!, encoding: .utf8)!
            let authorizationCode = String(data: appleIDCredential.authorizationCode!, encoding: .utf8)!
            
            // Send to backend
            sendToBackend(identityToken: identityToken, authorizationCode: authorizationCode)
        }
    }
    
    func sendToBackend(identityToken: String, authorizationCode: String) {
        let url = URL(string: "https://your-api.com/api/auth/apple/")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = [
            "access_token": identityToken,
            "authorization_code": authorizationCode
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let data = data {
                let result = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
                if let success = result?["success"] as? Bool, success {
                    // Store tokens
                    UserDefaults.standard.set(result?["access"], forKey: "access_token")
                    UserDefaults.standard.set(result?["refresh"], forKey: "refresh_token")
                }
            }
        }.resume()
    }
}
```

#### Apple Sign In (Android Kotlin)
```kotlin
// Android Kotlin example
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions

class AppleSignInActivity : AppCompatActivity() {
    private lateinit var appleSignInClient: GoogleSignInClient
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Configure Apple Sign In (using Google Sign In as proxy for web)
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken("your_apple_client_id")
            .requestEmail()
            .build()
        
        appleSignInClient = GoogleSignIn.getClient(this, gso)
    }
    
    private fun signInWithApple() {
        val signInIntent = appleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }
    
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account.idToken
                
                // Send to backend
                sendToBackend(idToken!!)
            } catch (e: ApiException) {
                Log.e("AppleSignIn", "Sign in failed", e)
            }
        }
    }
    
    private fun sendToBackend(idToken: String) {
        val url = "https://your-api.com/api/auth/apple/"
        val request = Request.Builder()
            .url(url)
            .post(
                FormBody.Builder()
                    .add("access_token", idToken)
                    .build()
            )
            .build()
        
        OkHttpClient().newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("AppleSignIn", "Backend request failed", e)
            }
            
            override fun onResponse(call: Call, response: Response) {
                val result = response.body?.string()
                // Parse response and store tokens
            }
        })
    }
}
```

## 🛡️ Security Considerations

### 1. HTTPS in Production
```env
SOCIAL_AUTH_REDIRECT_IS_HTTPS=True
```

### 2. Domain Validation
- Ensure redirect URIs match exactly
- Use environment-specific domains
- Validate state parameters

### 3. Token Security
- Store JWT tokens securely
- Implement token refresh logic
- Use secure HTTP-only cookies if needed

### 4. Rate Limiting
```python
# Add to Django settings
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

## 🧪 Testing

### Test Google OAuth
```bash
# Get login URL
curl -X GET http://localhost:8000/api/auth/google/url/

# Test with mock token (for development)
curl -X POST http://localhost:8000/api/auth/google/ \
  -H "Content-Type: application/json" \
  -d '{"access_token": "mock_google_token"}'
```

### Test Apple Sign In
```bash
# Get login URL
curl -X GET http://localhost:8000/api/auth/apple/url/

# Test with mock token (for development)
curl -X POST http://localhost:8000/api/auth/apple/ \
  -H "Content-Type: application/json" \
  -d '{"access_token": "mock_apple_token"}'

# Test with real Apple token (after getting from Apple)
curl -X POST http://localhost:8000/api/auth/apple/ \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "eyJraWQiOiJXNldjT0tCIiwiYWxnIjoiUlMyNTYifQ...",
    "authorization_code": "c1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7"
  }'
```

### Apple Sign In Testing with Real Tokens

#### 1. Get Apple Sign In Token (Web)
```html
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
</head>
<body>
    <div id="appleid-signin" data-color="black" data-border="true" data-type="sign in"></div>
    
    <script>
        AppleID.auth.init({
            clientId: 'your.apple.client.id',
            scope: 'name email',
            redirectURI: 'https://your-domain.com/callback',
            state: 'state',
            usePopup: true
        });
        
        document.getElementById('appleid-signin').addEventListener('click', function() {
            AppleID.auth.signIn().then(function(data) {
                console.log('Apple Sign In Success:', data);
                // Send data.authorization.code to your backend
                testAppleAuth(data.authorization.code);
            }).catch(function(error) {
                console.error('Apple Sign In Error:', error);
            });
        });
        
        function testAppleAuth(authorizationCode) {
            fetch('/api/auth/apple/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: authorizationCode
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Backend Response:', data);
                if (data.success) {
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                }
            })
            .catch(error => {
                console.error('Backend Error:', error);
            });
        }
    </script>
</body>
</html>
```

#### 2. Test Apple Sign In Flow (Complete Example)
```javascript
// Complete Apple Sign In test flow
async function testAppleSignInFlow() {
    try {
        // Step 1: Get Apple login URL
        console.log('Step 1: Getting Apple login URL...');
        const urlResponse = await fetch('/api/auth/apple/url/');
        const urlData = await urlResponse.json();
        console.log('Apple Login URL:', urlData);
        
        // Step 2: Simulate Apple authentication (in real app, user would authenticate with Apple)
        console.log('Step 2: Simulating Apple authentication...');
        const mockAppleToken = 'mock_apple_identity_token_here';
        
        // Step 3: Send token to backend
        console.log('Step 3: Sending token to backend...');
        const authResponse = await fetch('/api/auth/apple/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token: mockAppleToken
            })
        });
        
        const authData = await authResponse.json();
        console.log('Authentication Result:', authData);
        
        if (authData.success) {
            console.log('✅ Apple Sign In successful!');
            console.log('Access Token:', authData.access);
            console.log('User Data:', authData.user);
            
            // Step 4: Test protected endpoint
            console.log('Step 4: Testing protected endpoint...');
            const profileResponse = await fetch('/api/auth/profile/', {
                headers: {
                    'Authorization': `Bearer ${authData.access}`
                }
            });
            
            const profileData = await profileResponse.json();
            console.log('Profile Data:', profileData);
        } else {
            console.error('❌ Apple Sign In failed:', authData.message);
        }
        
    } catch (error) {
        console.error('❌ Test flow error:', error);
    }
}

// Run the test
testAppleSignInFlow();
```

## 🚀 Production Deployment

### 1. Update Environment Variables
```env
# Production settings
SOCIAL_AUTH_REDIRECT_IS_HTTPS=True
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 2. Update OAuth Redirect URIs
- **Google**: Add production domain to authorized redirect URIs
- **Apple**: Update Service ID with production domain

### 3. SSL Certificate
- Ensure HTTPS is properly configured
- Use valid SSL certificates
- Test OAuth flows in production

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check redirect URIs in OAuth console
   - Ensure exact match including protocol

2. **"Client ID not found"**
   - Verify environment variables
   - Check Google/Apple console settings

3. **"Token validation failed"**
   - Check token format
   - Verify token hasn't expired
   - Ensure proper scopes

4. **CORS errors**
   - Update CORS settings
   - Check allowed origins
   - Verify preflight requests

### Debug Mode
```python
# Add to settings.py for debugging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'social_django': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## 📚 Additional Resources

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Django Social Auth Documentation](https://python-social-auth.readthedocs.io/)
- [JWT Token Best Practices](https://tools.ietf.org/html/rfc7519)

## 🎯 Next Steps

1. **Set up OAuth credentials** in Google and Apple consoles
2. **Configure environment variables** with your credentials
3. **Test authentication flows** in development
4. **Deploy to production** with proper HTTPS configuration
5. **Monitor and maintain** OAuth integrations

---

**Note**: This setup provides a secure, scalable OAuth authentication system that works seamlessly with your existing JWT-based authentication system.
