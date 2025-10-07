# Backend Infrastructure Setup Guide

## 🎉 Quick Links

- **[BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)** - Start here! Overview of what's been built
- **[BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)** - Complete integration guide
- **[QUICK_API_REFERENCE.md](./QUICK_API_REFERENCE.md)** - Quick reference for common operations
- **[BACKEND_CHECKLIST.md](./BACKEND_CHECKLIST.md)** - Track your integration progress
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase configuration details

---

## Overview
This guide covers the complete backend setup for the Carepoint Health App using Supabase as the primary database and authentication provider.

**✅ Backend is ready!** All tRPC endpoints are created. Just deploy the database schema and start using the API.

## Tech Stack

### ✅ Current Stack
1. **Database & Authentication**: Supabase (PostgreSQL)
2. **API Layer**: tRPC (Type-safe API)
3. **Backend Runtime**: Hono (Node.js server)
4. **File Storage**: Supabase Storage
5. **Real-time**: Supabase Realtime

### 🔒 HIPAA Compliance Features
- Row Level Security (RLS) on all tables
- Encrypted data at rest and in transit
- Audit logging for all data access
- Secure authentication with JWT tokens
- Business Associate Agreement (BAA) available from Supabase

## Quick Start

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **New Project**
3. Fill in project details:
   - **Name**: carepoint-health
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Pro (required for HIPAA compliance)

4. Wait for project provisioning (~2 minutes)

### Step 2: Get API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following:
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGc...
   service_role key: eyJhbGc... (keep this secret!)
   ```

### Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: Never commit `.env` to version control!

### Step 4: Run Database Schema

1. Open your Supabase project
2. Go to **SQL Editor**
3. Open the file `backend/database/schema.sql`
4. Copy all contents
5. Paste into SQL Editor
6. Click **Run**
7. Verify success (should see "Success. No rows returned")

### Step 5: Set Up Storage Buckets

#### Create Health Records Bucket
1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Configure:
   - **Name**: `health-records`
   - **Public**: No (Private)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `application/pdf, image/jpeg, image/png, image/jpg`

4. Add storage policies (in SQL Editor):
```sql
-- Allow users to upload their own files
CREATE POLICY "Users can upload own health records"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'health-records' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own files
CREATE POLICY "Users can view own health records"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'health-records' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own health records"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'health-records' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Create Profile Avatars Bucket
1. Click **New Bucket**
2. Configure:
   - **Name**: `profile-avatars`
   - **Public**: Yes
   - **File size limit**: 2 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/jpg, image/webp`

3. Add storage policies:
```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 6: Configure Authentication

#### Enable Email Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - **Enable email confirmations**: Yes
   - **Secure email change**: Yes
   - **Secure password change**: Yes

