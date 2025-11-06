# Medication Management API Documentation

## Overview
The Medication Management API provides comprehensive functionality for managing medications, reminders, and tracking medication adherence. This API supports multiple medication types, flexible dosing schedules, and detailed tracking of medication intake.

## Base URL
```
https://youdoc.onrender.com/medications
```

## Authentication
All endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. List Medications
**GET** `/`

Get all medications for the authenticated user with optional filtering.

#### Query Parameters
- `date` (string): Filter medications active on specific date (YYYY-MM-DD)
- `start_date` (string): Filter medications active in date range start
- `end_date` (string): Filter medications active in date range end
- `is_active` (boolean): Filter by active status

#### Example Request
```
GET /medications?date=2024-01-15&is_active=true
```

#### Success Response (200)
```json
[
  {
    "id": "MED-ABC12345",
    "name": "Metformin",
    "medication_type": "Pill",
    "dosage_display": "500mg",
    "frequency": "Daily",
    "start_date": "2024-01-01",
    "end_date": null,
    "is_active": true,
    "is_current": true,
    "reminder_count": 2,
    "time": ["08:00 AM", "08:00 PM"],
    "startDate": "January 01, 2024",
    "endDate": null,
    "reminderEnabled": true,
    "dateAdded": "2024-01-01",
    "taken": false,
    "created_at": "2024-01-01T10:30:00Z"
  }
]
```

---

### 2. Create Medication
**POST** `/`

Create a new medication with optional reminder times.

#### Request Body
```json
{
  "name": "Metformin",
  "medication_type": "Pill",
  "dosage_amount": 500,
  "dosage_unit": "mg",
  "frequency": "Daily",
  "start_date": "2024-01-15",
  "end_date": "2024-12-31",
  "notes": "Take with food to reduce stomach upset",
  "reminder_enabled": true,
  "reminder_times": ["08:00", "20:00"]
}
```

#### Required Fields
- `name` (string): Medication name
- `medication_type` (string): "Pill", "Injection", "Drops", "Inhaler", "Cream", "Spray"
- `dosage_amount` (number): Dosage amount (must be > 0)
- `dosage_unit` (string): "mg", "ml", "mcg", "g", "IU", "units", "tablets", "capsules", "drops", "puffs", "applications"
- `frequency` (string): "Daily", "Weekly", "As needed"
- `start_date` (string): Start date in YYYY-MM-DD format

#### Optional Fields
- `end_date` (string): End date in YYYY-MM-DD format
- `notes` (string): Additional notes or instructions
- `reminder_enabled` (boolean): Enable reminders (default: true)
- `reminder_times` (array): Array of time strings in HH:MM format

