# Emergency Contacts API Documentation

## Overview
The Emergency Contacts API provides comprehensive functionality for managing emergency contact information. Users can add, update, and delete emergency contacts, set primary contacts, and manage up to 28 emergency contacts per user. This API is crucial for emergency situations and healthcare management.

## Base URL
```
https://youdoc.onrender.com/api/emergency-contacts/
```

## Authentication
All endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. List Emergency Contacts
**GET** `/`

Get all emergency contacts for the authenticated user with metadata about contact limits.

#### Success Response (200)
```json
{
  "contacts": [
    {
      "id": 1,
      "name": "John Doe",
      "relationship": "Spouse",
      "display_relationship": "Spouse",
      "phone_number": "+1-555-123-4567",
      "email": "john.doe@example.com",
      "is_primary": true,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "relationship": "Mother",
      "display_relationship": "Mother",
      "phone_number": "+1-555-987-6543",
      "email": "jane.smith@example.com",
      "is_primary": false,
      "created_at": "2024-01-16T09:15:00Z"
    }
  ],
  "metadata": {
    "total_contacts": 2,
    "max_contacts": 28,
    "remaining_slots": 26,
    "can_add_more": true
  }
}
```

---

### 2. Create Emergency Contact
**POST** `/`

Add a new emergency contact. Users can have up to 28 emergency contacts.

#### Request Body
```json
{
  "name": "Dr. Sarah Johnson",
  "relationship": "Doctor",
  "phone_number": "+1-555-456-7890",
  "email": "sarah.johnson@hospital.com",
  "is_primary": false
}
```

#### Required Fields
- `name` (string): Full name of the emergency contact (min 2 characters)
- `phone_number` (string): Phone number with country code

#### Optional Fields
- `relationship` (string): Relationship to the user (e.g., "Spouse", "Parent", "Friend")
- `email` (string): Email address of the contact
- `is_primary` (boolean): Whether this is the primary emergency contact (default: false)

#### Success Response (201)
```json
{
  "id": 3,
  "user": 1,
  "name": "Dr. Sarah Johnson",
  "relationship": "Doctor",
  "phone_number": "+1-555-456-7890",
  "email": "sarah.johnson@hospital.com",
  "is_primary": false,
  "display_relationship": "Doctor",
  "contact_info": "Phone: +1-555-456-7890, Email: sarah.johnson@hospital.com",
  "created_at": "2024-01-17T14:20:00Z",
  "updated_at": "2024-01-17T14:20:00Z"
}
```

#### Error Response (400) - Contact Limit Reached
```json
{
  "error": true,
  "message": "Maximum of 28 emergency contacts allowed per user.",
  "details": {}
}
```

---

### 3. Get Emergency Contact Details
**GET** `/{contact_id}/`

Get detailed information about a specific emergency contact.

