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

export interface UpdateMedicationRequest extends Partial<Omit<CreateMedicationRequest, 'reminder_times'>> {
  time?: string[] // Backend expects 'time' field, not 'reminder_times'
  reminder_times?: string[] // Keep for backward compatibility
}

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
    const url = query ? `/medications/?${query}` : '/medications/'
    const response = await apiClient.get<{ count: number; next: string | null; previous: string | null; results: Medication[] } | Medication[]>(url)
    
    console.log('📋 getMedications response:', {
      isArray: Array.isArray(response),
      hasResults: response && typeof response === 'object' && 'results' in response,
      responseType: typeof response,
      responseKeys: response && typeof response === 'object' ? Object.keys(response) : [],
      count: response && typeof response === 'object' && 'count' in response ? (response as { count: number }).count : null,
      resultsLength: response && typeof response === 'object' && 'results' in response ? (response as { results: Medication[] }).results?.length : null
    })
    
    // Handle paginated response (DRF returns {count, next, previous, results})
    // or direct array response
    if (Array.isArray(response)) {
      console.log('📋 Returning array response, length:', response.length)
      return response
    } else if (response && typeof response === 'object' && 'results' in response) {
      const results = (response as { results: Medication[] }).results || []
      console.log('📋 Returning paginated response results, length:', results.length)
      return results
    }
    console.warn('📋 No valid response format, returning empty array')
    return []
  }

  async getMedication(id: string): Promise<Medication> {
    return apiClient.get<Medication>(`/medications/${id}/`)
  }

  async createMedication(data: CreateMedicationRequest): Promise<Medication> {
    return apiClient.post<Medication>('/medications/', data)
  }

  async updateMedication(id: string, data: UpdateMedicationRequest): Promise<Medication> {
    const url = `/medications/${id}/`
    console.log('🔄 updateMedication URL:', url)
    
    // Convert reminder_times to time field if provided, and convert to 24-hour format
    const updateData: any = { ...data }
    
    // If reminder_times is provided, convert it to time field with 24-hour format
    if (updateData.reminder_times && Array.isArray(updateData.reminder_times)) {
      updateData.time = updateData.reminder_times.map((time: string) => {
        // If already in 24-hour format (HH:MM), return as is
        if (!time.includes('AM') && !time.includes('PM')) {
          return time
        }
        // Convert from 12-hour format (H:MM AM/PM) to 24-hour format (HH:MM)
        const [timePart, period] = time.split(' ')
        if (!timePart || !period) return time
        
        const [hours, minutes] = timePart.split(':')
        if (!hours || !minutes) return time
        
        let hour24 = parseInt(hours, 10)
        const mins = minutes || '00'
        
        if (period === 'PM' && hour24 !== 12) {
          hour24 += 12
        } else if (period === 'AM' && hour24 === 12) {
          hour24 = 0
        }
        
        return `${hour24.toString().padStart(2, '0')}:${mins.padStart(2, '0')}`
      })
      delete updateData.reminder_times
    }
    
    // If time is provided directly, ensure it's in 24-hour format
    if (updateData.time && Array.isArray(updateData.time)) {
      updateData.time = updateData.time.map((time: string) => {
        // If already in 24-hour format (HH:MM), return as is
        if (!time.includes('AM') && !time.includes('PM')) {
          return time
        }
        // Convert from 12-hour format (H:MM AM/PM) to 24-hour format (HH:MM)
        const [timePart, period] = time.split(' ')
        if (!timePart || !period) return time
        
        const [hours, minutes] = timePart.split(':')
        if (!hours || !minutes) return time
        
        let hour24 = parseInt(hours, 10)
        const mins = minutes || '00'
        
        if (period === 'PM' && hour24 !== 12) {
          hour24 += 12
        } else if (period === 'AM' && hour24 === 12) {
          hour24 = 0
        }
        
        return `${hour24.toString().padStart(2, '0')}:${mins.padStart(2, '0')}`
      })
    }
    
    console.log('🔄 updateMedication data (after conversion):', updateData)
    return apiClient.patch<Medication>(url, updateData)
  }

  async deleteMedication(id: string): Promise<void> {
    const url = `/medications/${id}/`
    console.log('🔄 deleteMedication URL:', url)
    return apiClient.delete<void>(url)
  }

  async toggleMedicationTaken(medicationId: string): Promise<TakenRecord> {
    const url = `/medications/${medicationId}/toggle-taken/`
    console.log('🔄 toggleMedicationTaken URL:', url)
    return apiClient.post<TakenRecord>(url)
  }

  async getTodayMedications(): Promise<TodayMedication[]> {
    const url = '/medications/today/'
    console.log('🔄 getTodayMedications URL:', url)
    return apiClient.get<TodayMedication[]>(url)
  }

  async getMedicationCalendar(month?: number, year?: number): Promise<MedicationCalendarResponse> {
    const params = new URLSearchParams()
    if (month) params.append('month', String(month))
    if (year) params.append('year', String(year))
    
    const query = params.toString()
    const url = query ? `/medications/calendar/?${query}` : '/medications/calendar/'
    console.log('🔄 getMedicationCalendar URL:', url)
    return apiClient.get<MedicationCalendarResponse>(url)
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
    const url = query ? `/medications/taken/?${query}` : '/medications/taken/'
    console.log('🔄 getTakenRecords URL:', url)
    return apiClient.get<TakenRecord[]>(url)
  }

  async createTakenRecord(data: {
    medication: string
    date: string
    taken: boolean
  }): Promise<TakenRecord> {
    const url = '/medications/taken/'
    console.log('🔄 createTakenRecord URL:', url)
    return apiClient.post<TakenRecord>(url, data)
  }
}

export const medicationService = new MedicationService()

