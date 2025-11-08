import React, { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { medicationService, type Medication, type CreateMedicationRequest, type UpdateMedicationRequest, type TodayMedication, type MedicationCalendarResponse, type ApiError } from '@/lib/api'
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

const MedicationContext = createContext<MedicationContextType | undefined>(undefined)

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  // Fetch medications - only when authenticated
  const {
    data: medications = [],
    isLoading: isLoadingMedications,
    error: medicationsError,
    refetch: refetchMedications,
  } = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationService.getMedications(),
    staleTime: 30000, // 30 seconds
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on error
  })

  // Fetch today's medications - only when authenticated
  const {
    data: todayMedications = [],
    isLoading: isLoadingToday,
    error: todayError,
    refetch: refetchTodayMedications,
  } = useQuery({
    queryKey: ['medications', 'today'],
    queryFn: () => medicationService.getTodayMedications(),
    staleTime: 60000, // 1 minute
    refetchInterval: isAuthenticated ? 300000 : false, // Only refetch when authenticated
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Create medication mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateMedicationRequest) => medicationService.createMedication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] })
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
      const medication = await createMutation.mutateAsync(data)
      return { success: true, medication }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to create medication',
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
      await toggleTakenMutation.mutateAsync(id)
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

  const value: MedicationContextType = {
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

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  )
}

export const useMedication = () => {
  const context = useContext(MedicationContext)
  if (!context) {
    throw new Error('useMedication must be used within MedicationProvider')
  }
  return context
}
