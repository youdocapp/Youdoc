import { apiClient } from './client'

export interface HealthRecord {
  id: string
  title: string
  type: 'lab_result' | 'prescription' | 'imaging' | 'vaccination' | 'other'
  date: string
  description?: string
  file_uri?: string
  file_name?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateHealthRecordRequest {
  title: string
  type: 'lab_result' | 'prescription' | 'imaging' | 'vaccination' | 'other'
  date: string
  description?: string
  file?: any // File object for FormData
  notes?: string
}

export interface UpdateHealthRecordRequest extends Partial<CreateHealthRecordRequest> {}

export class HealthRecordsService {
  async getHealthRecords(filters?: {
    type?: string
    date_from?: string
    date_to?: string
    has_file?: boolean
    search?: string
    ordering?: string
  }): Promise<HealthRecord[]> {
    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)
    if (filters?.has_file !== undefined) params.append('has_file', String(filters.has_file))
    if (filters?.search) params.append('search', filters.search)
    if (filters?.ordering) params.append('ordering', filters.ordering)
    
    const query = params.toString()
    return apiClient.get<HealthRecord[]>(`/health-records/${query ? `?${query}` : ''}`)
  }

  async getHealthRecord(id: string): Promise<HealthRecord> {
    return apiClient.get<HealthRecord>(`/health-records/${id}`)
  }

  async createHealthRecord(data: CreateHealthRecordRequest, file?: any): Promise<HealthRecord> {
    const formData = new FormData()
    
    // Add text fields
    Object.keys(data).forEach(key => {
      if (key !== 'file' && data[key as keyof CreateHealthRecordRequest] !== undefined) {
        formData.append(key, String(data[key as keyof CreateHealthRecordRequest]))
      }
    })
    
    // Add file if provided
    if (file) {
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || 'file.jpg',
      } as any)
    }
    
    return apiClient.post<HealthRecord>('/health-records/', formData, true, true)
  }

  async updateHealthRecord(id: string, data: UpdateHealthRecordRequest, file?: any): Promise<HealthRecord> {
    const formData = new FormData()
    
    // Add text fields
    Object.keys(data).forEach(key => {
      if (key !== 'file' && data[key as keyof UpdateHealthRecordRequest] !== undefined) {
        formData.append(key, String(data[key as keyof UpdateHealthRecordRequest]))
      }
    })
    
    // Add file if provided
    if (file) {
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || 'file.jpg',
      } as any)
    }
    
    return apiClient.patch<HealthRecord>(`/health-records/${id}`, formData, true, true)
  }

  async deleteHealthRecord(id: string): Promise<void> {
    return apiClient.delete<void>(`/health-records/${id}`)
  }
}

export const healthRecordsService = new HealthRecordsService()