#### Configure Google OAuth (Optional)
1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Get credentials from [Google Cloud Console](https://console.cloud.google.com):
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
4. Add Client ID and Client Secret to Supabase

#### Set Up Email Templates
1. Go to **Authentication** → **Email Templates**
2. Customize templates:
   - **Confirm signup**: Welcome email with verification link
   - **Reset password**: Password reset instructions
   - **Magic Link**: Passwordless login link

#### Configure URLs
1. Go to **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `https://your-app-domain.com`
   - **Redirect URLs**: 
     ```
     exp://localhost:8081
     your-app-scheme://
     https://your-app-domain.com
     ```

### Step 7: Enable HIPAA Compliance

1. Go to **Settings** → **Billing**
2. Upgrade to **Pro Plan** (minimum required)
3. Contact Supabase support to request BAA (Business Associate Agreement)
4. Enable additional security features:
   - Go to **Settings** → **Database**
   - Enable **Point-in-Time Recovery (PITR)**
   - Set retention to 7 days minimum

### Step 8: Test the Connection

Run this test in your app:

```typescript
import { supabase } from '@/lib/supabase';

async function testConnection() {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Database connected successfully');
    
    // Test auth
    const { data: session } = await supabase.auth.getSession();
    console.log('✅ Auth configured correctly');
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  }
}
```

## Database Schema

### Tables Created

1. **profiles** - User profile information
2. **medications** - Medication tracking
3. **health_records** - Medical documents and records
4. **medical_conditions** - Medical conditions history
5. **surgeries** - Surgical history
6. **allergies** - Allergy information
7. **emergency_contacts** - Emergency contact list
8. **health_tracker_data** - Daily health metrics
9. **connected_devices** - Device integrations
10. **appointments** - Medical appointments
11. **symptom_logs** - Symptom tracking
12. **user_preferences** - App settings
13. **audit_logs** - HIPAA compliance audit trail

### Security Features

All tables have:
- ✅ Row Level Security (RLS) enabled
- ✅ User can only access their own data
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Data validation constraints
- ✅ Indexed for performance

## API Development

### Creating tRPC Procedures

Example: Get user profile

```typescript
// backend/trpc/routes/profile/get.ts
import { protectedProcedure } from '../../create-context';
import { supabaseServer } from '../../../lib/supabase-server';

export const getProfileProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('id', ctx.user.id)
    .single();
  
  if (error) throw error;
  return data;
});
```

Example: Add medication

```typescript
// backend/trpc/routes/medications/add.ts
import { z } from 'zod';
import { protectedProcedure } from '../../create-context';
import { supabaseServer } from '../../../lib/supabase-server';

export const addMedicationProcedure = protectedProcedure
  .input(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.enum(['daily', 'weekly', 'as_needed', 'custom']),
    time: z.array(z.string()),
    start_date: z.string(),
    end_date: z.string().optional(),
    notes: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await supabaseServer
      .from('medications')
      .insert({
        user_id: ctx.user.id,
        ...input,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });
```

### Using in Client

```typescript
import { trpc } from '@/lib/trpc';

function ProfileScreen() {
  const profileQuery = trpc.profile.get.useQuery();
  
  const addMedicationMutation = trpc.medications.add.useMutation({
    onSuccess: () => {
      console.log('Medication added!');
    }
  });
  
  if (profileQuery.isLoading) return <Text>Loading...</Text>;
  
  return (
    <View>
      <Text>{profileQuery.data?.full_name}</Text>
    </View>
  );
}
```

## File Upload

### Uploading Health Records

```typescript
import { supabase } from '@/lib/supabase';
import * as DocumentPicker from 'expo-document-picker';

async function uploadHealthRecord() {
  // Pick file
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'image/*'],
  });
  
  if (result.type === 'cancel') return;
  
  // Get user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // Upload to storage
  const fileName = `${user.id}/${Date.now()}_${result.name}`;
  const { data, error } = await supabase.storage
    .from('health-records')
    .upload(fileName, result.uri);
  
  if (error) throw error;
  
  // Save record to database
  const { data: record } = await supabase
    .from('health_records')
    .insert({
      user_id: user.id,
      title: result.name,
      type: 'other',
      date: new Date().toISOString(),
      file_url: data.path,
      file_name: result.name,
    })
    .select()
    .single();
  
  return record;
}
```

### Downloading Files

```typescript
async function downloadHealthRecord(filePath: string) {
  const { data, error } = await supabase.storage
    .from('health-records')
    .download(filePath);
  
  if (error) throw error;
  return data;
}
```

## Real-time Subscriptions

### Subscribe to Medication Changes

```typescript
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function useMedicationSubscription(userId: string) {
  useEffect(() => {
    const subscription = supabase
      .channel('medications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Medication changed:', payload);
          // Refetch data or update state
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
}
```

## Monitoring & Maintenance

### Database Health
- Monitor in **Database** → **Usage**
- Check storage usage
- Monitor connection count
- Review slow queries

### Backup & Recovery
1. Enable PITR: **Settings** → **Database** → **Point-in-Time Recovery**
2. Set retention period (7 days minimum for HIPAA)
3. Test restore process monthly

### Security Audits
1. Review audit logs regularly
2. Monitor failed authentication attempts
3. Check for unusual data access patterns
4. Update RLS policies as needed

## Troubleshooting

### Common Issues

**Issue**: RLS policy error
```
Error: new row violates row-level security policy
```
**Solution**: Check user is authenticated and policy allows operation

**Issue**: Storage upload fails
```
Error: new row violates row-level security policy for table "objects"
```
**Solution**: Verify storage policies are created correctly

**Issue**: Connection timeout
```
Error: Failed to connect to database
```
**Solution**: Check environment variables and network connectivity

## Next Steps

1. ✅ Database schema created
2. ✅ tRPC procedures created (20+ endpoints)
3. ✅ TypeScript types generated
4. ✅ Authentication integration ready
5. ⏳ Deploy database schema to Supabase
6. ⏳ Create storage buckets
7. ⏳ Test connection
8. ⏳ Replace mock data with real API calls
9. ⏳ Set up monitoring and alerts
10. ⏳ Request BAA from Supabase
11. ⏳ Conduct security audit
12. ⏳ Test backup and recovery

**👉 Read [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md) to get started!**

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [HIPAA Compliance Guide](https://supabase.com/docs/guides/platform/hipaa)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## Support

For issues:
1. Check Supabase logs in Dashboard
2. Review RLS policies
3. Verify environment variables
4. Test with Supabase SQL Editor
5. Contact Supabase support for infrastructure issues
