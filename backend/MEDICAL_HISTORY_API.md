# Medical History API Documentation

## Overview
The Medical History API provides endpoints for managing medical conditions, surgeries, and allergies for authenticated users. This API is designed to work seamlessly with the frontend MedicalHistoryContext and provides exactly the functionality needed by the React Native app.

## Base URL
```
http://localhost:8000/api/medical-history/
```

## Authentication
All endpoints require a valid JWT access token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Frontend Integration
This API is designed to replace the AsyncStorage-based medical history context in the frontend. The response format matches the frontend's expected data structure exactly.

---

## Medical Conditions

### List Medical Conditions
**GET** `/conditions/`

Returns all medical conditions for the authenticated user.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "name": "Diabetes Type 2",
            "diagnosedDate": "2023-01-15",
            "status": "active",
            "notes": "Well controlled with medication",
            "createdAt": "2024-01-01T10:00:00Z",
            "updatedAt": "2024-01-01T10:00:00Z"
        }
    ],
    "count": 1
}
```

### Create Medical Condition
**POST** `/conditions/`

Creates a new medical condition.

**Request Body:**
```json
{
    "name": "Hypertension",
    "diagnosedDate": "2023-06-01",
    "status": "active",
    "notes": "Mild hypertension, monitoring blood pressure"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Medical condition added successfully",
    "data": {
        "id": "uuid",
        "name": "Hypertension",
        "diagnosedDate": "2023-06-01",
        "status": "active",
        "notes": "Mild hypertension, monitoring blood pressure",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
    }
}
```

### Get Medical Condition
**GET** `/conditions/{id}/`

Returns a specific medical condition.

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "name": "Diabetes Type 2",
        "diagnosedDate": "2023-01-15",
        "status": "active",
        "notes": "Well controlled with medication",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
    }
}
```

### Update Medical Condition
**PUT/PATCH** `/conditions/{id}/`

Updates a medical condition.

**Request Body:**
```json
{
    "name": "Diabetes Type 2",
    "diagnosedDate": "2023-01-15",
    "status": "chronic",
    "notes": "Well controlled with medication and diet"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Medical condition updated successfully",
    "data": {
        "id": "uuid",
        "name": "Diabetes Type 2",
        "diagnosedDate": "2023-01-15",
        "status": "chronic",
        "notes": "Well controlled with medication and diet",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T11:00:00Z"
    }
}
```

### Delete Medical Condition
**DELETE** `/conditions/{id}/`

Deletes a medical condition.

**Response:**
```json
{
    "success": true,
    "message": "Medical condition deleted successfully"
}
```

---

## Surgeries

### List Surgeries
**GET** `/surgeries/`

Returns all surgeries for the authenticated user.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "name": "Appendectomy",
            "date": "2022-03-15",
            "hospital": "City General Hospital",
            "surgeon": "Dr. Smith",
            "notes": "Laparoscopic procedure, recovery was smooth",
            "createdAt": "2024-01-01T10:00:00Z",
            "updatedAt": "2024-01-01T10:00:00Z"
        }
    ],
    "count": 1
}
```

### Create Surgery
**POST** `/surgeries/`

Creates a new surgery record.

**Request Body:**
```json
{
    "name": "Knee Replacement",
    "date": "2023-08-20",
    "hospital": "Orthopedic Center",
    "surgeon": "Dr. Johnson",
    "notes": "Left knee, titanium implant"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Surgery added successfully",
    "data": {
        "id": "uuid",
        "name": "Knee Replacement",
        "date": "2023-08-20",
        "hospital": "Orthopedic Center",
        "surgeon": "Dr. Johnson",
        "notes": "Left knee, titanium implant",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
    }
}
```

### Get Surgery
**GET** `/surgeries/{id}/`

Returns a specific surgery.

### Update Surgery
**PUT/PATCH** `/surgeries/{id}/`

Updates a surgery record.

### Delete Surgery
**DELETE** `/surgeries/{id}/`

Deletes a surgery record.

---

## Allergies

### List Allergies
**GET** `/allergies/`

Returns all allergies for the authenticated user.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "allergen": "Penicillin",
            "reaction": "Skin rash and hives",
            "severity": "moderate",
            "notes": "Avoid all penicillin-based antibiotics",
            "createdAt": "2024-01-01T10:00:00Z",
            "updatedAt": "2024-01-01T10:00:00Z"
        }
    ],
    "count": 1
}
```

