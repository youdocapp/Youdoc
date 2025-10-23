# Health Records App Documentation

## Overview
The health records app manages user health documents, test results, prescriptions, and medical files. It provides secure file storage and organization of health-related documents with support for various file types and categories.

## Models

### HealthRecord Model
**File**: `health_records/models.py`

Main health record model for storing health documents and information.

#### Key Fields:
- **id**: Custom ID with HR- prefix (e.g., HR-ABC12345)
- **user**: Foreign key to User model
- **title**: Title of the health record
- **type**: Record type (lab_result, prescription, imaging, vaccination, other)
- **date**: Date of the health record
- **description**: Description of the record
- **file**: Uploaded file (PDF, images, documents)
- **file_name**: Original filename
- **notes**: Additional notes
- **created_at, updated_at**: Timestamps

#### Key Methods:
- `file_uri`: Returns file URL if file exists
- `save()`: Override to ensure unique ID and set file metadata

#### Enums:
- **HealthRecordType**: lab_result, prescription, imaging, vaccination, other

#### File Support:
- **Allowed Extensions**: pdf, jpg, jpeg, png, gif, doc, docx, txt
- **Upload Path**: `health_records/{user_id}/{record_id}/{filename}`
- **File Validation**: FileExtensionValidator

## Serializers

### HealthRecordSerializer
**File**: `health_records/serializers.py`

Full health record serializer with all fields including file handling.

### HealthRecordListSerializer
**File**: `health_records/serializers.py`

Optimized serializer for listing health records with essential fields.

## Views

### HealthRecordListCreateView
**Endpoint**: `GET/POST /api/health-records/`

#### GET - List Health Records
**Purpose**: Retrieve user's health records with filtering and search

**Query Parameters**:
- `type`: Filter by record type (lab_result, prescription, imaging, vaccination, other)
- `date_from`: Filter records from specific date
- `date_to`: Filter records to specific date
- `has_file`: Filter by file presence (true/false)
- `search`: Search in title, description, notes
- `ordering`: Order by date, created_at, title

