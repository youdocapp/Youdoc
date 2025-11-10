import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { medicationService, notificationsService, type Medication, type CreateMedicationRequest, type UpdateMedicationRequest, type TodayMedication, type MedicationCalendarResponse, type ApiError } from '@/lib/api'
import createContextHook from '@nkzw/create-context-hook'
import { useAuth } from './AuthContext'

export interface MedicationContextType {
  medications: Medication[]
  todayMedications: TodayMedication[]
  isLoading: boolean
  error: Error | null
  
  // CRUD operations
  createMedication: (data: CreateMedicationRequest) => Promise<{ success: boolean; medication?: Medication; error?: string }>
  updateMedication: (id: string, data: UpdateMedicationRequest) => Promise<{ success: boolean; medication?: Medication; error?: string }>
  deleteMedication: (id: string) => Promise<{ success: boolean; error?: string }>
  getMedication: (id: string) => Medication | undefined
  
  // Medication tracking
  toggleMedicationTaken: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Data fetching
  refetchMedications: () => Promise<void>
  refetchTodayMedications: () => Promise<void>
  getMedicationCalendar: (month?: number, year?: number) => Promise<MedicationCalendarResponse>
}

export const [MedicationProvider, useMedication] = createContextHook(() => {
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

  // Fetch medications - only when authenticated, auth initialized, and token exists
  const {
    data: medications = [],
    isLoading: isLoadingMedications,
    error: medicationsError,
    refetch: refetchMedications,
  } = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationService.getMedications(),
    staleTime: 30000, // 30 seconds
    enabled: isAuthenticated && !authLoading && hasToken, // Only fetch when authenticated, auth initialized, and token exists
    retry: false, // Don't retry on error
  })

  // Fetch today's medications - only when authenticated, auth initialized, and token exists
  const {
    data: todayMedications = [],
    isLoading: isLoadingToday,
    error: todayError,
    refetch: refetchTodayMedications,
  } = useQuery({
    queryKey: ['medications', 'today'],
    queryFn: () => medicationService.getTodayMedications(),
    staleTime: 60000, // 1 minute
    refetchInterval: isAuthenticated && hasToken ? 300000 : false, // Only refetch when authenticated and token exists
    enabled: isAuthenticated && !authLoading && hasToken, // Only fetch when authenticated, auth initialized, and token exists
    retry: false, // Don't retry on 404
  })

  // Create medication mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateMedicationRequest) => medicationService.createMedication(data),
    onSuccess: () => {
      // Invalidate queries to refetch, but don't throw errors if refetch fails
      queryClient.invalidateQueries({ queryKey: ['medications'] }).catch(() => {
        // Silently handle refetch errors - medication was already created
      })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] }).catch(() => {
        // Silently handle refetch errors - medication was already created
      })
    },
  })

  // Update medication mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicationRequest }) =>
      medicationService.updateMedication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] })
    },
  })

  // Delete medication mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => medicationService.deleteMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] })
    },
  })

  // Toggle medication taken mutation
  const toggleTakenMutation = useMutation({
    mutationFn: (id: string) => medicationService.toggleMedicationTaken(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'calendar'] })
    },
  })

  const createMedication = async (data: CreateMedicationRequest) => {
    try {
      // Verify token exists before making request
      const token = await AsyncStorage.getItem('accessToken')
      if (!token) {
        console.error('❌ No token found when creating medication')
        return {
          success: false,
          error: 'Authentication credentials were not provided. Please log in again.',
        }
      }
      console.log('✅ Token verified before creating medication:', token.substring(0, 20) + '...')
      
      const medication = await createMutation.mutateAsync(data)
      
      // If we got here, the medication was created successfully
      // Even if refetch fails, the creation was successful
      return { success: true, medication }
    } catch (error: any) {
      console.error('❌ Error creating medication:', error)
      const apiError = error as ApiError
      
      // Check if the error is about authentication on a refetch (not the POST itself)
      // If the medication was actually created, we should still return success
      const errorMessage = apiError.message || 'Failed to create medication'
      const isAuthError = errorMessage.toLowerCase().includes('authentication') || 
                         errorMessage.toLowerCase().includes('credentials')
      
      // If it's an auth error, it might be from a refetch, not the POST
      // In that case, we should still check if the medication was created
      // For now, we'll return the error but log it as potentially a refetch issue
      if (isAuthError) {
        console.warn('⚠️ Auth error after medication creation - might be from refetch, not POST')
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const updateMedication = async (id: string, data: UpdateMedicationRequest) => {
    try {
      const medication = await updateMutation.mutateAsync({ id, data })
      return { success: true, medication }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to update medication',
      }
    }
  }

  const deleteMedication = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to delete medication',
      }
    }
  }

  const getMedication = (id: string) => {
    return medications.find(med => med.id === id)
  }

  const toggleMedicationTaken = async (id: string) => {
    try {
      // Get medication details before toggling
      const medication = getMedication(id) || todayMedications.find(med => med.id === id)
      const wasTaken = medication && ('taken' in medication ? medication.taken : false)
      
      // Toggle medication taken status
      await toggleTakenMutation.mutateAsync(id)
      
      // Create a notification only when medication is marked as taken (not when untaken)
      if (isAuthenticated && hasToken && medication && !wasTaken) {
        try {
          const medicationName = medication.name || 'Medication'
          const medicationDosage = 'dosage' in medication ? medication.dosage : medication.dosage_display || ''
          
          await notificationsService.createNotification({
            type: 'medication',
            title: 'Medication Taken',
            message: `You marked ${medicationName}${medicationDosage ? ` (${medicationDosage})` : ''} as taken`,
            metadata: {
              medication_id: id,
              medication_name: medicationName,
              action: 'marked_taken',
            },
          })
          
          // Invalidate notifications to show the new one
          queryClient.invalidateQueries({ queryKey: ['notifications'] })
          console.log('✅ Notification created for medication taken:', medicationName)
        } catch (notificationError) {
          // Don't fail the medication toggle if notification creation fails
          console.warn('⚠️ Failed to create notification for medication taken:', notificationError)
        }
      }
      
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to toggle medication taken status',
      }
    }
  }

  const getMedicationCalendar = async (month?: number, year?: number) => {
    try {
      return await medicationService.getMedicationCalendar(month, year)
    } catch (error: any) {
      console.error('Failed to fetch medication calendar:', error)
      return {}
    }
  }

  return {
    medications,
    todayMedications,
    isLoading: isLoadingMedications || isLoadingToday,
    error: (medicationsError || todayError) as Error | null,
    createMedication,
    updateMedication,
    deleteMedication,
    getMedication,
    toggleMedicationTaken,
    refetchMedications: async () => {
      await refetchMedications()
    },
    refetchTodayMedications: async () => {
      await refetchTodayMedications()
    },
    getMedicationCalendar,
  }
})
