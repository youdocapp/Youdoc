import { apiClient } from './client'

export interface EmergencyContact {
  id: number
  name: string
  relationship?: string
  display_relationship?: string
  phone_number: string
  email?: string
  is_primary: boolean
  contact_info?: string
  created_at: string
  updated_at?: string
}

export interface CreateEmergencyContactRequest {
  name: string
  phone_number: string
  relationship?: string
  email?: string
  is_primary?: boolean
}

export interface UpdateEmergencyContactRequest extends Partial<CreateEmergencyContactRequest> {}

export interface EmergencyContactsListResponse {
  contacts: EmergencyContact[]
  metadata: {
    total_contacts: number
    max_contacts: number
    remaining_slots: number
    can_add_more: boolean
  }
}

export interface SetPrimaryContactRequest {
  contact_id: number
}

export interface SetPrimaryContactResponse {
  message: string
  contact: EmergencyContact
}

export interface ContactStatsResponse {
  total_contacts: number
  max_contacts: number
  remaining_slots: number
  has_primary: boolean
  primary_contact_name?: string
}

export interface BulkDeleteRequest {
  contact_ids: number[]
}

export interface BulkDeleteResponse {
  message: string
  deleted_contacts: string[]
  deleted_count: number
}

export class EmergencyContactsService {
  async getEmergencyContacts(): Promise<EmergencyContactsListResponse> {
    return apiClient.get<EmergencyContactsListResponse>('/emergency-contacts/')
  }

  async getEmergencyContact(id: number): Promise<EmergencyContact> {
    return apiClient.get<EmergencyContact>(`/emergency-contacts/${id}/`)
  }

  async createEmergencyContact(data: CreateEmergencyContactRequest): Promise<EmergencyContact> {
    return apiClient.post<EmergencyContact>('/emergency-contacts/', data)
  }

  async updateEmergencyContact(id: number, data: UpdateEmergencyContactRequest): Promise<EmergencyContact> {
    return apiClient.patch<EmergencyContact>(`/emergency-contacts/${id}/`, data)
  }

  async deleteEmergencyContact(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/emergency-contacts/${id}/`)
  }

  async setPrimaryContact(data: SetPrimaryContactRequest): Promise<SetPrimaryContactResponse> {
    return apiClient.post<SetPrimaryContactResponse>('/emergency-contacts/set-primary/', data)
  }

  async getPrimaryContact(): Promise<EmergencyContact> {
    return apiClient.get<EmergencyContact>('/emergency-contacts/primary/')
  }

  async getContactStats(): Promise<ContactStatsResponse> {
    return apiClient.get<ContactStatsResponse>('/emergency-contacts/stats/')
  }

  async bulkDeleteContacts(data: BulkDeleteRequest): Promise<BulkDeleteResponse> {
    return apiClient.post<BulkDeleteResponse>('/emergency-contacts/bulk-delete/', data)
  }
}

export const emergencyContactsService = new EmergencyContactsService()

