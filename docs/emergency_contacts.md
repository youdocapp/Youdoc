# Emergency Contacts API Documentation

## Overview

The Emergency Contacts API provides comprehensive functionality for managing emergency contact information for users. This system allows users to store up to 28 emergency contacts with one designated as the primary contact.

## Features

- **CRUD Operations**: Create, read, update, and delete emergency contacts
- **Primary Contact Management**: Set and manage a primary emergency contact
- **Contact Limits**: Enforce maximum of 28 contacts per user
- **Data Validation**: Comprehensive validation for all contact fields
- **User Isolation**: Each user can only access their own emergency contacts
- **Bulk Operations**: Support for bulk deletion of contacts
- **Statistics**: Get contact statistics and metadata

## Data Model

### EmergencyContact Model

```python
class EmergencyContact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50, blank=True)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Unique identifier for the contact |
| `user` | ForeignKey | Yes | User who owns this contact |
| `name` | String | Yes | Full name of the emergency contact (2-100 chars) |
| `relationship` | String | No | Relationship to user (e.g., "Spouse", "Parent") |
| `phone_number` | String | Yes | Phone number (validated format) |
| `email` | Email | No | Email address (optional) |
| `is_primary` | Boolean | No | Whether this is the primary contact |
| `created_at` | DateTime | Auto | When the contact was created |
| `updated_at` | DateTime | Auto | When the contact was last updated |

## API Endpoints

### Base URL
```
/api/emergency-contacts/
```

### Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. List and Create Emergency Contacts

### GET /api/emergency-contacts/

Retrieve all emergency contacts for the authenticated user.

**Response:**
```json
{
  "contacts": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "relationship": "Spouse",
      "display_relationship": "Spouse",
      "phone_number": "+1234567890",
      "email": "john@example.com",
      "is_primary": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "metadata": {
    "total_contacts": 1,
    "max_contacts": 28,
    "remaining_slots": 27,
    "can_add_more": true
  }
}
```

### POST /api/emergency-contacts/

Create a new emergency contact.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "relationship": "Parent",
  "phone_number": "+1987654321",
  "email": "jane@example.com",
  "is_primary": false
}
```

**Response (201 Created):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Jane Smith",
  "relationship": "Parent",
  "phone_number": "+1987654321",
  "email": "jane@example.com",
  "is_primary": false,
  "display_relationship": "Parent",
  "contact_info": "Phone: +1987654321, Email: jane@example.com",
  "created_at": "2024-01-15T10:35:00Z",
  "updated_at": "2024-01-15T10:35:00Z"
}
```

---

## 2. Retrieve, Update, and Delete Emergency Contact

### GET /api/emergency-contacts/{id}/

Retrieve a specific emergency contact.

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user": "user-uuid",
  "name": "John Doe",
  "relationship": "Spouse",
  "phone_number": "+1234567890",
  "email": "john@example.com",
  "is_primary": true,
  "display_relationship": "Spouse",
  "contact_info": "Phone: +1234567890, Email: john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### PUT /api/emergency-contacts/{id}/

Update an emergency contact (full update).

**Request Body:**
```json
{
  "name": "John Smith",
  "relationship": "Husband",
  "phone_number": "+1234567890",
  "email": "johnsmith@example.com",
  "is_primary": true
}
```

### PATCH /api/emergency-contacts/{id}/

Partially update an emergency contact.

**Request Body:**
```json
{
  "name": "John Smith",
  "is_primary": true
}
```

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user": "user-uuid",
  "name": "John Smith",
  "relationship": "Husband",
  "phone_number": "+1234567890",
  "email": "johnsmith@example.com",
  "is_primary": true,
  "display_relationship": "Husband",
  "contact_info": "Phone: +1234567890, Email: johnsmith@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

### DELETE /api/emergency-contacts/{id}/

Delete an emergency contact.

**Response (200 OK):**
```json
{
  "message": "Emergency contact \"John Smith\" has been deleted successfully."
}
```

---

## 3. Primary Contact Management

### GET /api/emergency-contacts/primary/

Get the primary emergency contact.

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user": "user-uuid",
  "name": "John Smith",
  "relationship": "Husband",
  "phone_number": "+1234567890",
  "email": "johnsmith@example.com",
  "is_primary": true,
  "display_relationship": "Husband",
  "contact_info": "Phone: +1234567890, Email: johnsmith@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "No primary emergency contact found."
}
```

### POST /api/emergency-contacts/set-primary/

Set a specific contact as the primary emergency contact.

**Request Body:**
```json
{
  "contact_id": 123
}
```

