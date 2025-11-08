import { apiClient } from './client'

export interface MedicalCondition {
  id: string
  name: string
  diagnosedDate: string
  status: 'active' | 'resolved' | 'chronic'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Surgery {
  id: string
  name: string
  date: string
  hospital?: string
  surgeon?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Allergy {
  id: string
  allergen: string
  reaction: string
  severity: 'mild' | 'moderate' | 'severe'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateConditionRequest {
  name: string
  diagnosedDate: string
  status?: 'active' | 'resolved' | 'chronic'
  notes?: string
}

export interface CreateSurgeryRequest {
  name: string
  date: string
  hospital?: string
  surgeon?: string
  notes?: string
}

export interface CreateAllergyRequest {
  allergen: string
  reaction: string
  severity?: 'mild' | 'moderate' | 'severe'
  notes?: string
}

export interface MedicalHistoryListResponse<T> {
  success: boolean
  data: T[]
  count: number
}

export interface MedicalHistoryResponse<T> {
  success: boolean
  message?: string
  data: T
}

export class MedicalHistoryService {
  // Medical Conditions
  async getMedicalConditions(): Promise<MedicalHistoryListResponse<MedicalCondition>> {
    return apiClient.get<MedicalHistoryListResponse<MedicalCondition>>('/medical-history/conditions')
  }

  async getMedicalCondition(id: string): Promise<MedicalHistoryResponse<MedicalCondition>> {
    return apiClient.get<MedicalHistoryResponse<MedicalCondition>>(`/medical-history/conditions/${id}`)
  }

  async createMedicalCondition(data: CreateConditionRequest): Promise<MedicalHistoryResponse<MedicalCondition>> {
    return apiClient.post<MedicalHistoryResponse<MedicalCondition>>('/medical-history/conditions', data)
  }

  async updateMedicalCondition(id: string, data: Partial<CreateConditionRequest>): Promise<MedicalHistoryResponse<MedicalCondition>> {
    return apiClient.patch<MedicalHistoryResponse<MedicalCondition>>(`/medical-history/conditions/${id}`, data)
  }

  async deleteMedicalCondition(id: string): Promise<MedicalHistoryResponse<{ message: string }>> {
    return apiClient.delete<MedicalHistoryResponse<{ message: string }>>(`/medical-history/conditions/${id}`)
  }

  // Surgeries
  async getSurgeries(): Promise<MedicalHistoryListResponse<Surgery>> {
    return apiClient.get<MedicalHistoryListResponse<Surgery>>('/medical-history/surgeries')
  }

  async getSurgery(id: string): Promise<MedicalHistoryResponse<Surgery>> {
    return apiClient.get<MedicalHistoryResponse<Surgery>>(`/medical-history/surgeries/${id}`)
  }

  async createSurgery(data: CreateSurgeryRequest): Promise<MedicalHistoryResponse<Surgery>> {
    return apiClient.post<MedicalHistoryResponse<Surgery>>('/medical-history/surgeries', data)
  }

  async updateSurgery(id: string, data: Partial<CreateSurgeryRequest>): Promise<MedicalHistoryResponse<Surgery>> {
    return apiClient.patch<MedicalHistoryResponse<Surgery>>(`/medical-history/surgeries/${id}`, data)
  }

  async deleteSurgery(id: string): Promise<MedicalHistoryResponse<{ message: string }>> {
    return apiClient.delete<MedicalHistoryResponse<{ message: string }>>(`/medical-history/surgeries/${id}`)
  }

  // Allergies
  async getAllergies(): Promise<MedicalHistoryListResponse<Allergy>> {
    return apiClient.get<MedicalHistoryListResponse<Allergy>>('/medical-history/allergies')
  }

  async getAllergy(id: string): Promise<MedicalHistoryResponse<Allergy>> {
    return apiClient.get<MedicalHistoryResponse<Allergy>>(`/medical-history/allergies/${id}`)
  }

  async createAllergy(data: CreateAllergyRequest): Promise<MedicalHistoryResponse<Allergy>> {
    return apiClient.post<MedicalHistoryResponse<Allergy>>('/medical-history/allergies', data)
  }

  async updateAllergy(id: string, data: Partial<CreateAllergyRequest>): Promise<MedicalHistoryResponse<Allergy>> {
    return apiClient.patch<MedicalHistoryResponse<Allergy>>(`/medical-history/allergies/${id}`, data)
  }

  async deleteAllergy(id: string): Promise<MedicalHistoryResponse<{ message: string }>> {
    return apiClient.delete<MedicalHistoryResponse<{ message: string }>>(`/medical-history/allergies/${id}`)
  }
}

export const medicalHistoryService = new MedicalHistoryService()

