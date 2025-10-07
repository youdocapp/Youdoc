import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  isPrimary: boolean;
}

const STORAGE_KEY = '@emergency_contacts';
const MAX_CONTACTS = 28;

export const [EmergencyContactsProvider, useEmergencyContacts] = createContextHook(() => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setContacts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContacts = async (newContacts: EmergencyContact[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
      setContacts(newContacts);
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
    }
  };

  const addContact = useCallback(async (contact: Omit<EmergencyContact, 'id'>) => {
    if (contacts.length >= MAX_CONTACTS) {
      throw new Error(`Maximum of ${MAX_CONTACTS} contacts allowed`);
    }

    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString()
    };

    const updatedContacts = [...contacts, newContact];
    await saveContacts(updatedContacts);
  }, [contacts]);

  const updateContact = useCallback(async (id: string, updates: Partial<EmergencyContact>) => {
    const updatedContacts = contacts.map(contact =>
      contact.id === id ? { ...contact, ...updates } : contact
    );
    await saveContacts(updatedContacts);
  }, [contacts]);

  const deleteContact = useCallback(async (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    await saveContacts(updatedContacts);
  }, [contacts]);

  const setPrimaryContact = useCallback(async (id: string) => {
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    }));
    await saveContacts(updatedContacts);
  }, [contacts]);

  return useMemo(() => ({
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
    canAddMore: contacts.length < MAX_CONTACTS,
    remainingSlots: MAX_CONTACTS - contacts.length
  }), [contacts, isLoading, addContact, updateContact, deleteContact, setPrimaryContact]);
});