#### Success Response (200)
```json
{
  "id": 1,
  "user": 1,
  "name": "John Doe",
  "relationship": "Spouse",
  "phone_number": "+1-555-123-4567",
  "email": "john.doe@example.com",
  "is_primary": true,
  "display_relationship": "Spouse",
  "contact_info": "Phone: +1-555-123-4567, Email: john.doe@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 4. Update Emergency Contact
**PUT/PATCH** `/{contact_id}/`

Update an existing emergency contact.

#### Request Body (PATCH - partial update)
```json
{
  "phone_number": "+1-555-123-9999",
  "email": "john.doe.new@example.com"
}
```

#### Success Response (200)
```json
{
  "id": 1,
  "user": 1,
  "name": "John Doe",
  "relationship": "Spouse",
  "phone_number": "+1-555-123-9999",
  "email": "john.doe.new@example.com",
  "is_primary": true,
  "display_relationship": "Spouse",
  "contact_info": "Phone: +1-555-123-9999, Email: john.doe.new@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-17T15:45:00Z"
}
```

---

### 5. Delete Emergency Contact
**DELETE** `/{contact_id}/`

Permanently delete an emergency contact.

#### Success Response (200)
```json
{
  "message": "Emergency contact \"Dr. Sarah Johnson\" has been deleted successfully."
}
```

---

### 6. Set Primary Contact
**POST** `/set-primary/`

Set a specific emergency contact as the primary contact. Only one contact can be primary at a time.

#### Request Body
```json
{
  "contact_id": 2
}
```

#### Success Response (200)
```json
{
  "message": "\"Jane Smith\" has been set as your primary emergency contact.",
  "contact": {
    "id": 2,
    "user": 1,
    "name": "Jane Smith",
    "relationship": "Mother",
    "phone_number": "+1-555-987-6543",
    "email": "jane.smith@example.com",
    "is_primary": true,
    "display_relationship": "Mother",
    "contact_info": "Phone: +1-555-987-6543, Email: jane.smith@example.com",
    "created_at": "2024-01-16T09:15:00Z",
    "updated_at": "2024-01-17T16:00:00Z"
  }
}
```

---

### 7. Get Primary Contact
**GET** `/primary/`

Get the current primary emergency contact.

#### Success Response (200)
```json
{
  "id": 2,
  "user": 1,
  "name": "Jane Smith",
  "relationship": "Mother",
  "phone_number": "+1-555-987-6543",
  "email": "jane.smith@example.com",
  "is_primary": true,
  "display_relationship": "Mother",
  "contact_info": "Phone: +1-555-987-6543, Email: jane.smith@example.com",
  "created_at": "2024-01-16T09:15:00Z",
  "updated_at": "2024-01-17T16:00:00Z"
}
```

#### Response (404) - No Primary Contact
```json
{
  "message": "No primary emergency contact found."
}
```

---

### 8. Get Contact Statistics
**GET** `/stats/`

Get statistics about the user's emergency contacts.

#### Success Response (200)
```json
{
  "total_contacts": 3,
  "max_contacts": 28,
  "remaining_slots": 25,
  "has_primary": true,
  "primary_contact_name": "Jane Smith"
}
```

---

### 9. Bulk Delete Contacts
**POST** `/bulk-delete/`

Delete multiple emergency contacts at once.

#### Request Body
```json
{
  "contact_ids": [1, 3, 5]
}
```

#### Success Response (200)
```json
{
  "message": "Successfully deleted 3 emergency contact(s).",
  "deleted_contacts": ["John Doe", "Dr. Sarah Johnson", "Mike Wilson"],
  "deleted_count": 3
}
```

#### Error Response (400) - Invalid Input
```json
{
  "error": "No contact IDs provided."
}
```

---

## Data Validation

### Phone Number Validation
- Accepts various formats: `+1-555-123-4567`, `(555) 123-4567`, `555.123.4567`
- Must contain only digits, spaces, hyphens, parentheses, and + symbol
- Minimum 7 digits, maximum 15 digits
- International format supported

### Name Validation
- Minimum 2 characters
- Cannot be empty or whitespace only
- Trimmed of leading/trailing whitespace

### Email Validation
- Optional field
- Must be valid email format if provided
- Trimmed of whitespace

### Relationship Validation
- Optional field
- Free text input
- Common relationships: "Spouse", "Parent", "Sibling", "Friend", "Doctor", "Neighbor"

---

## React Native Integration

### 1. Emergency Contacts Service
```javascript
// services/emergencyContactsService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://youdoc.onrender.com/api/emergency-contacts';

class EmergencyContactsService {
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getEmergencyContacts() {
    const response = await fetch(`${API_BASE_URL}/`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async createEmergencyContact(contactData) {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(contactData),
    });
    return response.json();
  }

  async updateEmergencyContact(contactId, contactData) {
    const response = await fetch(`${API_BASE_URL}/${contactId}/`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(contactData),
    });
    return response.json();
  }

  async deleteEmergencyContact(contactId) {
    const response = await fetch(`${API_BASE_URL}/${contactId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async setPrimaryContact(contactId) {
    const response = await fetch(`${API_BASE_URL}/set-primary/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ contact_id: contactId }),
  });
  return response.json();
  }

  async getPrimaryContact() {
    const response = await fetch(`${API_BASE_URL}/primary/`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getContactStats() {
    const response = await fetch(`${API_BASE_URL}/stats/`, {
      headers: await this.getAuthHeaders(),
  });
  return response.json();
  }

  async bulkDeleteContacts(contactIds) {
    const response = await fetch(`${API_BASE_URL}/bulk-delete/`, {
    method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ contact_ids: contactIds }),
  });
  return response.json();
  }
}

export default new EmergencyContactsService();
```

### 2. Emergency Contacts Context
```javascript
// context/EmergencyContactsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import EmergencyContactsService from '../services/emergencyContactsService';