**Response (200 OK):**
```json
{
  "message": "\"John Smith\" has been set as your primary emergency contact.",
  "contact": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user": "user-uuid",
    "name": "John Smith",
    "relationship": "Husband",
    "phone_number": "+1234567890",
    "email": "johnsmith@example.com",
    "is_primary": true,
    "display_relationship": "Husband",
    "contact_info": "Phone: +1234567890, Email: johnsmith@example.com",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

---

## 4. Statistics and Bulk Operations

### GET /api/emergency-contacts/stats/

Get statistics about the user's emergency contacts.

**Response (200 OK):**
```json
{
  "total_contacts": 5,
  "max_contacts": 28,
  "remaining_slots": 23,
  "has_primary": true,
  "primary_contact_name": "John Smith"
}
```

### POST /api/emergency-contacts/bulk-delete/

Delete multiple emergency contacts at once.

**Request Body:**
```json
{
  "contact_ids": [123, 124, 125]
}
```

**Response (200 OK):**
```json
{
  "message": "Successfully deleted 3 emergency contact(s).",
  "deleted_contacts": ["Contact 1", "Contact 2", "Contact 3"],
  "deleted_count": 3
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "name": ["Name is required and cannot be empty."],
  "phone_number": ["Phone number is required and cannot be empty."]
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

### 429 Too Many Requests
```json
{
  "error": "Maximum of 28 emergency contacts allowed per user."
}
```

---

## Validation Rules

### Name
- **Required**: Yes
- **Length**: 2-100 characters
- **Format**: Cannot be empty or whitespace only

### Phone Number
- **Required**: Yes
- **Format**: Valid phone number format
- **Allowed characters**: Digits, spaces, hyphens, parentheses, and + sign
- **Example**: `+1 (555) 123-4567`, `+1234567890`, `555-123-4567`

### Email
- **Required**: No
- **Format**: Valid email address
- **Example**: `user@example.com`

### Relationship
- **Required**: No
- **Length**: Up to 50 characters
- **Examples**: "Spouse", "Parent", "Friend", "Sibling"

### Primary Contact
- **Required**: No
- **Default**: False
- **Constraint**: Only one contact per user can be primary
- **Behavior**: Setting a contact as primary automatically unsets all other primary contacts

---

## Business Rules

1. **Contact Limit**: Users can have a maximum of 28 emergency contacts
2. **Primary Contact**: Only one contact can be marked as primary per user
3. **User Isolation**: Users can only access their own emergency contacts
4. **Required Fields**: Name and phone number are required for all contacts
5. **Auto-timestamps**: Created and updated timestamps are automatically managed
6. **Cascade Delete**: When a user is deleted, all their emergency contacts are deleted

---

## Usage Examples

### Frontend Integration

```javascript
// Create a new emergency contact
const createContact = async (contactData) => {
  const response = await fetch('/api/emergency-contacts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(contactData)
  });
  return response.json();
};

// Get all contacts with metadata
const getContacts = async () => {
  const response = await fetch('/api/emergency-contacts/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Set primary contact
const setPrimaryContact = async (contactId) => {
  const response = await fetch('/api/emergency-contacts/set-primary/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ contact_id: contactId })
  });
  return response.json();
};
```

### Python Client Example

```python
import requests

class EmergencyContactsClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def create_contact(self, name, phone_number, relationship=None, email=None, is_primary=False):
        data = {
            'name': name,
            'phone_number': phone_number,
            'relationship': relationship,
            'email': email,
            'is_primary': is_primary
        }
        response = requests.post(
            f'{self.base_url}/api/emergency-contacts/',
            json=data,
            headers=self.headers
        )
        return response.json()
    
    def get_contacts(self):
        response = requests.get(
            f'{self.base_url}/api/emergency-contacts/',
            headers=self.headers
        )
        return response.json()
    
    def set_primary_contact(self, contact_id):
        data = {'contact_id': contact_id}
        response = requests.post(
            f'{self.base_url}/api/emergency-contacts/set-primary/',
            json=data,
            headers=self.headers
        )
        return response.json()
```

---

## Testing

The API includes comprehensive test coverage for:

- Model validation and constraints
- CRUD operations
- Primary contact management
- Authentication and authorization
- Error handling
- Edge cases and business rules

Run tests with:
```bash
python manage.py test emergency_contacts
```

---

## Admin Interface

Emergency contacts can be managed through the Django admin interface at `/admin/emergency_contacts/emergencycontact/`. The admin provides:

- List view with filtering and search
- Detailed contact information
- Primary contact status indicators
- User association
- Timestamp tracking

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT authentication
2. **Authorization**: Users can only access their own emergency contacts
3. **Data Validation**: All input data is validated and sanitized
4. **SQL Injection**: Protected by Django ORM
5. **Rate Limiting**: Consider implementing rate limiting for production use

---

## Performance Considerations

1. **Database Indexes**: Optimized queries with proper indexing
2. **Select Related**: Efficient user relationship loading
3. **Pagination**: Consider implementing pagination for large contact lists
4. **Caching**: Consider caching frequently accessed data

---

## Future Enhancements

Potential future features:

1. **Contact Import/Export**: CSV/JSON import/export functionality
2. **Contact Categories**: Categorize contacts (family, medical, etc.)
3. **Emergency Notifications**: Integration with notification systems
4. **Contact Sharing**: Share contacts with healthcare providers
5. **Backup Contacts**: Automatic backup to cloud storage
6. **Contact Verification**: Phone/email verification for contacts
7. **Emergency Protocols**: Define emergency response protocols per contact
