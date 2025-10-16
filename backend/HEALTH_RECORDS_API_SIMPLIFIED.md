# Health Records API - Simplified

## Overview

The Health Records API provides basic CRUD functionality for managing health records including lab results, prescriptions, imaging, vaccinations, and other medical documents. It supports file uploads and matches exactly what the frontend needs.

## Base URL

```
/api/health-records/
```

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Model

### HealthRecord

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier (HR-XXXXXXXX) | Auto-generated |
| title | string | Title of the health record | Yes |
| type | string | Type: lab_result, prescription, imaging, vaccination, other | Yes |
| date | date | Date of the health record | Yes |
| description | text | Description of the record | No |
| file | file | Uploaded file | No |
| file_name | string | Original filename | Auto-generated |
| notes | text | Additional notes | No |
| created_at | datetime | Creation timestamp | Auto-generated |
| updated_at | datetime | Last update timestamp | Auto-generated |

## Endpoints

### Health Records CRUD

#### List Health Records
```http
GET /api/health-records/
```

**Query Parameters:**
- `type`: Filter by record type (lab_result, prescription, imaging, vaccination, other)
- `date_from`: Filter records from date
- `date_to`: Filter records to date
- `has_file`: Filter by file presence (true/false)
- `search`: Search in title, description, notes
- `ordering`: Sort by field (-field for descending)
- `page`: Page number for pagination

**Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "HR-ABC12345",
      "title": "Blood Test Results",
      "type": "lab_result",
      "date": "2024-01-15",
      "description": "Complete blood count",
      "file_uri": "http://localhost:8000/media/health_records/1/HR-ABC12345/blood_test.pdf",
      "file_name": "blood_test.pdf",
      "notes": "All values normal",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Create Health Record
```http
POST /api/health-records/
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "title": "Blood Test Results",
  "type": "lab_result",
  "date": "2024-01-15",
  "description": "Complete blood count",
  "notes": "All values normal",
  "file": "<file_upload>"
}
```

**Response:**
```json
{
  "id": "HR-ABC12345",
  "title": "Blood Test Results",
  "type": "lab_result",
  "date": "2024-01-15",
  "description": "Complete blood count",
  "file_uri": "http://localhost:8000/media/health_records/1/HR-ABC12345/blood_test.pdf",
  "file_name": "blood_test.pdf",
  "notes": "All values normal",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Retrieve Health Record
```http
GET /api/health-records/{id}/
```

**Response:** Same as create response

#### Update Health Record
```http
PUT /api/health-records/{id}/
PATCH /api/health-records/{id}/
Content-Type: multipart/form-data
```

**Request Body:** Same as create (all fields optional for PATCH)

**Response:** Same as create response

#### Delete Health Record
```http
DELETE /api/health-records/{id}/
```

**Response:** 204 No Content

## File Upload

### Supported File Types
- PDF documents
- Images: JPG, JPEG, PNG, GIF
- Documents: DOC, DOCX, TXT

### File Storage
- Files are stored in `media/health_records/{user_id}/{record_id}/`
- Original filenames are preserved
- File URLs are automatically generated

## Frontend Integration

### HealthRecord Interface (TypeScript)
```typescript
interface HealthRecord {
  id: string;
  title: string;
  type: 'lab_result' | 'prescription' | 'imaging' | 'vaccination' | 'other';
  date: string;
  description?: string;
  fileUri?: string;
  fileName?: string;
  notes?: string;
}
```

### API Service Example
```typescript
class HealthRecordsAPI {
  private baseURL = '/api/health-records/';
  
  async getRecords(params?: any): Promise<HealthRecord[]> {
    const response = await fetch(this.baseURL + '?' + new URLSearchParams(params), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
  
  async createRecord(record: FormData): Promise<HealthRecord> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: record
    });
    return response.json();
  }
  
  async updateRecord(id: string, record: FormData): Promise<HealthRecord> {
    const response = await fetch(this.baseURL + id + '/', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: record
    });
    return response.json();
  }
  
  async deleteRecord(id: string): Promise<void> {
    await fetch(this.baseURL + id + '/', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

## Security

1. **File Upload Security**: File type validation enforced
2. **Access Control**: Users can only access their own health records
3. **Data Privacy**: All endpoints require authentication
4. **File Cleanup**: Files are automatically deleted when records are removed

## What Was Removed

The following features were removed to match frontend needs:
- ❌ Health record sharing functionality
- ❌ Statistics endpoints
- ❌ Advanced search functionality
- ❌ Category/tag system
- ❌ Bulk operations
- ❌ Complex admin features

## What Remains

The simplified API includes only what the frontend actually uses:
- ✅ Basic CRUD operations
- ✅ File upload support
- ✅ Simple filtering and search
- ✅ User isolation
- ✅ Clean admin interface