const EmergencyContactsContext = createContext();

export const useEmergencyContacts = () => {
  const context = useContext(EmergencyContactsContext);
  if (!context) {
    throw new Error('useEmergencyContacts must be used within an EmergencyContactsProvider');
  }
  return context;
};

export const EmergencyContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [primaryContact, setPrimaryContact] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadEmergencyContacts = async () => {
    setIsLoading(true);
    try {
      const response = await EmergencyContactsService.getEmergencyContacts();
      if (response.contacts) {
        setContacts(response.contacts);
        setStats(response.metadata);
      }
    } catch (error) {
      console.error('Failed to load emergency contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPrimaryContact = async () => {
    try {
      const response = await EmergencyContactsService.getPrimaryContact();
      setPrimaryContact(response);
    } catch (error) {
      console.error('Failed to load primary contact:', error);
    }
  };

  const loadContactStats = async () => {
    try {
      const response = await EmergencyContactsService.getContactStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load contact stats:', error);
    }
  };

  const addEmergencyContact = async (contactData) => {
    try {
      const response = await EmergencyContactsService.createEmergencyContact(contactData);
      if (response.id) {
        setContacts(prev => [response, ...prev]);
        await loadContactStats();
        return { success: true, contact: response };
      } else {
        return { success: false, error: response.message || 'Failed to add contact' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateEmergencyContact = async (contactId, contactData) => {
    try {
      const response = await EmergencyContactsService.updateEmergencyContact(contactId, contactData);
      if (response.id) {
        setContacts(prev => 
          prev.map(contact => contact.id === contactId ? response : contact)
        );
        if (response.is_primary) {
          setPrimaryContact(response);
        }
        return { success: true, contact: response };
      } else {
        return { success: false, error: response.message || 'Failed to update contact' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteEmergencyContact = async (contactId) => {
    try {
      const response = await EmergencyContactsService.deleteEmergencyContact(contactId);
      if (response.message) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        await loadContactStats();
        await loadPrimaryContact();
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to delete contact' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const setPrimaryContactAction = async (contactId) => {
    try {
      const response = await EmergencyContactsService.setPrimaryContact(contactId);
      if (response.contact) {
        setPrimaryContact(response.contact);
        setContacts(prev => 
          prev.map(contact => ({
            ...contact,
            is_primary: contact.id === contactId
          }))
        );
        return { success: true, contact: response.contact };
      } else {
        return { success: false, error: response.message || 'Failed to set primary contact' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const bulkDeleteContacts = async (contactIds) => {
    try {
      const response = await EmergencyContactsService.bulkDeleteContacts(contactIds);
      if (response.message) {
        setContacts(prev => prev.filter(contact => !contactIds.includes(contact.id)));
        await loadContactStats();
        await loadPrimaryContact();
        return { success: true, deletedCount: response.deleted_count };
      } else {
        return { success: false, error: response.message || 'Failed to delete contacts' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    loadEmergencyContacts();
    loadPrimaryContact();
  }, []);

  const value = {
    contacts,
    primaryContact,
    stats,
    isLoading,
    loadEmergencyContacts,
    loadPrimaryContact,
    loadContactStats,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    setPrimaryContact: setPrimaryContactAction,
    bulkDeleteContacts,
  };

  return (
    <EmergencyContactsContext.Provider value={value}>
      {children}
    </EmergencyContactsContext.Provider>
  );
};
```

### 3. Emergency Contacts List Component
```javascript
// components/EmergencyContactsList.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { useEmergencyContacts } from '../context/EmergencyContactsContext';

const EmergencyContactsList = () => {
  const { 
    contacts, 
    primaryContact, 
    stats, 
    deleteEmergencyContact,
    setPrimaryContact,
    bulkDeleteContacts 
  } = useEmergencyContacts();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleDelete = async (contactId, contactName) => {
    Alert.alert(
      'Delete Emergency Contact',
      `Are you sure you want to delete "${contactName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteEmergencyContact(contactId);
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleSetPrimary = async (contactId, contactName) => {
    const result = await setPrimaryContact(contactId);
    if (result.success) {
      Alert.alert('Success', `${contactName} has been set as your primary emergency contact.`);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleBulkDelete = () => {
    if (selectedContacts.length === 0) {
      Alert.alert('No Selection', 'Please select contacts to delete.');
      return;
    }

    Alert.alert(
      'Delete Multiple Contacts',
      `Are you sure you want to delete ${selectedContacts.length} contact(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await bulkDeleteContacts(selectedContacts);
            if (result.success) {
              setSelectedContacts([]);
              setIsSelectionMode(false);
              Alert.alert('Success', `Deleted ${result.deletedCount} contact(s).`);
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const toggleContactSelection = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const renderContact = ({ item }) => (
    <View style={[
      styles.contactCard,
      selectedContacts.includes(item.id) && styles.selectedContact
    ]}>
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>
            {item.name} {item.is_primary && <Text style={styles.primaryBadge}>PRIMARY</Text>}
          </Text>
          <Text style={styles.contactRelationship}>{item.display_relationship}</Text>
        </View>
        {isSelectionMode && (
          <TouchableOpacity
            style={[
              styles.selectionButton,
              selectedContacts.includes(item.id) && styles.selectedButton
            ]}
            onPress={() => toggleContactSelection(item.id)}
          >
            <Text style={styles.selectionButtonText}>
              {selectedContacts.includes(item.id) ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(item.phone_number)}
        >
          <Text style={styles.actionButtonText}>📞 Call</Text>
        </TouchableOpacity>
        
        {item.email && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEmail(item.email)}
          >
            <Text style={styles.actionButtonText}>✉️ Email</Text>
          </TouchableOpacity>
        )}
        
        {!item.is_primary && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetPrimary(item.id, item.name)}
          >
            <Text style={styles.actionButtonText}>⭐ Set Primary</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Emergency Contacts ({contacts.length}/{stats?.max_contacts || 28})
        </Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsSelectionMode(!isSelectionMode)}
        >
          <Text style={styles.headerButtonText}>
            {isSelectionMode ? 'Cancel' : 'Select'}
          </Text>
        </TouchableOpacity>
      </View>

      {isSelectionMode && selectedContacts.length > 0 && (
        <View style={styles.bulkActions}>
          <TouchableOpacity
            style={styles.bulkDeleteButton}
            onPress={handleBulkDelete}
          >
            <Text style={styles.bulkDeleteButtonText}>
              Delete {selectedContacts.length} Selected
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {primaryContact && (
        <View style={styles.primaryContactCard}>
          <Text style={styles.primaryContactTitle}>Primary Emergency Contact</Text>
          <Text style={styles.primaryContactName}>{primaryContact.name}</Text>
          <Text style={styles.primaryContactInfo}>{primaryContact.contact_info}</Text>
        </View>
      )}

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  bulkActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff3cd',
    borderBottomWidth: 1,
    borderBottomColor: '#ffeaa7',
  },
  bulkDeleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  bulkDeleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryContactCard: {
    backgroundColor: '#e8f5e8',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  primaryContactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  primaryContactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  primaryContactInfo: {
    fontSize: 14,
    color: '#666',
  },
  contactCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedContact: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  primaryBadge: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  contactRelationship: {
    fontSize: 14,
    color: '#666',
  },
  selectionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  selectionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contactActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    color: '#f44336',
  },
};

export default EmergencyContactsList;
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": true,
  "message": "Validation failed",
  "details": {
    "name": ["Name is required and cannot be empty."],
    "phone_number": ["Please enter a valid phone number."]
  }
}
```

#### 400 Bad Request - Contact Limit
```json
{
  "error": true,
  "message": "Maximum of 28 emergency contacts allowed per user.",
  "details": {}
}
```

#### 404 Not Found
```json
{
  "error": true,
  "message": "Emergency contact not found"
}
```

#### 403 Forbidden
```json
{
  "error": true,
  "message": "You can only access your own emergency contacts"
}
```

---

## Security Notes

1. **User Isolation**: Users can only access their own emergency contacts
2. **Data Validation**: All input is validated on the server
3. **JWT Authentication**: Required for all operations
4. **HTTPS Only**: All API calls must use HTTPS in production
5. **Contact Limits**: Maximum 28 contacts per user to prevent abuse
6. **Primary Contact**: Only one primary contact allowed per user

---

## Testing

Use the following test data for development:

```json
{
  "name": "Test Contact",
  "relationship": "Friend",
  "phone_number": "+1-555-123-4567",
  "email": "test@example.com",
  "is_primary": false
}
```

**Note**: Replace with actual test data in your development environment.