**Response**:
```json
{
  "count": 25,
  "next": "http://api/health-records/?page=2",
  "previous": null,
  "results": [
    {
      "id": "HR-ABC12345",
      "title": "Blood Test Results",
      "type": "lab_result",
      "date": "2024-01-15",
      "description": "Complete blood count results",
      "file": "http://api/media/health_records/user_id/HR-ABC12345/blood_test.pdf",
      "file_name": "blood_test.pdf",
      "notes": "All values within normal range",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST - Create Health Record
**Purpose**: Create new health record with optional file upload

**Request** (multipart/form-data):
```
title: "Blood Test Results"
type: "lab_result"
date: "2024-01-15"
description: "Complete blood count results"
file: [file upload]
notes: "All values within normal range"
```

**Response**:
```json
{
  "id": "HR-ABC12345",
  "title": "Blood Test Results",
  "type": "lab_result",
  "date": "2024-01-15",
  "description": "Complete blood count results",
  "file": "http://api/media/health_records/user_id/HR-ABC12345/blood_test.pdf",
  "file_name": "blood_test.pdf",
  "notes": "All values within normal range",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### HealthRecordDetailView
**Endpoint**: `GET/PUT/PATCH/DELETE /api/health-records/{id}/`

#### GET - Retrieve Health Record
**Purpose**: Get specific health record details

#### PUT/PATCH - Update Health Record
**Purpose**: Update health record with optional file replacement

#### DELETE - Delete Health Record
**Purpose**: Delete health record and associated file

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/health-records/` | GET | List health records | Yes |
| `/health-records/` | POST | Create health record | Yes |
| `/health-records/{id}/` | GET | Get health record | Yes |
| `/health-records/{id}/` | PUT/PATCH | Update health record | Yes |
| `/health-records/{id}/` | DELETE | Delete health record | Yes |

## Data Models

### HealthRecord Object
```json
{
  "id": "HR-ABC12345",
  "title": "Blood Test Results",
  "type": "lab_result",
  "date": "2024-01-15",
  "description": "Complete blood count results",
  "file": "http://api/media/health_records/user_id/HR-ABC12345/blood_test.pdf",
  "file_name": "blood_test.pdf",
  "notes": "All values within normal range",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### HealthRecordType Enum
```json
{
  "lab_result": "Lab Result",
  "prescription": "Prescription",
  "imaging": "Imaging",
  "vaccination": "Vaccination",
  "other": "Other"
}
```

## File Management

### File Upload
- **Supported Formats**: PDF, JPG, JPEG, PNG, GIF, DOC, DOCX, TXT
- **Upload Path**: `health_records/{user_id}/{record_id}/{filename}`
- **File Validation**: Extension validation on upload
- **Storage**: Django's FileField with custom upload path

### File Access
- **URL Generation**: Automatic URL generation for file access
- **Security**: Files are user-specific and require authentication
- **Metadata**: Original filename stored separately

### File Operations
- **Upload**: During record creation or update
- **Replace**: Update existing record with new file
- **Delete**: Automatic file deletion when record is deleted

## Filtering and Search

### Filter Options
- **Type Filter**: Filter by record type
- **Date Range**: Filter by date range
- **File Presence**: Filter records with/without files
- **Search**: Full-text search in title, description, notes

### Search Implementation
- **Search Fields**: title, description, notes
- **Case Insensitive**: Search is case-insensitive
- **Partial Matching**: Supports partial text matching

### Ordering Options
- **Default**: Order by date (descending), then created_at (descending)
- **Available Fields**: date, created_at, title
- **Direction**: Ascending or descending

## Business Logic

### Record Types
- **Lab Result**: Laboratory test results
- **Prescription**: Medication prescriptions
- **Imaging**: X-rays, MRIs, CT scans
- **Vaccination**: Vaccination records
- **Other**: Miscellaneous health documents

### Date Handling
- **Date Format**: ISO date format (YYYY-MM-DD)
- **Date Validation**: Ensures valid date format
- **Date Filtering**: Supports date range queries

### File Handling
- **Unique IDs**: Each record gets unique HR- prefix ID
- **File Organization**: Files organized by user and record
- **File Metadata**: Original filename preserved

## Frontend Integration

### File Upload
- Use multipart/form-data for file uploads
- Show upload progress
- Validate file types on frontend
- Handle upload errors gracefully

### Record Display
- Display records in chronological order
- Show file icons for records with files
- Provide download links for files
- Support filtering and search

### Record Management
- Form validation for required fields
- Date picker for record dates
- File upload component
- Rich text editor for descriptions

## Security

### Access Control
- User can only access their own health records
- Authentication required for all endpoints
- File access restricted to record owner

### File Security
- Files stored in user-specific directories
- File extension validation
- Secure file serving
- No direct file access without authentication

### Data Validation
- Input sanitization
- Date validation
- File type validation
- Required field validation

## Performance Optimizations

### Database Indexes
- User + type index
- User + date index
- Title index for search

### Query Optimization
- Select related for user data
- Filtered querysets by user
- Efficient search queries
- Pagination for large datasets

### File Handling
- Efficient file storage
- Optimized file serving
- File cleanup on deletion

## Error Handling

### Common Errors
- Health record not found
- Permission denied (not user's record)
- Invalid file type
- File upload failure
- Missing required fields

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
- File upload handling

### Integration Tests
- API endpoints
- File upload/download
- Authentication
- Data persistence

### Manual Testing
- Create health record
- Upload file
- Filter and search
- Update and delete

## Dependencies

### Required Packages
- `django`: Web framework
- `djangorestframework`: API framework
- `django-filter`: Filtering support
- `Pillow`: Image processing (if needed)

### File Storage
- Local file storage (development)
- AWS S3 (production recommended)
- Cloudinary (alternative)

## Configuration

### Settings
```python
# File upload settings
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# File validation
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
```

### File Upload Path
```python
def health_record_file_upload_path(instance, filename):
    return f'health_records/{instance.user.id}/{instance.id}/{filename}'
```

## Best Practices

### Development
- Use proper serializers for different operations
- Implement comprehensive validation
- Handle file uploads securely
- Optimize database queries

### User Experience
- Clear error messages
- Consistent response format
- Efficient file handling
- Intuitive API design

### Security
- Validate all inputs
- Check user permissions
- Secure file storage
- Implement proper logging

## Future Enhancements

### Planned Features
- OCR for scanned documents
- Automatic document classification
- Health record sharing with providers
- Document versioning
- Bulk file upload
- Document templates
- Integration with EHR systems

### API Versioning
- Version 1: Current implementation
- Version 2: Enhanced features (planned)

## Troubleshooting

### Common Issues
- File upload failures
- Permission errors
- File not found errors
- Large file handling

### Solutions
- Check file size limits
- Verify user permissions
- Ensure proper file paths
- Implement file compression
