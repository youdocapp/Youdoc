# Medical History API Documentation

## Overview
The Medical History API provides comprehensive functionality for managing personal medical history, including medical conditions, surgical procedures, and allergies. This API helps users maintain detailed medical records for better healthcare management and emergency situations.

## Base URL
```
https://youdoc.onrender.com/api/medical-history/
```

## Authentication
All endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### Medical Conditions

#### 1. List Medical Conditions
**GET** `/conditions/`

Get all medical conditions for the authenticated user.

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "Type 2 Diabetes",
      "diagnosedDate": "2020-03-15",
      "status": "chronic",
      "notes": "Well controlled with medication",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### 2. Create Medical Condition
**POST** `/conditions/`

Add a new medical condition to the user's history.

#### Request Body
```json
{
  "name": "Hypertension",
  "diagnosedDate": "2023-06-10",
  "status": "active",
  "notes": "Controlled with ACE inhibitor"
}
```

#### Required Fields
- `name` (string): Name of the medical condition
- `diagnosedDate` (string): Date diagnosed in YYYY-MM-DD format

#### Optional Fields
- `status` (string): "active", "resolved", "chronic" (default: "active")
- `notes` (string): Additional notes about the condition

#### Success Response (201)
```json
{
  "success": true,
  "message": "Medical condition added successfully",
  "data": {
    "id": "uuid-here",
    "name": "Hypertension",
    "diagnosedDate": "2023-06-10",
    "status": "active",
    "notes": "Controlled with ACE inhibitor",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 3. Get Medical Condition Details
**GET** `/conditions/{condition_id}/`

Get detailed information about a specific medical condition.

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Hypertension",
    "diagnosedDate": "2023-06-10",
    "status": "active",
    "notes": "Controlled with ACE inhibitor",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 4. Update Medical Condition
**PUT/PATCH** `/conditions/{condition_id}/`

Update an existing medical condition.

#### Request Body (PATCH - partial update)
```json
{
  "status": "resolved",
  "notes": "Resolved with lifestyle changes and medication"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Medical condition updated successfully",
  "data": {
    "id": "uuid-here",
    "name": "Hypertension",
    "diagnosedDate": "2023-06-10",
    "status": "resolved",
    "notes": "Resolved with lifestyle changes and medication",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

#### 5. Delete Medical Condition
**DELETE** `/conditions/{condition_id}/`

Permanently delete a medical condition.

#### Success Response (200)
```json
{
  "success": true,
  "message": "Medical condition deleted successfully"
}
```

---

### Surgeries

#### 1. List Surgeries
**GET** `/surgeries/`

Get all surgical procedures for the authenticated user.

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "Appendectomy",
      "date": "2018-05-20",
      "hospital": "City General Hospital",
      "surgeon": "Dr. Smith",
      "notes": "Laparoscopic procedure, recovery was smooth",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### 2. Create Surgery
**POST** `/surgeries/`

Add a new surgical procedure to the user's history.

#### Request Body
```json
{
  "name": "Knee Arthroscopy",
  "date": "2022-08-15",
  "hospital": "Orthopedic Center",
  "surgeon": "Dr. Johnson",
  "notes": "Repaired meniscus tear, full recovery expected"
}
```

#### Required Fields
- `name` (string): Name of the surgical procedure
- `date` (string): Date of surgery in YYYY-MM-DD format

#### Optional Fields
- `hospital` (string): Hospital where surgery was performed
- `surgeon` (string): Name of the surgeon
- `notes` (string): Additional notes about the surgery

#### Success Response (201)
```json
{
  "success": true,
  "message": "Surgery added successfully",
  "data": {
    "id": "uuid-here",
    "name": "Knee Arthroscopy",
    "date": "2022-08-15",
    "hospital": "Orthopedic Center",
    "surgeon": "Dr. Johnson",
    "notes": "Repaired meniscus tear, full recovery expected",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 3. Get Surgery Details
**GET** `/surgeries/{surgery_id}/`

Get detailed information about a specific surgery.

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Knee Arthroscopy",
    "date": "2022-08-15",
    "hospital": "Orthopedic Center",
    "surgeon": "Dr. Johnson",
    "notes": "Repaired meniscus tear, full recovery expected",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 4. Update Surgery
**PUT/PATCH** `/surgeries/{surgery_id}/`

Update an existing surgical procedure.

#### Request Body (PATCH - partial update)
```json
{
  "notes": "Updated: Full recovery achieved, no complications"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Surgery updated successfully",
  "data": {
    "id": "uuid-here",
    "name": "Knee Arthroscopy",
    "date": "2022-08-15",
    "hospital": "Orthopedic Center",
    "surgeon": "Dr. Johnson",
    "notes": "Updated: Full recovery achieved, no complications",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

#### 5. Delete Surgery
**DELETE** `/surgeries/{surgery_id}/`

Permanently delete a surgical procedure.

#### Success Response (200)
```json
{
  "success": true,
  "message": "Surgery deleted successfully"
}
```

---

### Allergies

#### 1. List Allergies
**GET** `/allergies/`

Get all allergies for the authenticated user.

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "allergen": "Penicillin",
      "reaction": "Severe rash and difficulty breathing",
      "severity": "severe",
      "notes": "Requires immediate medical attention",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### 2. Create Allergy
**POST** `/allergies/`

Add a new allergy to the user's history.

#### Request Body
```json
{
  "allergen": "Shellfish",
  "reaction": "Hives and stomach upset",
  "severity": "moderate",
  "notes": "Avoid all shellfish and products containing shellfish"
}
```

#### Required Fields
- `allergen` (string): Substance that causes the allergic reaction
- `reaction` (string): Description of the allergic reaction

#### Optional Fields
- `severity` (string): "mild", "moderate", "severe" (default: "moderate")
- `notes` (string): Additional notes about the allergy

#### Success Response (201)
```json
{
  "success": true,
  "message": "Allergy added successfully",
  "data": {
    "id": "uuid-here",
    "allergen": "Shellfish",
    "reaction": "Hives and stomach upset",
    "severity": "moderate",
    "notes": "Avoid all shellfish and products containing shellfish",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 3. Get Allergy Details
**GET** `/allergies/{allergy_id}/`

Get detailed information about a specific allergy.

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "allergen": "Shellfish",
    "reaction": "Hives and stomach upset",
    "severity": "moderate",
    "notes": "Avoid all shellfish and products containing shellfish",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 4. Update Allergy
**PUT/PATCH** `/allergies/{allergy_id}/`

Update an existing allergy.

#### Request Body (PATCH - partial update)
```json
{
  "severity": "severe",
  "notes": "Updated: Now causes anaphylaxis, carry epinephrine"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Allergy updated successfully",
  "data": {
    "id": "uuid-here",
    "allergen": "Shellfish",
    "reaction": "Hives and stomach upset",
  "severity": "severe",
    "notes": "Updated: Now causes anaphylaxis, carry epinephrine",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

#### 5. Delete Allergy
**DELETE** `/allergies/{allergy_id}/`

Permanently delete an allergy.

#### Success Response (200)
```json
{
  "success": true,
  "message": "Allergy deleted successfully"
}
```

---

## Data Models

### Medical Condition Status
- `active`: Currently experiencing the condition
- `resolved`: Condition has been resolved/cured
- `chronic`: Long-term condition that requires ongoing management

### Allergy Severity
- `mild`: Minor reactions, usually not life-threatening
- `moderate`: Moderate reactions, may require medical attention
- `severe`: Severe reactions, potentially life-threatening (anaphylaxis)

---

## React Native Integration

### 1. Medical History Service
```javascript
// services/medicalHistoryService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://youdoc.onrender.com/api/medical-history';

class MedicalHistoryService {
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Medical Conditions
  async getMedicalConditions() {
    const response = await fetch(`${API_BASE_URL}/conditions/`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async createMedicalCondition(conditionData) {
    const response = await fetch(`${API_BASE_URL}/conditions/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(conditionData),
    });
    return response.json();
  }

  async updateMedicalCondition(conditionId, conditionData) {
    const response = await fetch(`${API_BASE_URL}/conditions/${conditionId}/`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(conditionData),
    });
    return response.json();
  }

  async deleteMedicalCondition(conditionId) {
    const response = await fetch(`${API_BASE_URL}/conditions/${conditionId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  // Surgeries
  async getSurgeries() {
    const response = await fetch(`${API_BASE_URL}/surgeries/`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async createSurgery(surgeryData) {
    const response = await fetch(`${API_BASE_URL}/surgeries/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(surgeryData),
    });
    return response.json();
  }

  async updateSurgery(surgeryId, surgeryData) {
    const response = await fetch(`${API_BASE_URL}/surgeries/${surgeryId}/`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(surgeryData),
    });
    return response.json();
  }

  async deleteSurgery(surgeryId) {
    const response = await fetch(`${API_BASE_URL}/surgeries/${surgeryId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  // Allergies
  async getAllergies() {
    const response = await fetch(`${API_BASE_URL}/allergies/`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async createAllergy(allergyData) {
    const response = await fetch(`${API_BASE_URL}/allergies/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(allergyData),
    });
    return response.json();
  }

  async updateAllergy(allergyId, allergyData) {
    const response = await fetch(`${API_BASE_URL}/allergies/${allergyId}/`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(allergyData),
    });
    return response.json();
  }

  async deleteAllergy(allergyId) {
    const response = await fetch(`${API_BASE_URL}/allergies/${allergyId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }
}

export default new MedicalHistoryService();
```

### 2. Medical History Context
```javascript
// context/MedicalHistoryContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import MedicalHistoryService from '../services/medicalHistoryService';

const MedicalHistoryContext = createContext();

export const useMedicalHistory = () => {
  const context = useContext(MedicalHistoryContext);
  if (!context) {
    throw new Error('useMedicalHistory must be used within a MedicalHistoryProvider');
  }
  return context;
};

export const MedicalHistoryProvider = ({ children }) => {
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMedicalConditions = async () => {
    setIsLoading(true);
    try {
      const response = await MedicalHistoryService.getMedicalConditions();
      if (response.success) {
        setMedicalConditions(response.data);
      }
    } catch (error) {
      console.error('Failed to load medical conditions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSurgeries = async () => {
    setIsLoading(true);
    try {
      const response = await MedicalHistoryService.getSurgeries();
      if (response.success) {
        setSurgeries(response.data);
      }
    } catch (error) {
      console.error('Failed to load surgeries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllergies = async () => {
    setIsLoading(true);
    try {
      const response = await MedicalHistoryService.getAllergies();
      if (response.success) {
        setAllergies(response.data);
      }
    } catch (error) {
      console.error('Failed to load allergies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMedicalCondition = async (conditionData) => {
    try {
      const response = await MedicalHistoryService.createMedicalCondition(conditionData);
      if (response.success) {
        setMedicalConditions(prev => [response.data, ...prev]);
        return { success: true, condition: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addSurgery = async (surgeryData) => {
    try {
      const response = await MedicalHistoryService.createSurgery(surgeryData);
      if (response.success) {
        setSurgeries(prev => [response.data, ...prev]);
        return { success: true, surgery: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addAllergy = async (allergyData) => {
    try {
      const response = await MedicalHistoryService.createAllergy(allergyData);
      if (response.success) {
        setAllergies(prev => [response.data, ...prev]);
        return { success: true, allergy: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateMedicalCondition = async (conditionId, conditionData) => {
    try {
      const response = await MedicalHistoryService.updateMedicalCondition(conditionId, conditionData);
      if (response.success) {
        setMedicalConditions(prev => 
          prev.map(condition => condition.id === conditionId ? response.data : condition)
        );
        return { success: true, condition: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteMedicalCondition = async (conditionId) => {
    try {
      const response = await MedicalHistoryService.deleteMedicalCondition(conditionId);
      if (response.success) {
        setMedicalConditions(prev => prev.filter(condition => condition.id !== conditionId));
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteSurgery = async (surgeryId) => {
    try {
      const response = await MedicalHistoryService.deleteSurgery(surgeryId);
      if (response.success) {
        setSurgeries(prev => prev.filter(surgery => surgery.id !== surgeryId));
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteAllergy = async (allergyId) => {
    try {
      const response = await MedicalHistoryService.deleteAllergy(allergyId);
      if (response.success) {
        setAllergies(prev => prev.filter(allergy => allergy.id !== allergyId));
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    loadMedicalConditions();
    loadSurgeries();
    loadAllergies();
  }, []);

  const value = {
    medicalConditions,
    surgeries,
    allergies,
    isLoading,
    loadMedicalConditions,
    loadSurgeries,
    loadAllergies,
    addMedicalCondition,
    addSurgery,
    addAllergy,
    updateMedicalCondition,
    deleteMedicalCondition,
    deleteSurgery,
    deleteAllergy,
  };

  return (
    <MedicalHistoryContext.Provider value={value}>
      {children}
    </MedicalHistoryContext.Provider>
  );
};
```

### 3. Medical History Dashboard Component
```javascript
// components/MedicalHistoryDashboard.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useMedicalHistory } from '../context/MedicalHistoryContext';

const MedicalHistoryDashboard = () => {
  const { 
    medicalConditions, 
    surgeries, 
    allergies, 
    deleteMedicalCondition,
    deleteSurgery,
    deleteAllergy 
  } = useMedicalHistory();
  const [activeTab, setActiveTab] = useState('conditions');

  const handleDelete = async (type, id, name) => {
    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            let result;
            switch (type) {
              case 'condition':
                result = await deleteMedicalCondition(id);
                break;
              case 'surgery':
                result = await deleteSurgery(id);
                break;
              case 'allergy':
                result = await deleteAllergy(id);
                break;
            }
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const renderMedicalCondition = (condition) => (
    <View key={condition.id} style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordTitle}>{condition.name}</Text>
        <Text style={styles.recordDate}>
          {new Date(condition.diagnosedDate).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.recordStatus}>
        Status: {condition.status.charAt(0).toUpperCase() + condition.status.slice(1)}
      </Text>
      {condition.notes && (
        <Text style={styles.recordNotes}>{condition.notes}</Text>
      )}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete('condition', condition.id, condition.name)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSurgery = (surgery) => (
    <View key={surgery.id} style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordTitle}>{surgery.name}</Text>
        <Text style={styles.recordDate}>
          {new Date(surgery.date).toLocaleDateString()}
        </Text>
      </View>
      {surgery.hospital && (
        <Text style={styles.recordDetail}>Hospital: {surgery.hospital}</Text>
      )}
      {surgery.surgeon && (
        <Text style={styles.recordDetail}>Surgeon: {surgery.surgeon}</Text>
      )}
      {surgery.notes && (
        <Text style={styles.recordNotes}>{surgery.notes}</Text>
      )}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete('surgery', surgery.id, surgery.name)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAllergy = (allergy) => (
    <View key={allergy.id} style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordTitle}>{allergy.allergen}</Text>
        <Text style={[styles.severityBadge, getSeverityColor(allergy.severity)]}>
          {allergy.severity.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.recordDetail}>Reaction: {allergy.reaction}</Text>
      {allergy.notes && (
        <Text style={styles.recordNotes}>{allergy.notes}</Text>
      )}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete('allergy', allergy.id, allergy.allergen)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const getSeverityColor = (severity) => {
    const colors = {
      mild: { backgroundColor: '#4CAF50' },
      moderate: { backgroundColor: '#FF9800' },
      severe: { backgroundColor: '#f44336' },
    };
    return colors[severity] || colors.moderate;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'conditions':
        return medicalConditions.map(renderMedicalCondition);
      case 'surgeries':
        return surgeries.map(renderSurgery);
      case 'allergies':
        return allergies.map(renderAllergy);
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'conditions' && styles.activeTab]}
          onPress={() => setActiveTab('conditions')}
        >
          <Text style={[styles.tabText, activeTab === 'conditions' && styles.activeTabText]}>
            Conditions ({medicalConditions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'surgeries' && styles.activeTab]}
          onPress={() => setActiveTab('surgeries')}
        >
          <Text style={[styles.tabText, activeTab === 'surgeries' && styles.activeTabText]}>
            Surgeries ({surgeries.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'allergies' && styles.activeTab]}
          onPress={() => setActiveTab('allergies')}
        >
          <Text style={[styles.tabText, activeTab === 'allergies' && styles.activeTabText]}>
            Allergies ({allergies.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  recordStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  recordDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  recordNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f44336',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
};

export default MedicalHistoryDashboard;
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": true,
  "message": "Failed to add medical condition",
  "details": {
    "name": ["This field is required"],
    "diagnosedDate": ["Invalid date format"]
  }
}
```

#### 404 Not Found
```json
{
  "error": true,
  "message": "Medical condition not found"
}
```

#### 403 Forbidden
```json
{
  "error": true,
  "message": "You can only access your own medical history"
}
```

---

## Security Notes

1. **User Isolation**: Users can only access their own medical history
2. **Data Validation**: All input is validated on the server
3. **JWT Authentication**: Required for all operations
4. **HTTPS Only**: All API calls must use HTTPS in production
5. **Sensitive Data**: Medical history contains sensitive health information
6. **Data Retention**: Consider data retention policies for medical records

---

## Testing

Use the following test data for development:

```json
{
  "name": "Test Condition",
  "diagnosedDate": "2024-01-01",
  "status": "active",
  "notes": "Test medical condition"
}
```

**Note**: Replace with actual test data in your development environment.
