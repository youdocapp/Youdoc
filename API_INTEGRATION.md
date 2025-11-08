# API Integration Guide

## Overview

This document describes the complete API integration for the Youdoc React Native app. All endpoints from the Django backend have been integrated using React Query for efficient data fetching and caching.

## Architecture

### API Service Layer (`lib/api/`)

All API services are organized in the `lib/api/` directory:

- **`client.ts`**: Base API client with automatic token refresh
- **`auth.ts`**: Authentication service (register, login, OTP, profile, etc.)
- **`medication.ts`**: Medication management service
- **`health-records.ts`**: Health records service with file upload support
- **`medical-history.ts`**: Medical history service (conditions, surgeries, allergies)
- **`emergency-contacts.ts`**: Emergency contacts service
- **`health-tracking.ts`**: Health tracking service with device integration
- **`notifications.ts`**: Notifications service
- **`articles.ts`**: Articles service with comments, likes, bookmarks

### Context Providers (`contexts/`)

All contexts have been updated to use React Query:

- **`AuthContext.tsx`**: Authentication state management
- **`MedicationContext.tsx`**: Medication state with React Query
- **`HealthRecordsContext.tsx`**: Health records state
- **`MedicalHistoryContext.tsx`**: Medical history state
- **`EmergencyContactsContext.tsx`**: Emergency contacts state
- **`HealthTrackerContext.tsx`**: Health tracking with platform integration
- **`NotificationsContext.tsx`**: (To be created)

## Environment Setup

### 1. Create `.env` file

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_BASE_URL=https://youdoc.onrender.com/api
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure API Base URL

The API base URL is automatically read from:
1. `EXPO_PUBLIC_API_BASE_URL` environment variable
2. `app.json` extra config (if set)
3. Default: `https://youdoc.onrender.com/api`

## Authentication Flow

### Registration Flow

```typescript
import { useAuth } from '@/contexts/AuthContext'

const { register, verifyOTP } = useAuth()

// 1. Register user
const result = await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  passwordConfirm: 'SecurePass123!',
})

if (result.success) {
  // 2. Verify OTP
  const verifyResult = await verifyOTP({
    email: 'john@example.com',
    otp: '123456',
  })
  
  if (verifyResult.success) {
    // User is now logged in
  }
}
```

### Login Flow

```typescript
const { login } = useAuth()

const result = await login({
  email: 'john@example.com',
  password: 'SecurePass123!',
})

if (result.success) {
  // User is logged in, tokens stored automatically
}
```

### Token Management

- Access tokens are automatically stored in AsyncStorage
- Token refresh happens automatically on 401 errors
- Tokens are cleared on logout

## Using Contexts

### Medication Context

```typescript
import { useMedication } from '@/contexts/MedicationContext'

const {
  medications,
  todayMedications,
  isLoading,
  createMedication,
  toggleMedicationTaken,
} = useMedication()

// Create medication
await createMedication({
  name: 'Aspirin',
  medication_type: 'Pill',
  dosage_amount: 100,
  dosage_unit: 'mg',
  frequency: 'Daily',
  start_date: '2024-01-15',
  reminder_times: ['08:00', '20:00'],
})

// Toggle taken status
await toggleMedicationTaken('MED-ABC12345')
```

### Health Records Context

```typescript
import { useHealthRecords } from '@/contexts/HealthRecordsContext'
import * as ImagePicker from 'expo-image-picker'

const { addRecord } = useHealthRecords()

// Pick image
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
})

if (!result.canceled) {
  await addRecord({
    title: 'Blood Test Results',
    type: 'lab_result',
    date: '2024-01-15',
    description: 'Complete blood count',
  }, {
    uri: result.assets[0].uri,
    type: 'image/jpeg',
    name: 'blood_test.jpg',
  })
}
```

### Health Tracking Context

```typescript
import { useHealthTracker } from '@/contexts/HealthTrackerContext'

const {
  healthData,
  connectedDevices,
  syncWithPlatform,
  updateHealthData,
} = useHealthTracker()

// Sync with Google Fit (Android) or Apple Health (iOS)
await syncWithPlatform()

// Manually update health data
await updateHealthData({
  steps: 8500,
  heartRate: 72,
  distance: 6.2,
})
```

