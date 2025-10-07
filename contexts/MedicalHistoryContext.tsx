import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface Surgery {
  id: string;
  name: string;
  date: string;
  hospital?: string;
  surgeon?: string;
  notes?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

interface MedicalHistoryData {
  conditions: MedicalCondition[];
  surgeries: Surgery[];
  allergies: Allergy[];
}

const STORAGE_KEY = '@medical_history';

export const [MedicalHistoryProvider, useMedicalHistory] = createContextHook(() => {
  const [data, setData] = useState<MedicalHistoryData>({
    conditions: [],
    surgeries: [],
    allergies: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading medical history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newData: MedicalHistoryData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving medical history:', error);
    }
  };

  const addCondition = useCallback(async (condition: Omit<MedicalCondition, 'id'>) => {
    const newCondition: MedicalCondition = {
      ...condition,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data,
      conditions: [...data.conditions, newCondition]
    };
    await saveData(updatedData);
  }, [data]);

  const updateCondition = useCallback(async (id: string, updates: Partial<MedicalCondition>) => {
    const updatedData = {
      ...data,
      conditions: data.conditions.map(c => c.id === id ? { ...c, ...updates } : c)
    };
    await saveData(updatedData);
  }, [data]);

  const deleteCondition = useCallback(async (id: string) => {
    const updatedData = {
      ...data,
      conditions: data.conditions.filter(c => c.id !== id)
    };
    await saveData(updatedData);
  }, [data]);

  const addSurgery = useCallback(async (surgery: Omit<Surgery, 'id'>) => {
    const newSurgery: Surgery = {
      ...surgery,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data,
      surgeries: [...data.surgeries, newSurgery]
    };
    await saveData(updatedData);
  }, [data]);

  const updateSurgery = useCallback(async (id: string, updates: Partial<Surgery>) => {
    const updatedData = {
      ...data,
      surgeries: data.surgeries.map(s => s.id === id ? { ...s, ...updates } : s)
    };
    await saveData(updatedData);
  }, [data]);

  const deleteSurgery = useCallback(async (id: string) => {
    const updatedData = {
      ...data,
      surgeries: data.surgeries.filter(s => s.id !== id)
    };
    await saveData(updatedData);
  }, [data]);

  const addAllergy = useCallback(async (allergy: Omit<Allergy, 'id'>) => {
    const newAllergy: Allergy = {
      ...allergy,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data,
      allergies: [...data.allergies, newAllergy]
    };
    await saveData(updatedData);
  }, [data]);

  const updateAllergy = useCallback(async (id: string, updates: Partial<Allergy>) => {
    const updatedData = {
      ...data,
      allergies: data.allergies.map(a => a.id === id ? { ...a, ...updates } : a)
    };
    await saveData(updatedData);
  }, [data]);

  const deleteAllergy = useCallback(async (id: string) => {
    const updatedData = {
      ...data,
      allergies: data.allergies.filter(a => a.id !== id)
    };
    await saveData(updatedData);
  }, [data]);

  return useMemo(() => ({
    conditions: data.conditions,
    surgeries: data.surgeries,
    allergies: data.allergies,
    isLoading,
    addCondition,
    updateCondition,
    deleteCondition,
    addSurgery,
    updateSurgery,
    deleteSurgery,
    addAllergy,
    updateAllergy,
    deleteAllergy
  }), [
    data,
    isLoading,
    addCondition,
    updateCondition,
    deleteCondition,
    addSurgery,
    updateSurgery,
    deleteSurgery,
    addAllergy,
    updateAllergy,
    deleteAllergy
  ]);
});
