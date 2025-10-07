import React, { createContext, useContext, useState, useMemo } from 'react';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  reminderEnabled: boolean;
  taken: boolean;
  dateAdded: string;
  startDateObj: Date;
  endDateObj?: Date;
}

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  getMedication: (id: string) => Medication | undefined;
  toggleMedicationTaken: (id: string) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const startDate = medication.startDateObj;
    const endDate = medication.endDateObj || medication.startDateObj;
    
    const newMedications: Medication[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const newMedication: Medication = {
        ...medication,
        id: `${Date.now()}-${dateString}`,
        dateAdded: dateString,
      };
      newMedications.push(newMedication);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setMedications(prev => [...prev, ...newMedications]);
  };

  const updateMedication = (id: string, updatedData: Partial<Medication>) => {
    setMedications(prev =>
      prev.map(med => (med.id === id ? { ...med, ...updatedData } : med))
    );
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const getMedication = (id: string) => {
    return medications.find(med => med.id === id);
  };

  const toggleMedicationTaken = (id: string) => {
    setMedications(prev =>
      prev.map(med => (med.id === id ? { ...med, taken: !med.taken } : med))
    );
  };

  const value = useMemo(
    () => ({
      medications,
      addMedication,
      updateMedication,
      deleteMedication,
      getMedication,
      toggleMedicationTaken,
    }),
    [medications, addMedication, updateMedication, deleteMedication, getMedication, toggleMedicationTaken]
  );

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within MedicationProvider');
  }
  return context;
};
