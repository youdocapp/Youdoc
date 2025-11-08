import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { emergencyContactsService, type EmergencyContact, type CreateEmergencyContactRequest, type UpdateEmergencyContactRequest, type ApiError } from '@/lib/api'
import createContextHook from '@nkzw/create-context-hook'
import { useAuth } from './AuthContext'

export interface EmergencyContactContextType {
  contacts: EmergencyContact[]
  primaryContact: EmergencyContact | null
  stats: {
    total_contacts: number
    max_contacts: number
    remaining_slots: number
    can_add_more: boolean
  } | null
  isLoading: boolean
  error: Error | null
  
  addContact: (contact: Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at' | 'display_relationship' | 'contact_info'>) => Promise<{ success: boolean; contact?: EmergencyContact; error?: string }>
  updateContact: (id: number, updates: Partial<EmergencyContact>) => Promise<{ success: boolean; contact?: EmergencyContact; error?: string }>
  deleteContact: (id: number) => Promise<{ success: boolean; error?: string }>
  setPrimaryContact: (id: number) => Promise<{ success: boolean; contact?: EmergencyContact; error?: string }>
  bulkDeleteContacts: (ids: number[]) => Promise<{ success: boolean; deletedCount?: number; error?: string }>
  refetch: () => Promise<void>
}

export const [EmergencyContactsProvider, useEmergencyContacts] = createContextHook(() => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  // Fetch emergency contacts - only when authenticated
  const {
    data: contactsData,
    isLoading: isLoadingContacts,
    error: contactsError,
  } = useQuery({
    queryKey: ['emergency-contacts'],
    queryFn: async () => {
      const response = await emergencyContactsService.getEmergencyContacts()
      return response
    },
    staleTime: 30000,
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Fetch primary contact - only when authenticated
  const {
    data: primaryContact,
    isLoading: isLoadingPrimary,
  } = useQuery({
    queryKey: ['emergency-contacts', 'primary'],
    queryFn: () => emergencyContactsService.getPrimaryContact(),
    staleTime: 30000,
    retry: false, // Don't retry if no primary contact exists
    enabled: isAuthenticated, // Only fetch when authenticated
  })

  const contacts = contactsData?.contacts || []
  const stats = contactsData?.metadata || null
  const isLoading = isLoadingContacts || isLoadingPrimary
  const error = contactsError as Error | null

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateEmergencyContactRequest) =>
      emergencyContactsService.createEmergencyContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', 'primary'] })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmergencyContactRequest }) =>
      emergencyContactsService.updateEmergencyContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', 'primary'] })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => emergencyContactsService.deleteEmergencyContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', 'primary'] })
    },
  })

  // Set primary mutation
  const setPrimaryMutation = useMutation({
    mutationFn: (id: number) => emergencyContactsService.setPrimaryContact({ contact_id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', 'primary'] })
    },
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => emergencyContactsService.bulkDeleteContacts({ contact_ids: ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', 'primary'] })
    },
  })

  const addContact = async (contact: Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at' | 'display_relationship' | 'contact_info'>) => {
    try {
      const { name, phone_number, relationship, email, is_primary } = contact
      const data: CreateEmergencyContactRequest = {
        name,
        phone_number,
        relationship,
        email,
        is_primary,
      }
      const newContact = await createMutation.mutateAsync(data)
      return { success: true, contact: newContact }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to add emergency contact',
      }
    }
  }

  const updateContact = async (id: number, updates: Partial<EmergencyContact>) => {
    try {
      const { name, phone_number, relationship, email, is_primary } = updates
      const data: UpdateEmergencyContactRequest = {
        name,
        phone_number,
        relationship,
        email,
        is_primary,
      }
      const updatedContact = await updateMutation.mutateAsync({ id, data })
      return { success: true, contact: updatedContact }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to update emergency contact',
      }
    }
  }

  const deleteContact = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to delete emergency contact',
      }
    }
  }

  const setPrimaryContact = async (id: number) => {
    try {
      const response = await setPrimaryMutation.mutateAsync(id)
      return { success: true, contact: response.contact }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to set primary contact',
      }
    }
  }

  const bulkDeleteContacts = async (ids: number[]) => {
    try {
      const response = await bulkDeleteMutation.mutateAsync(ids)
      return { success: true, deletedCount: response.deleted_count }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to delete contacts',
      }
    }
  }

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] }),
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', 'primary'] }),
    ])
  }

  return {
    contacts,
    primaryContact: primaryContact || null,
    stats,
    isLoading,
    error,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
    bulkDeleteContacts,
    refetch,
  }
})
