# Medical History App Documentation

## Overview
The medical history app manages user medical conditions, surgeries, and allergies. It provides comprehensive tracking of medical history with detailed information about conditions, procedures, and allergic reactions.

## Models

### MedicalCondition Model
**File**: `medical_history/models.py`

Tracks medical conditions with status and diagnosis information.

#### Key Fields:
- **id**: UUID primary key
- **user**: Foreign key to User model
- **name**: Name of the medical condition
- **diagnosed_date**: Date when condition was diagnosed
- **status**: Current status (active, resolved, chronic)
- **notes**: Additional notes about the condition
- **created_at, updated_at**: Timestamps

#### Status Choices:
- **active**: Currently active condition
- **resolved**: Condition has been resolved
- **chronic**: Long-term chronic condition

### Surgery Model
**File**: `medical_history/models.py`

Tracks surgical procedures with hospital and surgeon information.

#### Key Fields:
- **id**: UUID primary key
- **user**: Foreign key to User model
- **name**: Name of the surgical procedure
- **date**: Date when surgery was performed
- **hospital**: Hospital where surgery was performed
- **surgeon**: Name of the surgeon
- **notes**: Additional notes about the surgery
- **created_at, updated_at**: Timestamps

### Allergy Model
**File**: `medical_history/models.py`

Tracks allergies with severity and reaction information.

#### Key Fields:
- **id**: UUID primary key
- **user**: Foreign key to User model
- **allergen**: Substance that causes allergic reaction
- **reaction**: Description of the allergic reaction
- **severity**: Severity level (mild, moderate, severe)
- **notes**: Additional notes about the allergy
- **created_at, updated_at**: Timestamps

#### Severity Choices:
- **mild**: Mild allergic reaction
- **moderate**: Moderate allergic reaction
- **severe**: Severe allergic reaction

#### Unique Constraint:
- One allergy record per user per allergen

## Serializers

### MedicalConditionSerializer
**File**: `medical_history/serializers.py`

Full medical condition serializer with all fields.

### MedicalConditionCreateSerializer
**File**: `medical_history/serializers.py`

Serializer for creating new medical conditions.

### SurgerySerializer
**File**: `medical_history/serializers.py`

Full surgery serializer with all fields.

### SurgeryCreateSerializer
**File**: `medical_history/serializers.py`

Serializer for creating new surgeries.

### AllergySerializer
**File**: `medical_history/serializers.py`

Full allergy serializer with all fields.

### AllergyCreateSerializer
**File**: `medical_history/serializers.py`

Serializer for creating new allergies.

## Views

### Medical Conditions

#### MedicalConditionListCreateView
**Endpoint**: `GET/POST /api/medical-history/conditions/`

##### GET - List Medical Conditions
**Purpose**: Retrieve user's medical conditions

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Diabetes Type 2",
      "diagnosed_date": "2020-03-15",
      "status": "chronic",
      "notes": "Well controlled with medication",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

##### POST - Create Medical Condition
**Purpose**: Create new medical condition