#### Success Response (201)
```json
{
  "id": "MED-ABC12345",
  "name": "Metformin",
  "medication_type": "Pill",
  "dosage_display": "500mg",
  "frequency": "Daily",
  "start_date": "2024-01-15",
  "end_date": "2024-12-31",
  "notes": "Take with food to reduce stomach upset",
  "reminder_enabled": true,
  "is_active": true,
  "reminder_times": [
    {
      "id": "uuid-here",
      "time": "08:00:00",
      "time_display": "08:00 AM",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid-here",
      "time": "20:00:00",
      "time_display": "08:00 PM",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 3. Get Medication Details
**GET** `/{medication_id}`

Get detailed information about a specific medication.

#### Success Response (200)
```json
{
  "id": "MED-ABC12345",
  "name": "Metformin",
  "medication_type": "Pill",
  "medication_type_display": "Pill",
  "dosage_amount": 500,
  "dosage_unit": "mg",
  "dosage_unit_display": "mg",
  "dosage_display": "500mg",
  "frequency": "Daily",
  "frequency_display": "Daily",
  "start_date": "2024-01-15",
  "end_date": "2024-12-31",
  "notes": "Take with food to reduce stomach upset",
  "reminder_enabled": true,
  "is_active": true,
  "is_current": true,
  "time": ["08:00 AM", "08:00 PM"],
  "startDate": "January 15, 2024",
  "endDate": "December 31, 2024",
  "reminderEnabled": true,
  "dateAdded": "2024-01-15",
  "startDateObj": "2024-01-15",
  "endDateObj": "2024-12-31",
  "taken": false,
  "reminder_times": [
    {
      "id": "uuid-here",
      "time": "08:00:00",
      "time_display": "08:00 AM",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "taken_records": [
    {
      "id": "uuid-here",
      "date": "2024-01-15",
      "taken": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 4. Update Medication
**PUT/PATCH** `/{medication_id}`

Update medication information and reminder times.

#### Request Body (PATCH - partial update)
```json
{
  "name": "Metformin Extended Release",
  "notes": "Updated instructions: Take once daily with evening meal",
  "reminder_times": ["20:00"]
}
```

#### Success Response (200)
```json
{
  "id": "MED-ABC12345",
  "name": "Metformin Extended Release",
  "medication_type": "Pill",
  "dosage_display": "500mg",
  "frequency": "Daily",
  "start_date": "2024-01-15",
  "end_date": "2024-12-31",
  "notes": "Updated instructions: Take once daily with evening meal",
  "reminder_enabled": true,
  "is_active": true,
  "time": ["08:00 PM"],
  "startDate": "January 15, 2024",
  "endDate": "December 31, 2024",
  "reminderEnabled": true,
  "dateAdded": "2024-01-15",
  "taken": false,
  "updated_at": "2024-01-15T11:30:00Z"
}
```

---

### 5. Delete Medication
**DELETE** `/{medication_id}`

Permanently delete a medication and all associated records.

#### Success Response (204)
```
No Content
```

---

### 6. Toggle Medication Taken
**POST** `/{medication_id}/toggle`

Toggle medication taken status for today. This is the main endpoint for marking medications as taken/not taken.

#### Success Response (200)
```json
{
  "id": "uuid-here",
  "date": "2024-01-15",
  "taken": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 7. Get Today's Medications
**GET** `/today`

Get all medications scheduled for today with their taken status.

#### Success Response (200)
```json
[
  {
    "id": "MED-ABC12345",
    "name": "Metformin",
    "dosage": "500mg",
    "time": ["08:00 AM", "08:00 PM"],
    "taken": false,
    "medication_type": "Pill",
    "notes": "Take with food to reduce stomach upset"
  },
  {
    "id": "MED-DEF67890",
    "name": "Vitamin D",
    "dosage": "1000 IU",
    "time": ["09:00 AM"],
    "taken": true,
    "medication_type": "Pill",
    "notes": "Take with breakfast"
  }
]
```

---

### 8. Get Medication Calendar
**GET** `/calendar`

Get medication data for calendar view with taken status for each day.

#### Query Parameters
- `month` (integer): Month (1-12)
- `year` (integer): Year (e.g., 2024)

#### Example Request
```
GET /medications/calendar?month=1&year=2024
```

#### Success Response (200)
```json
{
  "2024-01-15": [
    {
      "id": "MED-ABC12345",
      "name": "Metformin",
      "dosage": "500mg",
      "time": ["08:00 AM", "08:00 PM"],
      "taken": true,
      "medication_type": "Pill"
    }
  ],
  "2024-01-16": [
    {
      "id": "MED-ABC12345",
      "name": "Metformin",
      "dosage": "500mg",
      "time": ["08:00 AM", "08:00 PM"],
      "taken": false,
      "medication_type": "Pill"
    }
  ]
}
```

---

### 9. List Medication Taken Records
**GET** `/taken`

Get medication taken records with optional filtering.

#### Query Parameters
- `medication` (string): Filter by medication ID
- `date` (string): Filter by specific date (YYYY-MM-DD)
- `taken` (boolean): Filter by taken status

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "date": "2024-01-15",
    "taken": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 10. Create Medication Taken Record
**POST** `/taken`

Manually create a medication taken record.

#### Request Body
```json
{
  "medication": "MED-ABC12345",
  "date": "2024-01-15",
  "taken": true
}
```

#### Success Response (201)
```json
{
  "id": "uuid-here",
  "date": "2024-01-15",
  "taken": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## React Native Integration

### 1. Medication Service
```javascript
// services/medicationService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://youdoc.onrender.com/medications';

class MedicationService {
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getMedications(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}?${params}`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async createMedication(medicationData) {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(medicationData),
    });
    return response.json();
  }

  async updateMedication(medicationId, medicationData) {
    const response = await fetch(`${API_BASE_URL}/${medicationId}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(medicationData),
    });
    return response.json();
  }

  async deleteMedication(medicationId) {
    const response = await fetch(`${API_BASE_URL}/${medicationId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.status === 204;
  }

  async toggleMedicationTaken(medicationId) {
    const response = await fetch(`${API_BASE_URL}/${medicationId}/toggle`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getTodayMedications() {
    const response = await fetch(`${API_BASE_URL}/today`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getMedicationCalendar(month, year) {
    const response = await fetch(`${API_BASE_URL}/calendar?month=${month}&year=${year}`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getMedicationDetails(medicationId) {
    const response = await fetch(`${API_BASE_URL}/${medicationId}`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }
}

export default new MedicationService();
```

### 2. Medication Context
```javascript
// context/MedicationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import MedicationService from '../services/medicationService';

const MedicationContext = createContext();

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState([]);
  const [todayMedications, setTodayMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMedications = async (filters = {}) => {
    setIsLoading(true);
    try {
      const data = await MedicationService.getMedications(filters);
      setMedications(data);
    } catch (error) {
      console.error('Failed to load medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTodayMedications = async () => {
    try {
      const data = await MedicationService.getTodayMedications();
      setTodayMedications(data);
    } catch (error) {
      console.error('Failed to load today medications:', error);
    }
  };

  const addMedication = async (medicationData) => {
    try {
      const newMedication = await MedicationService.createMedication(medicationData);
      setMedications(prev => [newMedication, ...prev]);
      await loadTodayMedications();
      return { success: true, medication: newMedication };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateMedication = async (medicationId, medicationData) => {
    try {
      const updatedMedication = await MedicationService.updateMedication(medicationId, medicationData);
      setMedications(prev => 
        prev.map(med => med.id === medicationId ? updatedMedication : med)
      );
      await loadTodayMedications();
      return { success: true, medication: updatedMedication };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteMedication = async (medicationId) => {
    try {
      await MedicationService.deleteMedication(medicationId);
      setMedications(prev => prev.filter(med => med.id !== medicationId));
      await loadTodayMedications();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleMedicationTaken = async (medicationId) => {
    try {
      const result = await MedicationService.toggleMedicationTaken(medicationId);
      await loadTodayMedications();
      await loadMedications();
      return { success: true, record: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getMedicationCalendar = async (month, year) => {
    try {
      return await MedicationService.getMedicationCalendar(month, year);
    } catch (error) {
      console.error('Failed to load calendar:', error);
      return {};
    }
  };

  useEffect(() => {
    loadMedications();
    loadTodayMedications();
  }, []);

  const value = {
    medications,
    todayMedications,
    isLoading,
    loadMedications,
    loadTodayMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleMedicationTaken,
    getMedicationCalendar,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};
```

### 3. Medication List Component
```javascript
// components/MedicationList.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useMedications } from '../context/MedicationContext';

const MedicationList = () => {
  const { medications, toggleMedicationTaken, deleteMedication } = useMedications();
  const [refreshing, setRefreshing] = useState(false);

  const handleToggleTaken = async (medicationId) => {
    const result = await toggleMedicationTaken(medicationId);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  const handleDelete = async (medicationId, medicationName) => {
    Alert.alert(
      'Delete Medication',
      `Are you sure you want to delete ${medicationName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteMedication(medicationId);
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const renderMedication = ({ item }) => (
    <View style={styles.medicationCard}>
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationDosage}>{item.dosage_display}</Text>
        <Text style={styles.medicationTime}>{item.time.join(', ')}</Text>
      </View>
      <View style={styles.medicationActions}>
        <TouchableOpacity
          style={[
            styles.takenButton,
            item.taken ? styles.takenButtonActive : styles.takenButtonInactive
          ]}
          onPress={() => handleToggleTaken(item.id)}
        >
          <Text style={styles.takenButtonText}>
            {item.taken ? 'Taken' : 'Mark Taken'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={medications}
      renderItem={renderMedication}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        // Refresh logic here
        setRefreshing(false);
      }}
    />
  );
};

const styles = {
  medicationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#666',
  },
  medicationTime: {
    fontSize: 12,
    color: '#999',
  },
  medicationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  takenButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  takenButtonActive: {
    backgroundColor: '#4CAF50',
  },
  takenButtonInactive: {
    backgroundColor: '#f0f0f0',
  },
  takenButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f44336',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
};

export default MedicationList;
```

### 4. Add Medication Screen
```javascript
// screens/AddMedicationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useMedications } from '../context/MedicationContext';

const AddMedicationScreen = ({ navigation }) => {
  const { addMedication } = useMedications();
  const [formData, setFormData] = useState({
    name: '',
    medication_type: 'Pill',
    dosage_amount: '',
    dosage_unit: 'mg',
    frequency: 'Daily',
    start_date: '',
    end_date: '',
    notes: '',
    reminder_enabled: true,
    reminder_times: ['08:00'],
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.dosage_amount || !formData.start_date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const result = await addMedication(formData);
    if (result.success) {
      Alert.alert('Success', 'Medication added successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Medication Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Medication Type</Text>
        <Picker
          selectedValue={formData.medication_type}
          onValueChange={(value) => setFormData({ ...formData, medication_type: value })}
        >
          <Picker.Item label="Pill" value="Pill" />
          <Picker.Item label="Injection" value="Injection" />
          <Picker.Item label="Drops" value="Drops" />
          <Picker.Item label="Inhaler" value="Inhaler" />
          <Picker.Item label="Cream" value="Cream" />
          <Picker.Item label="Spray" value="Spray" />
        </Picker>
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Dosage Amount"
          value={formData.dosage_amount}
          onChangeText={(text) => setFormData({ ...formData, dosage_amount: text })}
          keyboardType="numeric"
        />
        
        <View style={[styles.pickerContainer, styles.halfInput]}>
          <Picker
            selectedValue={formData.dosage_unit}
            onValueChange={(value) => setFormData({ ...formData, dosage_unit: value })}
          >
            <Picker.Item label="mg" value="mg" />
            <Picker.Item label="ml" value="ml" />
            <Picker.Item label="mcg" value="mcg" />
            <Picker.Item label="g" value="g" />
            <Picker.Item label="IU" value="IU" />
            <Picker.Item label="units" value="units" />
            <Picker.Item label="tablets" value="tablets" />
            <Picker.Item label="capsules" value="capsules" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Medication</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
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

export default AddMedicationScreen;
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
    "dosage_amount": ["This field is required"],
    "start_date": ["Invalid date format"]
  }
}
```

#### 404 Not Found
```json
{
  "error": true,
  "message": "Medication not found"
}
```

#### 403 Forbidden
```json
{
  "error": true,
  "message": "You can only access your own medications"
}
```

---

## Data Models

### Medication Types
- `Pill`: Oral tablets/capsules
- `Injection`: Injectable medications
- `Drops`: Eye/ear drops
- `Inhaler`: Inhaler devices
- `Cream`: Topical creams/ointments
- `Spray`: Nasal/oral sprays

### Dosage Units
- `mg`: Milligrams
- `ml`: Milliliters
- `mcg`: Micrograms
- `g`: Grams
- `IU`: International Units
- `units`: Units
- `tablets`: Tablets
- `capsules`: Capsules
- `drops`: Drops
- `puffs`: Puffs (inhalers)
- `applications`: Applications (creams)

### Frequency Types
- `Daily`: Once per day
- `Weekly`: Once per week
- `As needed`: As required

---

## Security Notes

1. **User Isolation**: Users can only access their own medications
2. **Data Validation**: All input is validated on the server
3. **JWT Authentication**: Required for all operations
4. **HTTPS Only**: All API calls must use HTTPS in production
5. **Rate Limiting**: API calls are rate-limited to prevent abuse

---

## Testing

Use the following test data for development:

```json
{
  "name": "Test Medication",
  "medication_type": "Pill",
  "dosage_amount": 100,
  "dosage_unit": "mg",
  "frequency": "Daily",
  "start_date": "2024-01-01",
  "reminder_times": ["08:00", "20:00"]
}
```

**Note**: Replace with actual test data in your development environment.