### Create Allergy
**POST** `/allergies/`

Creates a new allergy record.

**Request Body:**
```json
{
    "allergen": "Shellfish",
    "reaction": "Severe swelling and difficulty breathing",
    "severity": "severe",
    "notes": "Carry epinephrine auto-injector"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Allergy added successfully",
    "data": {
        "id": "uuid",
        "allergen": "Shellfish",
        "reaction": "Severe swelling and difficulty breathing",
        "severity": "severe",
        "notes": "Carry epinephrine auto-injector",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z"
    }
}
```

### Get Allergy
**GET** `/allergies/{id}/`

Returns a specific allergy.

### Update Allergy
**PUT/PATCH** `/allergies/{id}/`

Updates an allergy record.

### Delete Allergy
**DELETE** `/allergies/{id}/`

Deletes an allergy record.

---

## Field Definitions

### Medical Condition Status
- `active`: Currently active condition
- `resolved`: Condition has been resolved
- `chronic`: Long-term chronic condition

### Allergy Severity
- `mild`: Minor reactions
- `moderate`: Moderate reactions requiring attention
- `severe`: Severe reactions requiring immediate medical attention

---

## Error Responses

### Validation Error
```json
{
    "error": true,
    "message": "Failed to add medical condition",
    "details": {
        "name": ["This field is required."],
        "diagnosed_date": ["Date cannot be in the future."]
    }
}
```

### Authentication Error
```json
{
    "error": true,
    "message": "Authentication credentials were not provided.",
    "details": {}
}
```

### Not Found Error
```json
{
    "error": true,
    "message": "Not found.",
    "details": {}
}
```

---

## Frontend Integration

This API is designed to replace the AsyncStorage-based medical history context in your React Native app. The response format matches the frontend's expected data structure exactly.

### Frontend Context Functions → API Endpoints
```typescript
// Frontend Context Functions (from MedicalHistoryContext.tsx):
addCondition()     → POST   /api/medical-history/conditions/
updateCondition()  → PUT    /api/medical-history/conditions/{id}/
deleteCondition()  → DELETE /api/medical-history/conditions/{id}/
addSurgery()       → POST   /api/medical-history/surgeries/
updateSurgery()    → PUT    /api/medical-history/surgeries/{id}/
deleteSurgery()    → DELETE /api/medical-history/surgeries/{id}/
addAllergy()       → POST   /api/medical-history/allergies/
updateAllergy()    → PUT    /api/medical-history/allergies/{id}/
deleteAllergy()    → DELETE /api/medical-history/allergies/{id}/
```

### Data Structure Match
```typescript
// Frontend expects (from MedicalHistoryContext.tsx):
interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;  // camelCase
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

// API returns exactly this format:
{
  "id": "uuid",
  "name": "Diabetes",
  "diagnosedDate": "2023-01-15",  // ✅ camelCase
  "status": "active",
  "notes": "Well controlled"
}
```

### Example Frontend Integration
```typescript
// Replace AsyncStorage calls with API calls in MedicalHistoryContext.tsx
const addCondition = async (condition: Omit<MedicalCondition, 'id'>) => {
  const response = await fetch('/api/medical-history/conditions/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(condition)
  });
  
  const result = await response.json();
  if (result.success) {
    // Update local state with new condition
    setData(prev => ({
      ...prev,
      conditions: [...prev.conditions, result.data]
    }));
  }
};
```

---

## Security Features

- **User Isolation**: Users can only access their own medical history
- **JWT Authentication**: All endpoints require valid authentication
- **Input Validation**: All inputs are validated and sanitized
- **Audit Trail**: All changes are tracked with timestamps
- **Data Integrity**: Foreign key constraints ensure data consistency

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per user
- 1000 requests per hour per user

---

## Testing

Use the following Postman collection structure:

1. **Authentication**: Login to get access token
2. **Medical Conditions**: Test CRUD operations (GET, POST, PUT, DELETE)
3. **Surgeries**: Test CRUD operations (GET, POST, PUT, DELETE)
4. **Allergies**: Test CRUD operations (GET, POST, PUT, DELETE)

### Quick Test Workflow
1. **Login** → Get access token
2. **Create** → Add a medical condition, surgery, or allergy
3. **Read** → List all items or get specific item
4. **Update** → Modify an existing item
5. **Delete** → Remove an item

All endpoints return consistent success/error response formats for easy frontend integration.
