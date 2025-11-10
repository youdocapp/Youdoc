import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [hasToken, setHasToken] = React.useState(false)

  // Check if token exists in AsyncStorage
  React.useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated && !authLoading) {
        const token = await AsyncStorage.getItem('accessToken')
        setHasToken(!!token)
      } else {
        setHasToken(false)
      }
    }
    checkToken()
  }, [isAuthenticated, authLoading])

  // Fetch emergency contacts - only when authenticated, auth initialized, and token exists
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
    enabled: isAuthenticated && !authLoading && hasToken, // Only fetch when authenticated, auth initialized, and token exists
    retry: false, // Don't retry on 404
  })

  // Fetch primary contact - only when authenticated, auth initialized, and token exists
  const {
    data: primaryContact,
    isLoading: isLoadingPrimary,
  } = useQuery({
    queryKey: ['emergency-contacts', 'primary'],
    queryFn: () => emergencyContactsService.getPrimaryContact(),
    staleTime: 30000,
    retry: false, // Don't retry if no primary contact exists
    enabled: isAuthenticated && !authLoading && hasToken, // Only fetch when authenticated, auth initialized, and token exists
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

  const addContact = async (contact: Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at' | 'display_relationship' | 'contact_info'> | any) => {
    try {
      // Transform camelCase to snake_case for backend
      // Note: relationship is required in the database schema (NOT NULL)
      const data: any = {
        name: contact.name?.trim(),
        phone_number: (contact.phone_number || contact.phoneNumber)?.trim(), // Support both formats
        relationship: contact.relationship?.trim() || 'Other', // Required field - default to 'Other' if not provided
      }
      
      // Only add optional fields if they have values
      if (contact.email?.trim()) {
        data.email = contact.email.trim()
      }
      if (contact.is_primary !== undefined || contact.isPrimary !== undefined) {
        data.is_primary = contact.is_primary || contact.isPrimary || false
      }
      
      console.log('📤 Creating emergency contact with data:', data)
      const newContact = await createMutation.mutateAsync(data)
      return { success: true, contact: newContact }
    } catch (error: any) {
      const apiError = error as ApiError
      console.error('❌ Error creating emergency contact:', apiError)
      return {
        success: false,
        error: apiError.message || 'Failed to add emergency contact',
      }
    }
  }

  const updateContact = async (id: number, updates: Partial<EmergencyContact> | any) => {
    try {
      // Transform camelCase to snake_case for backend
      const data: UpdateEmergencyContactRequest = {
        name: updates.name?.trim(),
        phone_number: (updates.phone_number || updates.phoneNumber)?.trim(), // Support both formats
        relationship: updates.relationship?.trim(),
        email: updates.email?.trim(),
        is_primary: updates.is_primary || updates.isPrimary,
      }
      // Remove undefined and empty fields
      Object.keys(data).forEach(key => {
        const value = data[key as keyof UpdateEmergencyContactRequest]
        if (value === undefined || value === '' || (typeof value === 'string' && !value.trim())) {
          delete data[key as keyof UpdateEmergencyContactRequest]
        }
      })
      console.log('📤 Updating emergency contact with data:', data)
      const updatedContact = await updateMutation.mutateAsync({ id, data })
      return { success: true, contact: updatedContact }
    } catch (error: any) {
      const apiError = error as ApiError
      console.error('❌ Error updating emergency contact:', apiError)
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
