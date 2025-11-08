import { apiClient } from './client'

export interface Medication {
  id: string
  name: string
  medication_type: string
  dosage_display: string
  dosage_amount: number
  dosage_unit: string
  frequency: string
  start_date: string
  end_date?: string
  notes?: string
  reminder_enabled: boolean
  is_active: boolean
  is_current: boolean
  time: string[]
  startDate: string
  endDate?: string
  reminderEnabled: boolean
  dateAdded: string
  taken: boolean
  created_at: string
  updated_at: string
  reminder_times?: ReminderTime[]
  taken_records?: TakenRecord[]
}

export interface ReminderTime {
  id: string
  time: string
  time_display: string
  is_active: boolean
  created_at: string
}

export interface TakenRecord {
  id: string
  date: string
  taken: boolean
  created_at: string
  updated_at: string
}

export interface CreateMedicationRequest {
  name: string
  medication_type: 'Pill' | 'Injection' | 'Drops' | 'Inhaler' | 'Cream' | 'Spray'
  dosage_amount: number
  dosage_unit: string
  frequency: 'Daily' | 'Weekly' | 'As needed'
  start_date: string
  end_date?: string
  notes?: string
  reminder_enabled?: boolean
  reminder_times?: string[]
}

export interface UpdateMedicationRequest extends Partial<CreateMedicationRequest> {}

export interface MedicationCalendarResponse {
  [date: string]: Medication[]
}

export interface TodayMedication {
  id: string
  name: string
  dosage: string
  time: string[]
  taken: boolean
  medication_type: string
  notes?: string
}

export class MedicationService {
  async getMedications(filters?: {
    date?: string
    start_date?: string
    end_date?: string
    is_active?: boolean
  }): Promise<Medication[]> {
    const params = new URLSearchParams()
    if (filters?.date) params.append('date', filters.date)
    if (filters?.start_date) params.append('start_date', filters.start_date)
    if (filters?.end_date) params.append('end_date', filters.end_date)
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active))
    
    const query = params.toString()
    return apiClient.get<Medication[]>(`/medications/${query ? `?${query}` : ''}`)
  }

  async getMedication(id: string): Promise<Medication> {
    return apiClient.get<Medication>(`/medications/${id}`)
  }

  async createMedication(data: CreateMedicationRequest): Promise<Medication> {
    return apiClient.post<Medication>('/medications', data)
  }

  async updateMedication(id: string, data: UpdateMedicationRequest): Promise<Medication> {
    return apiClient.patch<Medication>(`/medications/${id}`, data)
  }

  async deleteMedication(id: string): Promise<void> {
    return apiClient.delete<void>(`/medications/${id}`)
  }

  async toggleMedicationTaken(medicationId: string): Promise<TakenRecord> {
    return apiClient.post<TakenRecord>(`/medications/${medicationId}/toggle-taken`)
  }

  async getTodayMedications(): Promise<TodayMedication[]> {
    return apiClient.get<TodayMedication[]>('/medications/today')
  }

  async getMedicationCalendar(month?: number, year?: number): Promise<MedicationCalendarResponse> {
    const params = new URLSearchParams()
    if (month) params.append('month', String(month))
    if (year) params.append('year', String(year))
    
    const query = params.toString()
    return apiClient.get<MedicationCalendarResponse>(`/medications/calendar${query ? `?${query}` : ''}`)
  }

  async getTakenRecords(filters?: {
    medication?: string
    date?: string
    taken?: boolean
  }): Promise<TakenRecord[]> {
    const params = new URLSearchParams()
    if (filters?.medication) params.append('medication', filters.medication)
    if (filters?.date) params.append('date', filters.date)
    if (filters?.taken !== undefined) params.append('taken', String(filters.taken))
    
    const query = params.toString()
    return apiClient.get<TakenRecord[]>(`/medications/taken${query ? `?${query}` : ''}`)
  }

  async createTakenRecord(data: {
    medication: string
    date: string
    taken: boolean
  }): Promise<TakenRecord> {
    return apiClient.post<TakenRecord>('/medications/taken', data)
  }
}

export const medicationService = new MedicationService()

