# Backend Integration Guide

## ✅ What's Been Set Up

Your Carepoint Health app now has a complete backend infrastructure with:

### 1. **Database Schema** (Ready to Deploy)
- ✅ User profiles with health metrics
- ✅ Medications tracking
- ✅ Health records management
- ✅ Medical history (conditions, surgeries, allergies)
- ✅ Emergency contacts
- ✅ Health tracker data
- ✅ Connected devices
- ✅ Appointments
- ✅ Symptom logs
- ✅ User preferences
- ✅ Audit logs (HIPAA compliance)

### 2. **tRPC API Endpoints** (Ready to Use)
All endpoints are protected and require authentication:

#### Profile
- `trpc.profile.get.useQuery()` - Get user profile
- `trpc.profile.update.useMutation()` - Update profile

#### Medications
- `trpc.medications.getAll.useQuery()` - Get all medications
- `trpc.medications.add.useMutation()` - Add medication
- `trpc.medications.update.useMutation()` - Update medication
- `trpc.medications.delete.useMutation()` - Delete medication

#### Health Records
- `trpc.healthRecords.getAll.useQuery()` - Get all health records
- `trpc.healthRecords.add.useMutation()` - Add health record

#### Emergency Contacts
- `trpc.emergencyContacts.getAll.useQuery()` - Get all contacts
- `trpc.emergencyContacts.add.useMutation()` - Add contact
- `trpc.emergencyContacts.update.useMutation()` - Update contact
- `trpc.emergencyContacts.delete.useMutation()` - Delete contact

#### Medical History
- `trpc.medicalHistory.getConditions.useQuery()` - Get conditions
- `trpc.medicalHistory.addCondition.useMutation()` - Add condition
- `trpc.medicalHistory.getAllergies.useQuery()` - Get allergies
- `trpc.medicalHistory.addAllergy.useMutation()` - Add allergy
- `trpc.medicalHistory.getSurgeries.useQuery()` - Get surgeries
- `trpc.medicalHistory.addSurgery.useMutation()` - Add surgery

---

## 🚀 Next Steps

### Step 1: Set Up Supabase Database

1. **Go to your Supabase project**: https://app.supabase.com
2. **Navigate to SQL Editor**
3. **Copy the entire contents** of `backend/database/schema.sql`
4. **Paste and run** the SQL script
5. **Verify tables were created** in the Table Editor

### Step 2: Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create two buckets:
   - `health-records` (Private) - for medical documents
   - `profile-avatars` (Public) - for user profile pictures

3. Set up storage policies:

**For health-records (Private):**
```sql
-- Allow users to upload their own files
CREATE POLICY "Users can upload own health records"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own files
CREATE POLICY "Users can view own health records"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**For profile-avatars (Public):**
```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to view avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-avatars');
```

### Step 3: Verify Environment Variables

Make sure your `.env` file has these variables set:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Backend API (automatically set by Rork)
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-backend-url
```

### Step 4: Test the Connection

Create a simple test to verify everything works:

```typescript
// In any component
import { trpc } from '@/lib/trpc';

function TestComponent() {
  const { data, isLoading, error } = trpc.example.hi.useQuery();
  
  console.log('API Response:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);
  
  return null;
}
```

---

## 📝 How to Use the API in Your App

### Example 1: Fetch User Profile

```typescript
import { trpc } from '@/lib/trpc';

function ProfileScreen() {
  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  
  if (isLoading) return <Text>Loading...</Text>;
  
  return (
    <View>
      <Text>{profile?.full_name}</Text>
      <Text>{profile?.email}</Text>
    </View>
  );
}
```

### Example 2: Update Profile

```typescript
import { trpc } from '@/lib/trpc';

function EditProfileScreen() {
  const utils = trpc.useUtils();
  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      // Invalidate and refetch profile
      utils.profile.get.invalidate();
    },
  });
  
  const handleSave = () => {
    updateProfile.mutate({
      full_name: 'John Doe',
      height_feet: 5,
      height_inches: 10,
      weight_lbs: 170,
    });
  };
  
  return (
    <Button onPress={handleSave}>
      Save Profile
    </Button>
  );
}
```

### Example 3: Add Medication

```typescript
import { trpc } from '@/lib/trpc';

function AddMedicationScreen() {
  const utils = trpc.useUtils();
  const addMedication = trpc.medications.add.useMutation({
    onSuccess: () => {
      utils.medications.getAll.invalidate();
    },
  });
  
  const handleAdd = () => {
    addMedication.mutate({
      name: 'Aspirin',
      dosage: '100mg',
      frequency: 'daily',
      time: ['09:00', '21:00'],
      start_date: '2025-01-01',
      reminder_enabled: true,
    });
  };
  
  return (
    <Button onPress={handleAdd}>
      Add Medication
    </Button>
  );
}
```

### Example 4: List Medications

```typescript
import { trpc } from '@/lib/trpc';

function MedicationsScreen() {
  const { data: medications, isLoading } = trpc.medications.getAll.useQuery();
  
  if (isLoading) return <Text>Loading...</Text>;
  
  return (
    <FlatList
      data={medications}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.dosage}</Text>
          <Text>{item.frequency}</Text>
        </View>
      )}
    />
  );
}
```

---

## 🔐 Authentication Flow

The backend automatically handles authentication:

1. **User signs up/in** → Supabase creates session
2. **Session token** → Automatically attached to all tRPC requests
3. **Backend validates** → Token checked on every protected endpoint
4. **User data** → Available in `ctx.user` in all protected procedures

### Sign Up Example

```typescript
import { supabase } from '@/lib/supabase';

const handleSignUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    console.error('Sign up error:', error);
    return;
  }
  
  // Profile is automatically created via database trigger
  console.log('User created:', data.user);
};
```

### Sign In Example

```typescript
import { supabase } from '@/lib/supabase';

const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Sign in error:', error);
    return;
  }
  
  console.log('User signed in:', data.user);
};
```

### Sign Out Example

```typescript
import { supabase } from '@/lib/supabase';

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error);
    return;
  }
  
  console.log('User signed out');
};
```

---

## 🔒 HIPAA Compliance Features

Your backend includes HIPAA compliance features:

1. **Row Level Security (RLS)** - Users can only access their own data
2. **Audit Logs** - All data changes are logged
3. **Encrypted Storage** - Supabase encrypts data at rest
4. **Secure Authentication** - JWT tokens with automatic refresh
5. **Data Retention** - Soft delete function maintains audit trail

---

## 🐛 Troubleshooting

### Issue: "Supabase URL or Anon Key is missing"
**Solution:** Check your `.env` file and restart the dev server

### Issue: "UNAUTHORIZED" error
**Solution:** Make sure user is signed in before calling protected endpoints

### Issue: "Failed to fetch profile"
**Solution:** 
1. Check if database schema is deployed
2. Verify user exists in `auth.users` table
3. Check if profile was created (should be automatic)

### Issue: TypeScript errors in tRPC calls
**Solution:** Restart TypeScript server in your IDE

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [HIPAA Compliance Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 What to Build Next

Now that your backend is ready, you can:

1. **Replace mock contexts** with real API calls
2. **Implement authentication** in your auth screens
3. **Connect profile screen** to real data
4. **Sync medications** with the database
5. **Add health records** upload functionality
6. **Implement emergency contacts** management
7. **Build medical history** forms

All the infrastructure is ready - just replace the mock data with tRPC calls!
