# Medication Management API - Frontend Ready

## Overview

This API provides exactly what the frontend needs for medication management. It matches the frontend `MedicationContext` interface perfectly.

## Base URL
```
http://localhost:8000/api/medications/
```

## Authentication
All endpoints require JWT authentication:
```
Authorization: Bearer <your_jwt_token>
```

## Frontend Interface Match

The API responses match the frontend `Medication` interface exactly:

```typescript
interface Medication {
  id: string;                    // ✅ MED-ABC12345 format
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  reminderEnabled: boolean;
  taken: boolean;
  dateAdded: string;
  startDateObj: Date;
  endDateObj?: Date;
}
```

## API Endpoints

### 1. Medication CRUD Operations

#### List Medications
```http
GET /api/medications/
```

**Query Parameters:**
- `date` (optional): Filter medications active on specific date (YYYY-MM-DD)
- `start_date` (optional): Filter by start date range
- `end_date` (optional): Filter by end date range
- `is_active` (optional): Filter by active status (true/false)

**Response:**
```json
[
  {
    "id": "MED-ABC12345",
    "name": "Aspirin",
    "medication_type": "Pill",
    "dosage_display": "100mg",
    "frequency": "Daily",
    "start_date": "2024-01-15",
    "end_date": "2024-02-15",
    "is_active": true,
    "is_current": true,
    "reminder_count": 2,
    "created_at": "2024-01-15T10:30:00Z",
    "time": ["08:00 AM", "08:00 PM"],
    "startDate": "January 15, 2024",
    "endDate": "February 15, 2024",
    "reminderEnabled": true,
    "dateAdded": "2024-01-15",
    "taken": false
  }
]
```

#### Create Medication
```http
POST /api/medications/
```

**Request Body:**
```json
{
  "name": "Aspirin",
  "medication_type": "Pill",
  "dosage_amount": 100,
  "dosage_unit": "mg",
  "frequency": "Daily",
  "start_date": "2024-01-15",
  "end_date": "2024-02-15",
  "notes": "Take with food",
  "reminder_times": ["08:00", "20:00"]
}
```

**Response:** Full medication object with all frontend interface fields.

#### Get Medication Details
```http
GET /api/medications/{id}/
```

**Response:** Full medication object with all details.

#### Update Medication
```http
PUT /api/medications/{id}/
PATCH /api/medications/{id}/
```

**Request Body:** Same as create, all fields optional for PATCH.

#### Delete Medication
```http
DELETE /api/medications/{id}/
```

**Response:** 204 No Content

### 2. Medication Tracking (Frontend Functions)

#### Toggle Medication Taken (matches `toggleMedicationTaken`)
```http
POST /api/medications/{medication_id}/toggle-taken/
```

**Response:**
```json
{
  "id": "uuid",
  "date": "2024-01-20",
  "taken": true,
  "created_at": "2024-01-20T08:15:00Z",
  "updated_at": "2024-01-20T08:15:00Z"
}
```

#### Get Today's Medications (for Dashboard)
```http
GET /api/medications/today/
```

**Response:**
```json
[
  {
    "id": "MED-ABC12345",
    "name": "Aspirin",
    "dosage": "100mg",
    "time": ["08:00 AM", "08:00 PM"],
    "taken": false,
    "medication_type": "Pill",
    "notes": "Take with food"
  }
]
```

#### Get Calendar Data (for Calendar View)
```http
GET /api/medications/calendar/?month=1&year=2024
```

**Query Parameters:**
- `month` (required): Month number (1-12)
- `year` (required): Year (e.g., 2024)

**Response:**
```json
{
  "2024-01-20": [
    {
      "id": "MED-ABC12345",
      "name": "Aspirin",
      "dosage": "100mg",
      "time": ["08:00 AM", "08:00 PM"],
      "taken": true,
      "medication_type": "Pill"
    }
  ],
  "2024-01-21": [
    {
      "id": "MED-ABC12345",
      "name": "Aspirin",
      "dosage": "100mg",
      "time": ["08:00 AM", "08:00 PM"],
      "taken": false,
      "medication_type": "Pill"
    }
  ]
}
```

### 3. Taken Records Management

#### List Taken Records
```http
GET /api/medications/taken/
```

**Query Parameters:**
- `medication` (optional): Filter by medication ID
- `date` (optional): Filter by specific date
- `taken` (optional): Filter by taken status (true/false)

#### Create Taken Record
```http
POST /api/medications/taken/
```

**Request Body:**
```json
{
  "medication": "medication_uuid",
  "date": "2024-01-20",
  "taken": true
}
```

#### Update Taken Record
```http
PUT /api/medications/taken/{id}/
PATCH /api/medications/taken/{id}/
```

**Request Body:**
```json
{
  "taken": true
}
```

## Frontend Integration Examples

### Creating a Medication (matches frontend `addMedication`)
```javascript
const medicationData = {
  name: "Aspirin",
  medication_type: "Pill",
  dosage_amount: 100,
  dosage_unit: "mg",
  frequency: "Daily",
  start_date: "2024-01-15",
  end_date: "2024-02-15",
  notes: "Take with food",
  reminder_times: ["08:00", "20:00"]
};

const response = await fetch('/api/medications/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(medicationData)
});
```

### Toggling Medication Taken (matches frontend `toggleMedicationTaken`)
```javascript
const response = await fetch(`/api/medications/${medicationId}/toggle-taken/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Getting Today's Medications (for Dashboard)
```javascript
const response = await fetch('/api/medications/today/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const todayMedications = await response.json();
```

### Getting Calendar Data (for Calendar View)
```javascript
const response = await fetch('/api/medications/calendar/?month=1&year=2024', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const calendarData = await response.json();
```

### Getting Medications by Date (for MyMedicationScreen)
```javascript
const response = await fetch('/api/medications/?date=2024-01-20', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const medications = await response.json();
```

## Database Schema (Simplified)

### Medication Table
- `id`: UUID (Primary Key)
- `user`: Foreign Key to User
- `name`: CharField (200)
- `medication_type`: CharField (50) - Choices from MedicationType
- `dosage_amount`: DecimalField (10,3)
- `dosage_unit`: CharField (20) - Choices from DosageUnit
- `frequency`: CharField (50) - Choices from FrequencyType
- `start_date`: DateField
- `end_date`: DateField (nullable)
- `notes`: TextField
- `reminder_enabled`: BooleanField
- `is_active`: BooleanField
- `created_at`: DateTimeField
- `updated_at`: DateTimeField

### MedicationReminder Table
- `id`: UUID (Primary Key)
- `medication`: Foreign Key to Medication
- `time`: TimeField
- `is_active`: BooleanField
- `created_at`: DateTimeField

### MedicationTaken Table
- `id`: UUID (Primary Key)
- `medication`: Foreign Key to Medication
- `date`: DateField
- `taken`: BooleanField
- `created_at`: DateTimeField
- `updated_at`: DateTimeField

## Key Features

1. **Exact Frontend Match**: All responses match the frontend `Medication` interface
2. **Simple Taken Tracking**: Boolean taken status per day (no complex timestamps)
3. **Calendar Integration**: Easy calendar data retrieval
4. **Dashboard Ready**: Today's medications endpoint
5. **Toggle Function**: Matches frontend `toggleMedicationTaken` function
6. **Reminder Times**: Array of times as expected by frontend
7. **Date Handling**: Proper date formatting for frontend consumption

