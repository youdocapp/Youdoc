# Gmail API Setup Guide

This guide explains how to set up Gmail API for sending emails, which works on cloud platforms like Render where SMTP ports are blocked.

## Why Gmail API?

- **Works on cloud platforms**: Uses HTTPS instead of SMTP, so it works even when SMTP ports (465, 587, 25) are blocked
- **More reliable**: No network connectivity issues
- **Long-lived tokens**: Refresh tokens don't expire if used properly

## Step-by-Step Setup

### 1. Enable Gmail API in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Gmail API:
   - Navigate to **APIs & Services** > **Library**
   - Search for "Gmail API"
   - Click on it and press **Enable**

### 2. Use Existing OAuth2 Credentials (or Create New)

**If you already have a Desktop app OAuth client:**
1. Go to **APIs & Services** > **Credentials**
2. Find your Desktop app client (e.g., "You Doc App")
3. Click on the **Client ID** (the long string) or click the **edit icon (pencil)** in the Actions column
4. In the details page, you'll see:
   - **Client ID** (copy this)
   - **Client secret** (click "Show" to reveal it, then copy)
5. Create a `credentials.json` file manually with this format:
   ```json
   {
     "installed": {
       "client_id": "YOUR_CLIENT_ID_HERE",
       "project_id": "your-project-id",
       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
       "token_uri": "https://oauth2.googleapis.com/token",
       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
       "client_secret": "YOUR_CLIENT_SECRET_HERE",
       "redirect_uris": ["http://localhost"]
     }
   }
   ```
   Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` with the values from step 4.
   Replace `your-project-id` with your actual Google Cloud project ID (you can find it in the URL or project settings).

**If you need to create a new one:**
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External** (unless you have Google Workspace)
   - App name: Your app name (e.g., "Youdoc")
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Add `https://www.googleapis.com/auth/gmail.send`
   - Test users: Add your email (if in testing mode)
   - Click **Save and Continue**
4. Create OAuth client:
   - Application type: **Desktop app**
   - Name: "Youdoc Email Sender" (or any name)
   - Click **Create**
5. Download the JSON file:
   - Click the download icon next to your OAuth client
   - Save it as `credentials.json` in your project root

### 3. Publish Your App (IMPORTANT!)

**This is critical for long-lived refresh tokens!**

1. Go to **APIs & Services** > **OAuth consent screen**
2. If your app is in "Testing" mode:
   - Refresh tokens expire after 7 days in testing mode
   - Click **Publish App**
   - Confirm the publishing
3. Your app should now be "In Production"
   - Refresh tokens will be long-lived (don't expire unless revoked)

### 4. Get Refresh Token

Run the management command:

```bash
python manage.py get_gmail_token --credentials-file credentials.json
```

This will:
1. Open a browser window
2. Ask you to sign in with the Gmail account you want to use
3. Ask for permission to send emails
4. Generate and display the refresh token

### 5. Add to Environment Variables

Copy the JSON output and add it to your Render environment variables:

1. Go to your Render dashboard
2. Select your service
3. Go to **Environment** tab
4. Add new variable:
   - Key: `GMAIL_API_CREDENTIALS`
   - Value: Paste the entire JSON string (the output from the command)

## Refresh Token Longevity

**You should NOT need to regenerate the token often if:**

✅ Your app is published (not in testing mode)  
✅ You use the token at least once every 6 months  
✅ The user doesn't revoke access in their Google account  
✅ You don't exceed 100 tokens per Google account  

**You WILL need to regenerate if:**

❌ Token hasn't been used for 6+ months  
❌ User revokes access in Google account settings  
❌ You've generated 100+ tokens (oldest ones get invalidated)  
❌ App was in testing mode (tokens expire after 7 days)  

## Troubleshooting

### "invalid_grant: Bad Request" Error

This means your refresh token is invalid. Common causes:
- Token expired (if app was in testing mode)
- Token revoked by user
- Token not used for 6+ months

**Solution**: Run `python manage.py get_gmail_token` again to get a new token.

### Token Expires After 7 Days

**Cause**: Your app is still in "Testing" mode.

**Solution**: 
1. Go to OAuth consent screen in Google Cloud Console
2. Click "Publish App"
3. Get a new token (old ones won't work)

### Can't Access OAuth Consent Screen

**Cause**: You need to configure it first.

**Solution**: Follow step 2 above to configure the OAuth consent screen.

## Alternative: Use a Different Email Service

If you prefer not to use Gmail API, consider:
- **SendGrid**: Free tier (100 emails/day), easy setup
- **Mailgun**: Free tier (5,000 emails/month)
- **AWS SES**: Very cheap, reliable
- **Postmark**: Great for transactional emails

These services use HTTPS APIs and work on cloud platforms without SMTP port issues.

