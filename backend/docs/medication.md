# Medication App Documentation

## Overview
The medication app manages user medications, reminders, and tracking. It provides comprehensive medication management with support for different medication types, dosages, schedules, and adherence tracking.

## Models

### Medication Model
**File**: `medication/models.py`

Main medication model with comprehensive medication information.

#### Key Fields:
- **id**: Custom ID with MED- prefix (e.g., MED-ABC12345)
- **user**: Foreign key to User model
- **name**: Medication name
- **medication_type**: Type (Pill, Injection, Drops, Inhaler, Cream, Spray)
- **dosage_amount**: Numeric dosage value
- **dosage_unit**: Unit (mg, ml, mcg, g, IU, units, tablets, capsules, drops, puffs, applications)
- **frequency**: Frequency (Daily, Weekly, As needed)
- **start_date**: When medication starts
- **end_date**: When medication ends (optional)
- **notes**: Additional instructions
- **reminder_enabled**: Whether reminders are active
- **is_active**: Whether medication is currently active
- **created_at, updated_at**: Timestamps

#### Key Methods:
- `dosage_display`: Returns formatted dosage string
- `is_current`: Checks if medication is active based on dates
- `get_reminder_times()`: Returns all reminder times

#### Enums:
- **MedicationType**: Pill, Injection, Drops, Inhaler, Cream, Spray
- **FrequencyType**: Daily, Weekly, As needed
- **DosageUnit**: mg, ml, mcg, g, IU, units, tablets, capsules, drops, puffs, applications

### MedicationReminder Model
**File**: `medication/models.py`

Stores reminder times for medications.

#### Key Fields:
- **id**: UUID primary key
- **medication**: Foreign key to Medication
- **time**: Time for reminder
- **is_active**: Whether reminder is active
- **created_at**: Timestamp

#### Features:
- Unique constraint on medication + time
- Ordered by time
- Cascade delete with medication

### MedicationTaken Model
**File**: `medication/models.py`

Tracks when medications are taken.

#### Key Fields:
- **id**: UUID primary key
- **medication**: Foreign key to Medication
- **date**: Date when taken
- **taken**: Boolean status
- **created_at, updated_at**: Timestamps

#### Features:
- Unique constraint on medication + date
- Indexed for performance
- Simple boolean tracking

## Serializers

### MedicationSerializer
**File**: `medication/serializers.py`

Full medication serializer with all fields and relationships.

### MedicationCreateSerializer
**File**: `medication/serializers.py`

Serializer for creating new medications with validation.

### MedicationUpdateSerializer
**File**: `medication/serializers.py`

Serializer for updating existing medications.

### MedicationListSerializer
**File**: `medication/serializers.py`

Optimized serializer for listing medications.

### MedicationTakenSerializer
**File**: `medication/serializers.py`

Serializer for medication taken records.

### MedicationTakenCreateSerializer
**File**: `medication/serializers.py`

Serializer for creating taken records.

### MedicationTakenUpdateSerializer
**File**: `medication/serializers.py`

Serializer for updating taken records.

## Views

### Medication Management

#### MedicationListCreateView
**Endpoint**: `GET/POST /api/medication/`

**GET - List Medications**:
- Returns user's medications
- Supports filtering by date, date range, active status
- Ordered by creation date

**Query Parameters**:
- `date`: Filter medications active on specific date
- `start_date, end_date`: Filter by date range
- `is_active`: Filter by active status (true/false)

**POST - Create Medication**:
- Creates new medication for authenticated user
- Validates all required fields
- Sets user automatically

#### MedicationDetailView
**Endpoint**: `GET/PUT/PATCH/DELETE /api/medication/{id}/`

**GET**: Retrieve specific medication
**PUT/PATCH**: Update medication
**DELETE**: Delete medication

### Medication Tracking

#### MedicationTakenListView
**Endpoint**: `GET/POST /api/medication/taken/`

**GET - List Taken Records**:
- Returns medication taken records
- Supports filtering by medication, date, taken status

**Query Parameters**:
- `medication`: Filter by medication ID
- `date`: Filter by specific date
- `taken`: Filter by taken status (true/false)

**POST - Create Taken Record**:
- Creates new taken record
- Validates medication belongs to user

#### MedicationTakenDetailView
**Endpoint**: `GET/PUT/PATCH/DELETE /api/medication/taken/{id}/`

**GET**: Retrieve specific taken record
**PUT/PATCH**: Update taken record
**DELETE**: Delete taken record

### Special Endpoints

#### Toggle Medication Taken
**Endpoint**: `POST /api/medication/{id}/toggle/`

**Purpose**: Toggle medication taken status for today

**Process**:
1. Gets or creates taken record for today
2. Toggles the taken status
3. Returns updated record

