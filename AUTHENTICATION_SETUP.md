# Authentication Setup Guide

This guide will help you set up Supabase authentication for your YouDoc health app.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the placeholder values with your actual credentials

## Step 3: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `backend/database/schema.sql`
4. Paste it into the SQL Editor and click **Run**

This will create all necessary tables with Row Level Security (RLS) enabled for HIPAA compliance.

## Step 4: Configure Email Authentication

### Enable Email Provider

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure the following settings:
   - **Enable email confirmations**: ON (recommended for production)
   - **Secure email change**: ON
   - **Enable email OTP**: ON (for passwordless login)

### Customize Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - **Confirm signup**: Email sent when users sign up
   - **Magic Link**: Email for passwordless login
   - **Change Email Address**: Email when users change their email
   - **Reset Password**: Email for password reset

## Step 5: Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: Your app's URL (for development: `http://localhost:8081`)
   - **Redirect URLs**: Add your app's redirect URLs
   - **JWT expiry**: 3600 seconds (1 hour) recommended
   - **Refresh token rotation**: Enabled (recommended)

## Step 6: Test Authentication

### Sign Up Flow

1. Run your app: `npm start`
2. Navigate to the sign-up screen
3. Enter your details and submit
4. Check your email for the verification code
5. Enter the 6-digit code to verify your email
6. You should be signed in automatically

### Sign In Flow

1. Navigate to the sign-in screen
2. Enter your email and password
3. Click "Log In"
4. You should be redirected to the dashboard

## Features Implemented

### ✅ Sign Up
- Email and password registration
- User metadata (first name, last name, mobile)
- Email verification with OTP
- Automatic profile creation via database trigger

### ✅ Sign In
- Email and password authentication
- Session management
- Automatic token refresh
- Error handling for invalid credentials

### ✅ Email Verification
- 6-digit OTP code
- Resend OTP functionality
- 60-second cooldown timer

### ✅ Sign Out
- Secure sign out
- Session cleanup
- Redirect to home screen

### ✅ Delete Account
- Two-step confirmation
- Soft delete (maintains audit trail)
- Automatic sign out after deletion

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled to ensure users can only access their own data.

### Password Requirements
- Minimum 8 characters
- Enforced on both client and server side

### Session Management
- Automatic token refresh
- Secure session storage
- Session expiry handling

### HIPAA Compliance
- Audit logging for all data access
- Encrypted data at rest
- Secure data transmission (HTTPS)
- User data isolation via RLS

## Troubleshooting

### "Invalid login credentials" error
- Verify email is confirmed (check Supabase Auth dashboard)
- Ensure password meets requirements
- Check if user exists in the database

### Email not received
- Check spam folder
- Verify email provider is enabled in Supabase
- Check Supabase logs for email delivery errors

### "Email not confirmed" error
- User needs to verify email before signing in
- Resend verification email from sign-up flow
- Or manually confirm email in Supabase dashboard

### Session not persisting
- Check if AsyncStorage is working properly
- Verify Supabase client configuration
- Check browser/app storage permissions

## Next Steps

1. **Set up password reset flow**: Implement forgot password functionality
2. **Add social auth**: Enable Google, Apple, or Facebook login
3. **Implement 2FA**: Add two-factor authentication for extra security
4. **Set up monitoring**: Configure Supabase alerts and monitoring
5. **Production deployment**: Update environment variables for production

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the code in `contexts/AuthContext.tsx`
- Check console logs for detailed error messages

## Important Notes

⚠️ **Never commit your `.env` file to version control**
⚠️ **Use different Supabase projects for development and production**
⚠️ **Enable email confirmations in production**
⚠️ **Regularly backup your database**
⚠️ **Monitor authentication logs for suspicious activity**