**Request**:
```json
{
  "name": "Diabetes Type 2",
  "diagnosed_date": "2020-03-15",
  "status": "chronic",
  "notes": "Well controlled with medication"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Medical condition added successfully",
  "data": {
    "id": "uuid",
    "name": "Diabetes Type 2",
    "diagnosed_date": "2020-03-15",
    "status": "chronic",
    "notes": "Well controlled with medication",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### MedicalConditionDetailView
**Endpoint**: `GET/PUT/PATCH/DELETE /api/medical-history/conditions/{id}/`

##### GET - Retrieve Medical Condition
**Purpose**: Get specific medical condition details

##### PUT/PATCH - Update Medical Condition
**Purpose**: Update medical condition

##### DELETE - Delete Medical Condition
**Purpose**: Delete medical condition

### Surgeries

#### SurgeryListCreateView
**Endpoint**: `GET/POST /api/medical-history/surgeries/`

##### GET - List Surgeries
**Purpose**: Retrieve user's surgeries

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Appendectomy",
      "date": "2019-06-10",
      "hospital": "City General Hospital",
      "surgeon": "Dr. Smith",
      "notes": "Laparoscopic procedure, recovery was smooth",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

##### POST - Create Surgery
**Purpose**: Create new surgery record

**Request**:
```json
{
  "name": "Appendectomy",
  "date": "2019-06-10",
  "hospital": "City General Hospital",
  "surgeon": "Dr. Smith",
  "notes": "Laparoscopic procedure, recovery was smooth"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Surgery added successfully",
  "data": {
    "id": "uuid",
    "name": "Appendectomy",
    "date": "2019-06-10",
    "hospital": "City General Hospital",
    "surgeon": "Dr. Smith",
    "notes": "Laparoscopic procedure, recovery was smooth",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### SurgeryDetailView
**Endpoint**: `GET/PUT/PATCH/DELETE /api/medical-history/surgeries/{id}/`

##### GET - Retrieve Surgery
**Purpose**: Get specific surgery details

##### PUT/PATCH - Update Surgery
**Purpose**: Update surgery record

##### DELETE - Delete Surgery
**Purpose**: Delete surgery record

### Allergies

#### AllergyListCreateView
**Endpoint**: `GET/POST /api/medical-history/allergies/`

##### GET - List Allergies
**Purpose**: Retrieve user's allergies

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "allergen": "Penicillin",
      "reaction": "Rash and difficulty breathing",
      "severity": "severe",
      "notes": "Avoid all penicillin-based antibiotics",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

##### POST - Create Allergy
**Purpose**: Create new allergy record

**Request**:
```json
{
  "allergen": "Penicillin",
  "reaction": "Rash and difficulty breathing",
  "severity": "severe",
  "notes": "Avoid all penicillin-based antibiotics"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Allergy added successfully",
  "data": {
    "id": "uuid",
    "allergen": "Penicillin",
    "reaction": "Rash and difficulty breathing",
    "severity": "severe",
    "notes": "Avoid all penicillin-based antibiotics",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### AllergyDetailView
**Endpoint**: `GET/PUT/PATCH/DELETE /api/medical-history/allergies/{id}/`

##### GET - Retrieve Allergy
**Purpose**: Get specific allergy details

##### PUT/PATCH - Update Allergy
**Purpose**: Update allergy record

##### DELETE - Delete Allergy
**Purpose**: Delete allergy record

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/medical-history/conditions/` | GET | List medical conditions | Yes |
| `/medical-history/conditions/` | POST | Create medical condition | Yes |
| `/medical-history/conditions/{id}/` | GET | Get medical condition | Yes |
| `/medical-history/conditions/{id}/` | PUT/PATCH | Update medical condition | Yes |
| `/medical-history/conditions/{id}/` | DELETE | Delete medical condition | Yes |
| `/medical-history/surgeries/` | GET | List surgeries | Yes |
| `/medical-history/surgeries/` | POST | Create surgery | Yes |
| `/medical-history/surgeries/{id}/` | GET | Get surgery | Yes |
| `/medical-history/surgeries/{id}/` | PUT/PATCH | Update surgery | Yes |
| `/medical-history/surgeries/{id}/` | DELETE | Delete surgery | Yes |
| `/medical-history/allergies/` | GET | List allergies | Yes |
| `/medical-history/allergies/` | POST | Create allergy | Yes |
| `/medical-history/allergies/{id}/` | GET | Get allergy | Yes |
| `/medical-history/allergies/{id}/` | PUT/PATCH | Update allergy | Yes |
| `/medical-history/allergies/{id}/` | DELETE | Delete allergy | Yes |

## Data Models

### MedicalCondition Object
```json
{
  "id": "uuid",
  "name": "Diabetes Type 2",
  "diagnosed_date": "2020-03-15",
  "status": "chronic",
  "notes": "Well controlled with medication",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Surgery Object
```json
{
  "id": "uuid",
  "name": "Appendectomy",
  "date": "2019-06-10",
  "hospital": "City General Hospital",
  "surgeon": "Dr. Smith",
  "notes": "Laparoscopic procedure, recovery was smooth",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Allergy Object
```json
{
  "id": "uuid",
  "allergen": "Penicillin",
  "reaction": "Rash and difficulty breathing",
  "severity": "severe",
  "notes": "Avoid all penicillin-based antibiotics",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Business Logic

### Medical Conditions
- **Status Tracking**: Active, resolved, or chronic conditions
- **Date Management**: Diagnosis date tracking
- **Notes**: Additional information about condition management

### Surgeries
- **Procedure Tracking**: Name and date of surgery
- **Provider Information**: Hospital and surgeon details
- **Recovery Notes**: Additional information about recovery

### Allergies
- **Allergen Tracking**: Specific substances causing reactions
- **Reaction Description**: Detailed reaction information
- **Severity Levels**: Mild, moderate, or severe classifications
- **Duplicate Prevention**: One record per allergen per user

## Frontend Integration

### Medical Conditions
- Display conditions by status
- Show diagnosis dates
- Allow status updates
- Provide condition management notes

### Surgeries
- Chronological surgery history
- Hospital and surgeon information
- Recovery notes and details
- Date-based organization

### Allergies
- Prominent allergy display
- Severity indicators
- Reaction descriptions
- Emergency information

## Security

### Access Control
- User can only access their own medical history
- Authentication required for all endpoints
- Permission validation in views

### Data Validation
- Input sanitization
- Date validation
- Required field validation
- Unique constraint enforcement

## Performance Optimizations

### Database Indexes
- User-based filtering
- Date-based ordering
- Efficient querying

### Query Optimization
- Filtered querysets by user
- Efficient date queries
- Optimized serialization

## Error Handling

### Common Errors
- Medical history item not found
- Permission denied (not user's record)
- Duplicate allergy entry
- Invalid date format
- Missing required fields

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

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
- Create medical condition
- Add surgery record
- Record allergy
- Update and delete records

## Dependencies

### Required Packages
- `django`: Web framework
- `djangorestframework`: API framework

### Database
- PostgreSQL (recommended)
- SQLite (development)

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

## Future Enhancements

### Planned Features
- Medical history sharing with providers
- Condition progression tracking
- Surgery outcome tracking
- Allergy severity monitoring
- Medical history reports
- Integration with EHR systems
- Family medical history tracking

### API Versioning
- Version 1: Current implementation
- Version 2: Enhanced features (planned)

## Troubleshooting

### Common Issues
- Duplicate allergy entries
- Date validation errors
- Permission denied errors
- Missing required fields

### Solutions
- Check unique constraints
- Validate date formats
- Verify user permissions
- Ensure required fields are provided