## Google Fit Integration (Android)

### Setup Required

1. **Google Cloud Console:**
   - Create OAuth 2.0 credentials
   - Enable Google Fit API
   - Configure OAuth consent screen

2. **Android Configuration:**
   - Add Google Sign-In configuration
   - Request necessary permissions

3. **Implementation:**
   - Use `googleFitService` from `lib/health/google-fit.ts`
   - Initialize and request permissions
   - Sync health data

### Example Usage

```typescript
import { googleFitService } from '@/lib/health/google-fit'

// Initialize
await googleFitService.initialize({
  scopes: ['https://www.googleapis.com/auth/fitness.activity.read'],
})

// Request permissions
await googleFitService.requestPermissions()

// Sync data
const data = await googleFitService.syncHealthData()
```

## Apple Health Integration (iOS)

### Setup Required

1. **Xcode:**
   - Enable HealthKit capability
   - Add HealthKit framework

2. **Info.plist:**
   - Add `NSHealthShareUsageDescription`
   - Add `NSHealthUpdateUsageDescription`

3. **Implementation:**
   - Use `appleHealthService` from `lib/health/apple-health.ts`
   - Request permissions
   - Sync health data

### Example Usage

```typescript
import { appleHealthService } from '@/lib/health/apple-health'

// Initialize
await appleHealthService.initialize({
  permissions: {
    read: ['steps', 'heartRate', 'distance', 'sleep', 'weight'],
    write: [],
  },
})

// Request permissions
await appleHealthService.requestPermissions([
  'steps',
  'heartRate',
  'distance',
  'sleep',
  'weight',
])

// Sync data
const data = await appleHealthService.syncHealthData()
```

## Error Handling

All API calls return consistent error responses:

```typescript
try {
  const result = await someService.someMethod()
  if (result.success) {
    // Handle success
  } else {
    // Handle error
    console.error(result.error)
  }
} catch (error) {
  // Handle exception
  const apiError = error as ApiError
  console.error(apiError.message)
  console.error(apiError.details)
}
```

## React Query Features

### Automatic Caching

- Data is cached automatically
- Stale time configured per query
- Automatic refetching on focus

### Optimistic Updates

- Mutations update cache immediately
- Automatic rollback on error
- Query invalidation after mutations

### Example with React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { medicationService } from '@/lib/api'

// Fetch medications
const { data, isLoading, refetch } = useQuery({
  queryKey: ['medications'],
  queryFn: () => medicationService.getMedications(),
  staleTime: 30000, // 30 seconds
})

// Create medication
const createMutation = useMutation({
  mutationFn: (data) => medicationService.createMedication(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['medications'] })
  },
})
```

## File Uploads

Health records and articles support file uploads:

```typescript
import * as ImagePicker from 'expo-image-picker'

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.All,
  allowsEditing: true,
  quality: 1,
})

if (!result.canceled) {
  const file = {
    uri: result.assets[0].uri,
    type: result.assets[0].mimeType || 'image/jpeg',
    name: result.assets[0].fileName || 'file.jpg',
  }
  
  await healthRecordsService.createHealthRecord(data, file)
}
```

## Testing

### Development

1. Set up local backend or use production URL
2. Create test user account
3. Test all flows:
   - Registration → OTP verification → Login
   - Medication CRUD operations
   - Health records upload
   - Health tracking sync

### Production

- All API calls use HTTPS
- Tokens are securely stored
- Error handling is comprehensive
- Network errors are handled gracefully

## Next Steps

1. **Complete Notifications Context**: Create NotificationsContext with React Query
2. **Add Push Notifications**: Integrate FCM/APNS for push notifications
3. **Health Platform Integration**: Complete Google Fit and Apple Health implementations
4. **Error Boundaries**: Add error boundaries for better error handling
5. **Offline Support**: Add offline data persistence with React Query persistence

## Notes

- All endpoints are fully typed with TypeScript
- React Query provides automatic caching and synchronization
- Token refresh happens automatically
- File uploads use FormData
- Health platform integrations require platform-specific setup

