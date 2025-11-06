# Health Records API Documentation

## Overview
The Health Records API provides comprehensive functionality for managing personal health records, including lab results, prescriptions, imaging reports, vaccination records, and other medical documents. Users can upload files, organize records by type, and maintain detailed health documentation.

## Base URL
```
https://youdoc.onrender.com/api/health-records/
```

## Authentication
All endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. List Health Records
**GET** `/`

Get all health records for the authenticated user with optional filtering and search.

#### Query Parameters
- `type` (string): Filter by record type ("lab_result", "prescription", "imaging", "vaccination", "other")
- `date_from` (string): Filter records from date (YYYY-MM-DD)
- `date_to` (string): Filter records to date (YYYY-MM-DD)
- `has_file` (boolean): Filter records with/without files
- `search` (string): Search in title, description, and notes
- `ordering` (string): Order by field ("date", "created_at", "title", "-date", "-created_at", "-title")

#### Example Request
```
GET /api/health-records/?type=lab_result&date_from=2024-01-01&has_file=true&search=blood
```

#### Success Response (200)
```json
[
  {
    "id": "HR-ABC12345",
    "title": "Blood Test Results",
    "type": "lab_result",
    "date": "2024-01-15",
    "description": "Complete blood count and metabolic panel",
    "file_uri": "https://youdoc.onrender.com/media/health_records/user_id/HR-ABC12345/blood_test.pdf",
    "file_name": "blood_test.pdf",
    "notes": "All values within normal range",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 2. Create Health Record
**POST** `/`

Create a new health record with optional file upload.

#### Request Body (multipart/form-data)
```
title: "Blood Test Results"
type: "lab_result"
date: "2024-01-15"
description: "Complete blood count and metabolic panel"
file: [file upload]
notes: "All values within normal range"
```

#### Required Fields
- `title` (string): Title of the health record
- `type` (string): Record type ("lab_result", "prescription", "imaging", "vaccination", "other")
- `date` (string): Date of the record in YYYY-MM-DD format

#### Optional Fields
- `description` (string): Description of the record
- `file` (file): Upload file (PDF, JPG, JPEG, PNG, GIF, DOC, DOCX, TXT)
- `notes` (string): Additional notes

#### Supported File Types
- **Documents**: PDF, DOC, DOCX, TXT
- **Images**: JPG, JPEG, PNG, GIF
- **Maximum file size**: 10MB (configured in Django settings)

#### Success Response (201)
```json
{
  "id": "HR-ABC12345",
  "title": "Blood Test Results",
  "type": "lab_result",
  "date": "2024-01-15",
  "description": "Complete blood count and metabolic panel",
  "file_uri": "https://youdoc.onrender.com/media/health_records/user_id/HR-ABC12345/blood_test.pdf",
  "file_name": "blood_test.pdf",
  "notes": "All values within normal range",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 3. Get Health Record Details
**GET** `/{record_id}/`

Get detailed information about a specific health record.

#### Success Response (200)
```json
{
  "id": "HR-ABC12345",
  "title": "Blood Test Results",
  "type": "lab_result",
  "date": "2024-01-15",
  "description": "Complete blood count and metabolic panel",
  "file_uri": "https://youdoc.onrender.com/media/health_records/user_id/HR-ABC12345/blood_test.pdf",
  "file_name": "blood_test.pdf",
  "notes": "All values within normal range",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 4. Update Health Record
**PUT/PATCH** `/{record_id}/`

Update health record information and optionally replace the file.

#### Request Body (multipart/form-data)
```
title: "Updated Blood Test Results"
description: "Updated description"
file: [new file upload]
notes: "Updated notes"
```

#### Success Response (200)
```json
{
  "id": "HR-ABC12345",
  "title": "Updated Blood Test Results",
  "type": "lab_result",
  "date": "2024-01-15",
  "description": "Updated description",
  "file_uri": "https://youdoc.onrender.com/media/health_records/user_id/HR-ABC12345/new_blood_test.pdf",
  "file_name": "new_blood_test.pdf",
  "notes": "Updated notes",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:30:00Z"
}
```

---

### 5. Delete Health Record
**DELETE** `/{record_id}/`

Permanently delete a health record and its associated file.

#### Success Response (204)
```
No Content
```

---

## Health Record Types

### 1. Lab Result
- **Purpose**: Laboratory test results
- **Common files**: PDF reports, image scans
- **Examples**: Blood tests, urine tests, pathology reports

### 2. Prescription
- **Purpose**: Medication prescriptions
- **Common files**: PDF prescriptions, image scans
- **Examples**: Doctor's prescriptions, pharmacy receipts

### 3. Imaging
- **Purpose**: Medical imaging reports
- **Common files**: PDF reports, image files
- **Examples**: X-rays, MRI reports, CT scans, ultrasound reports

### 4. Vaccination
- **Purpose**: Vaccination records
- **Common files**: PDF certificates, image scans
- **Examples**: Vaccination cards, immunization records

### 5. Other
- **Purpose**: Miscellaneous health documents
- **Common files**: Various formats
- **Examples**: Insurance cards, medical certificates, discharge summaries

---

## React Native Integration

### 1. Health Records Service
```javascript
// services/healthRecordsService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://youdoc.onrender.com/api/health-records';

class HealthRecordsService {
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  async getHealthRecords(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/?${params}`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async createHealthRecord(recordData, file = null) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(recordData).forEach(key => {
      if (recordData[key] !== null && recordData[key] !== undefined) {
        formData.append(key, recordData[key]);
      }
    });
    
    // Add file if provided
    if (file) {
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    }

    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: formData,
    });
    return response.json();
  }

  async updateHealthRecord(recordId, recordData, file = null) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(recordData).forEach(key => {
      if (recordData[key] !== null && recordData[key] !== undefined) {
        formData.append(key, recordData[key]);
      }
    });
    
    // Add file if provided
    if (file) {
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    }

    const response = await fetch(`${API_BASE_URL}/${recordId}/`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: formData,
    });
    return response.json();
  }

  async deleteHealthRecord(recordId) {
    const response = await fetch(`${API_BASE_URL}/${recordId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.status === 204;
  }

  async getHealthRecordDetails(recordId) {
    const response = await fetch(`${API_BASE_URL}/${recordId}/`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }
}

export default new HealthRecordsService();
```

### 2. Health Records Context
```javascript
// context/HealthRecordsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import HealthRecordsService from '../services/healthRecordsService';

const HealthRecordsContext = createContext();

export const useHealthRecords = () => {
  const context = useContext(HealthRecordsContext);
  if (!context) {
    throw new Error('useHealthRecords must be used within a HealthRecordsProvider');
  }
  return context;
};

export const HealthRecordsProvider = ({ children }) => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHealthRecords = async (filters = {}) => {
    setIsLoading(true);
    try {
      const data = await HealthRecordsService.getHealthRecords(filters);
      setHealthRecords(data);
    } catch (error) {
      console.error('Failed to load health records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addHealthRecord = async (recordData, file = null) => {
    try {
      const newRecord = await HealthRecordsService.createHealthRecord(recordData, file);
      setHealthRecords(prev => [newRecord, ...prev]);
      return { success: true, record: newRecord };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateHealthRecord = async (recordId, recordData, file = null) => {
    try {
      const updatedRecord = await HealthRecordsService.updateHealthRecord(recordId, recordData, file);
      setHealthRecords(prev => 
        prev.map(record => record.id === recordId ? updatedRecord : record)
      );
      return { success: true, record: updatedRecord };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteHealthRecord = async (recordId) => {
    try {
      await HealthRecordsService.deleteHealthRecord(recordId);
      setHealthRecords(prev => prev.filter(record => record.id !== recordId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getHealthRecordDetails = async (recordId) => {
    try {
      return await HealthRecordsService.getHealthRecordDetails(recordId);
    } catch (error) {
      console.error('Failed to load health record details:', error);
      return null;
    }
  };

  useEffect(() => {
    loadHealthRecords();
  }, []);

  const value = {
    healthRecords,
    isLoading,
    loadHealthRecords,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    getHealthRecordDetails,
  };

  return (
    <HealthRecordsContext.Provider value={value}>
      {children}
    </HealthRecordsContext.Provider>
  );
};
```

### 3. Health Records List Component
```javascript
// components/HealthRecordsList.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { useHealthRecords } from '../context/HealthRecordsContext';

const HealthRecordsList = () => {
  const { healthRecords, deleteHealthRecord, loadHealthRecords } = useHealthRecords();
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const handleDelete = async (recordId, recordTitle) => {
    Alert.alert(
      'Delete Health Record',
      `Are you sure you want to delete "${recordTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteHealthRecord(recordId);
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHealthRecords();
    setRefreshing(false);
  };

  const getTypeIcon = (type) => {
    const icons = {
      lab_result: '🧪',
      prescription: '💊',
      imaging: '📷',
      vaccination: '💉',
      other: '📄',
    };
    return icons[type] || '📄';
  };

  const getTypeColor = (type) => {
    const colors = {
      lab_result: '#4CAF50',
      prescription: '#2196F3',
      imaging: '#FF9800',
      vaccination: '#9C27B0',
      other: '#607D8B',
    };
    return colors[type] || '#607D8B';
  };

  const filteredRecords = filterType === 'all' 
    ? healthRecords 
    : healthRecords.filter(record => record.type === filterType);

  const renderHealthRecord = ({ item }) => (
    <View style={[styles.recordCard, { borderLeftColor: getTypeColor(item.type) }]}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordIcon}>{getTypeIcon(item.type)}</Text>
        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle}>{item.title}</Text>
          <Text style={styles.recordDate}>{new Date(item.date).toLocaleDateString()}</Text>
          <Text style={styles.recordType}>{item.type.replace('_', ' ').toUpperCase()}</Text>
        </View>
        {item.file_uri && (
          <Text style={styles.fileIcon}>📎</Text>
        )}
      </View>
      
      {item.description && (
        <Text style={styles.recordDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.recordActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Navigate to details screen
          }}
        >
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterButtonText, filterType === 'all' && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'lab_result' && styles.filterButtonActive]}
          onPress={() => setFilterType('lab_result')}
        >
          <Text style={[styles.filterButtonText, filterType === 'lab_result' && styles.filterButtonTextActive]}>
            Lab Results
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'prescription' && styles.filterButtonActive]}
          onPress={() => setFilterType('prescription')}
        >
          <Text style={[styles.filterButtonText, filterType === 'prescription' && styles.filterButtonTextActive]}>
            Prescriptions
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredRecords}
        renderItem={renderHealthRecord}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  recordCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  recordType: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  fileIcon: {
    fontSize: 16,
    color: '#666',
  },
  recordDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#fff',
  },
};

export default HealthRecordsList;
```

### 4. Add Health Record Screen
```javascript
// screens/AddHealthRecordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import { useHealthRecords } from '../context/HealthRecordsContext';

const AddHealthRecordScreen = ({ navigation }) => {
  const { addHealthRecord } = useHealthRecords();
  const [formData, setFormData] = useState({
    title: '',
    type: 'other',
    date: '',
    description: '',
    notes: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images, DocumentPicker.types.doc],
      });
      setSelectedFile(result[0]);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled
      } else {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const result = await addHealthRecord(formData, selectedFile);
    if (result.success) {
      Alert.alert('Success', 'Health record added successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title *"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Record Type *</Text>
        <Picker
          selectedValue={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <Picker.Item label="Lab Result" value="lab_result" />
          <Picker.Item label="Prescription" value="prescription" />
          <Picker.Item label="Imaging" value="imaging" />
          <Picker.Item label="Vaccination" value="vaccination" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD) *"
        value={formData.date}
        onChangeText={(text) => setFormData({ ...formData, date: text })}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.fileButton} onPress={handleFilePicker}>
        <Text style={styles.fileButtonText}>
          {selectedFile ? `Selected: ${selectedFile.name}` : 'Select File (Optional)'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes"
        value={formData.notes}
        onChangeText={(text) => setFormData({ ...formData, notes: text })}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Health Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  fileButton: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f8f9ff',
    alignItems: 'center',
  },
  fileButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default AddHealthRecordScreen;
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
    "title": ["This field is required"],
    "date": ["Invalid date format"]
  }
}
```

#### 413 Payload Too Large
```json
{
  "error": true,
  "message": "File size too large",
  "details": "Maximum file size is 10MB"
}
```

#### 415 Unsupported Media Type
```json
{
  "error": true,
  "message": "Unsupported file type",
  "details": "Only PDF, JPG, JPEG, PNG, GIF, DOC, DOCX, TXT files are allowed"
}
```

---

## File Upload Guidelines

### Supported File Types
- **Documents**: PDF, DOC, DOCX, TXT
- **Images**: JPG, JPEG, PNG, GIF
- **Maximum file size**: 10MB
- **Maximum files per record**: 1

### File Storage
- Files are stored in Cloudinary for production
- Files are organized by user ID and record ID
- Original file names are preserved
- Files are accessible via secure URLs

### Security Considerations
- File type validation on both client and server
- File size limits to prevent abuse
- Secure file storage with access controls
- Virus scanning for uploaded files (recommended)

---

## Security Notes

1. **User Isolation**: Users can only access their own health records
2. **File Security**: Uploaded files are stored securely with access controls
3. **Data Validation**: All input is validated on the server
4. **JWT Authentication**: Required for all operations
5. **HTTPS Only**: All API calls must use HTTPS in production
6. **File Type Restrictions**: Only medical document types are allowed

---

## Testing

Use the following test data for development:

```json
{
  "title": "Test Lab Result",
  "type": "lab_result",
  "date": "2024-01-15",
  "description": "Test blood work results",
  "notes": "All values normal"
}
```

**Note**: Replace with actual test data in your development environment.