**Response**:
```json
{
  "id": "uuid",
  "medication": "MED-ABC12345",
  "date": "2024-01-15",
  "taken": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Medication Calendar
**Endpoint**: `GET /api/medication/calendar/`

**Purpose**: Get medication data for calendar view

**Query Parameters**:
- `month`: Month (1-12)
- `year`: Year (e.g., 2024)

**Response**:
```json
{
  "2024-01-15": [
    {
      "id": "MED-ABC12345",
      "name": "Aspirin",
      "dosage": "100mg",
      "time": ["08:00 AM", "08:00 PM"],
      "taken": true,
      "medication_type": "Pill"
    }
  ],
  "2024-01-16": [...]
}
```

#### Today's Medications
**Endpoint**: `GET /api/medication/today/`

**Purpose**: Get today's medications for dashboard

**Response**:
```json
[
  {
    "id": "MED-ABC12345",
    "name": "Aspirin",
    "dosage": "100mg",
    "time": ["08:00 AM", "08:00 PM"],
    "taken": true,
    "medication_type": "Pill",
    "notes": "Take with food"
  }
]
```

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/medication/` | GET | List medications | Yes |
| `/medication/` | POST | Create medication | Yes |
| `/medication/{id}/` | GET | Get medication | Yes |
| `/medication/{id}/` | PUT/PATCH | Update medication | Yes |
| `/medication/{id}/` | DELETE | Delete medication | Yes |
| `/medication/taken/` | GET | List taken records | Yes |
| `/medication/taken/` | POST | Create taken record | Yes |
| `/medication/taken/{id}/` | GET | Get taken record | Yes |
| `/medication/taken/{id}/` | PUT/PATCH | Update taken record | Yes |
| `/medication/taken/{id}/` | DELETE | Delete taken record | Yes |
| `/medication/{id}/toggle/` | POST | Toggle taken status | Yes |
| `/medication/calendar/` | GET | Get calendar data | Yes |
| `/medication/today/` | GET | Get today's medications | Yes |

## Data Models

### Medication Object
```json
{
  "id": "MED-ABC12345",
  "name": "Aspirin",
  "medication_type": "Pill",
  "dosage_amount": "100.000",
  "dosage_unit": "mg",
  "frequency": "Daily",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "notes": "Take with food",
  "reminder_enabled": true,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### MedicationTaken Object
```json
{
  "id": "uuid",
  "medication": "MED-ABC12345",
  "date": "2024-01-15",
  "taken": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### MedicationReminder Object
```json
{
  "id": "uuid",
  "medication": "MED-ABC12345",
  "time": "08:00:00",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Business Logic

### Medication Status
- **Active**: `is_active=True` and within date range
- **Current**: Based on start_date and end_date
- **Expired**: Past end_date
- **Future**: Before start_date

### Date Filtering
- Medications are considered active if:
  - `start_date <= filter_date`
  - `end_date` is null OR `end_date >= filter_date`

### Taken Tracking
- One record per medication per date
- Boolean status (taken/not taken)
- Automatic creation on toggle
- Historical tracking

## Frontend Integration

### Dashboard
- Use `/medication/today/` endpoint
- Display medications with taken status
- Toggle functionality for each medication

### Calendar View
- Use `/medication/calendar/` endpoint
- Display medications by date
- Show taken status for each day

### Medication Management
- CRUD operations via standard endpoints
- Form validation for required fields
- Date picker for start/end dates

### Adherence Tracking
- Visual indicators for taken status
- Historical view of adherence
- Statistics and reports

## Validation Rules

### Medication Creation
- Name is required
- Dosage amount must be positive
- Start date is required
- End date must be after start date
- User must be authenticated

### Taken Records
- Medication must belong to user
- Date must be valid
- Unique constraint on medication + date

## Performance Optimizations

### Database Indexes
- User + start_date index
- User + is_active index
- Medication + date index
- Date + taken index

### Query Optimization
- Select related for user data
- Filtered querysets by user
- Efficient date range queries

## Error Handling

### Common Errors
- Medication not found
- Permission denied (not user's medication)
- Invalid date format
- Missing required fields
- Duplicate taken records

### Response Format
```json
{
  "error": true,
  "message": "Error description",
  "details": { ... }
}
```

## Testing

### Unit Tests
- Model validation
- Serializer validation
- View permissions
- Business logic

### Integration Tests
- API endpoints
- Authentication
- Data persistence
- Error handling

### Manual Testing
- Create medication
- Toggle taken status
- Calendar view
- Date filtering

## Dependencies

### Required Packages
- `django`: Web framework
- `djangorestframework`: API framework
- `django-filter`: Filtering support

### Database
- PostgreSQL (recommended)
- SQLite (development)

## Security

### Access Control
- User can only access their own medications
- Authentication required for all endpoints
- Permission validation in views

### Data Validation
- Input sanitization
- Date validation
- Numeric validation for dosages
- File upload validation (if applicable)

## Future Enhancements

### Planned Features
- Medication reminders via push notifications
- Drug interaction checking
- Prescription refill tracking
- Medication history reports
- Bulk medication import
- Medication sharing with healthcare providers

### API Versioning
- Version 1: Current implementation
- Version 2: Enhanced features (planned)

## Best Practices

### Development
- Use proper serializers for different operations
- Implement comprehensive validation
- Handle errors gracefully
- Optimize database queries

### User Experience
- Clear error messages
- Consistent response format
- Efficient data loading
- Intuitive API design

### Security
- Validate all inputs
- Check user permissions
- Use secure data types
- Implement proper logging
