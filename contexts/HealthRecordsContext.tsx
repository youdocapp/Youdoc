import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HealthRecord {
  id: string;
  title: string;
  type: 'lab_result' | 'prescription' | 'imaging' | 'vaccination' | 'other';
  date: string;
  description?: string;
  fileUri?: string;
  fileName?: string;
  notes?: string;
}

const STORAGE_KEY = '@health_records';

export const [HealthRecordsProvider, useHealthRecords] = createContextHook(() => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading health records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecords = async (newRecords: HealthRecord[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
      setRecords(newRecords);
    } catch (error) {
      console.error('Error saving health records:', error);
    }
  };

  const addRecord = useCallback(async (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString()
    };

    const updatedRecords = [newRecord, ...records];
    await saveRecords(updatedRecords);
  }, [records]);

  const updateRecord = useCallback(async (id: string, updates: Partial<HealthRecord>) => {
    const updatedRecords = records.map(record =>
      record.id === id ? { ...record, ...updates } : record
    );
    await saveRecords(updatedRecords);
  }, [records]);

  const deleteRecord = useCallback(async (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    await saveRecords(updatedRecords);
  }, [records]);

  const getRecordsByType = useCallback((type: HealthRecord['type']) => {
    return records.filter(record => record.type === type);
  }, [records]);

  return useMemo(() => ({
    records,
    isLoading,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordsByType
  }), [records, isLoading, addRecord, updateRecord, deleteRecord, getRecordsByType]);
});
