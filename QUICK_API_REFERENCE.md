# Quick API Reference

## 🚀 Common Operations

### Authentication

```typescript
import { supabase } from '@/lib/supabase';

// Sign Up
await supabase.auth.signUp({ email, password });

// Sign In
await supabase.auth.signInWithPassword({ email, password });

// Sign Out
await supabase.auth.signOut();

// Get Current User
const { data: { user } } = await supabase.auth.getUser();

// Get Session
const { data: { session } } = await supabase.auth.getSession();
```

---

## 📊 Profile Operations

```typescript
import { trpc } from '@/lib/trpc';

// Get Profile
const { data: profile } = trpc.profile.get.useQuery();

// Update Profile
const updateProfile = trpc.profile.update.useMutation();
updateProfile.mutate({
  full_name: 'John Doe',
  height_feet: 5,
  height_inches: 10,
  weight_lbs: 170,
  blood_type: 'O+',
});
```

---

## 💊 Medication Operations

```typescript
import { trpc } from '@/lib/trpc';

// Get All Medications
const { data: medications } = trpc.medications.getAll.useQuery();

// Add Medication
const addMed = trpc.medications.add.useMutation();
addMed.mutate({
  name: 'Aspirin',
  dosage: '100mg',
  frequency: 'daily',
  time: ['09:00', '21:00'],
  start_date: '2025-01-01',
  notes: 'Take with food',
  reminder_enabled: true,
});

// Update Medication
const updateMed = trpc.medications.update.useMutation();
updateMed.mutate({
  id: 'medication-id',
  taken: true,
});

// Delete Medication
const deleteMed = trpc.medications.delete.useMutation();
deleteMed.mutate({ id: 'medication-id' });
```

---

## 📋 Health Records Operations

```typescript
import { trpc } from '@/lib/trpc';

// Get All Health Records
const { data: records } = trpc.healthRecords.getAll.useQuery();

// Add Health Record
const addRecord = trpc.healthRecords.add.useMutation();
addRecord.mutate({
  title: 'Blood Test Results',
  type: 'lab_result',
  date: '2025-01-15',
  description: 'Annual checkup blood work',
  notes: 'All values normal',
});
```

---

## 🚨 Emergency Contacts Operations

```typescript
import { trpc } from '@/lib/trpc';

// Get All Emergency Contacts
const { data: contacts } = trpc.emergencyContacts.getAll.useQuery();

// Add Emergency Contact
const addContact = trpc.emergencyContacts.add.useMutation();
addContact.mutate({
  name: 'Jane Doe',
  relationship: 'Spouse',
  phone_number: '+1234567890',
  email: 'jane@example.com',
  is_primary: true,
});

// Update Emergency Contact
const updateContact = trpc.emergencyContacts.update.useMutation();
updateContact.mutate({
  id: 'contact-id',
  phone_number: '+0987654321',
});

// Delete Emergency Contact
const deleteContact = trpc.emergencyContacts.delete.useMutation();
deleteContact.mutate({ id: 'contact-id' });
```

---

## 🏥 Medical History Operations

```typescript
import { trpc } from '@/lib/trpc';

// Get Medical Conditions
const { data: conditions } = trpc.medicalHistory.getConditions.useQuery();

// Add Medical Condition
const addCondition = trpc.medicalHistory.addCondition.useMutation();
addCondition.mutate({
  name: 'Hypertension',
  diagnosed_date: '2020-05-15',
  status: 'active',
  notes: 'Controlled with medication',
});

// Get Allergies
const { data: allergies } = trpc.medicalHistory.getAllergies.useQuery();

// Add Allergy
const addAllergy = trpc.medicalHistory.addAllergy.useMutation();
addAllergy.mutate({
  allergen: 'Penicillin',
  reaction: 'Rash and itching',
  severity: 'moderate',
  notes: 'Avoid all penicillin-based antibiotics',
});

// Get Surgeries
const { data: surgeries } = trpc.medicalHistory.getSurgeries.useQuery();

// Add Surgery
const addSurgery = trpc.medicalHistory.addSurgery.useMutation();
addSurgery.mutate({
  name: 'Appendectomy',
  date: '2018-03-20',
  hospital: 'City General Hospital',
  surgeon: 'Dr. Smith',
  notes: 'Laparoscopic procedure, no complications',
});
```

---

## 🔄 Invalidating Queries (Refresh Data)

```typescript
import { trpc } from '@/lib/trpc';

const utils = trpc.useUtils();

// After a mutation, invalidate to refresh data
const addMed = trpc.medications.add.useMutation({
  onSuccess: () => {
    // This will refetch the medications list
    utils.medications.getAll.invalidate();
  },
});
```

---

## ⚡ Loading States

```typescript
const { data, isLoading, error, refetch } = trpc.profile.get.useQuery();

if (isLoading) {
  return <ActivityIndicator />;
}

if (error) {
  return <Text>Error: {error.message}</Text>;
}

return <Text>{data?.full_name}</Text>;
```

---

## 🎯 Mutation States

```typescript
const updateProfile = trpc.profile.update.useMutation({
  onSuccess: (data) => {
    console.log('Profile updated:', data);
  },
  onError: (error) => {
    console.error('Update failed:', error);
  },
});

// Check mutation state
if (updateProfile.isPending) {
  return <ActivityIndicator />;
}

// Trigger mutation
updateProfile.mutate({ full_name: 'New Name' });
```

---

## 📱 Complete Component Example

```typescript
import { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { trpc } from '@/lib/trpc';

export function ProfileScreen() {
  const [name, setName] = useState('');
  
  // Query
  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  
  // Mutation
  const utils = trpc.useUtils();
  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      alert('Profile updated!');
    },
    onError: (error) => {
      alert('Error: ' + error.message);
    },
  });
  
  if (isLoading) {
    return <ActivityIndicator />;
  }
  
  return (
    <View>
      <Text>Current Name: {profile?.full_name}</Text>
      
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter new name"
      />
      
      <Button
        title="Update Profile"
        onPress={() => updateProfile.mutate({ full_name: name })}
        disabled={updateProfile.isPending}
      />
      
      {updateProfile.isPending && <ActivityIndicator />}
    </View>
  );
}
```

---

## 🔍 TypeScript Types

All API responses are fully typed! Your IDE will show you:

```typescript
// profile is typed as Database['public']['Tables']['profiles']['Row']
const { data: profile } = trpc.profile.get.useQuery();

// TypeScript knows all available fields
profile?.full_name
profile?.height_feet
profile?.weight_lbs
profile?.blood_type
// etc...
```

---

## 💡 Pro Tips

1. **Always invalidate queries after mutations** to keep UI in sync
2. **Use optimistic updates** for better UX (update UI before server responds)
3. **Handle loading and error states** for better user experience
4. **Use React Query devtools** to debug queries (available in web)
5. **Batch related mutations** to reduce network requests

---

## 🆘 Need Help?

- Check `BACKEND_INTEGRATION_GUIDE.md` for detailed setup
- Check `SUPABASE_SETUP.md` for Supabase configuration
- Check `backend/database/schema.sql` for database structure
- Check `backend/database/types.ts` for TypeScript types
