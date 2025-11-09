import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { medicalHistoryService, type MedicalCondition, type Surgery, type Allergy, type CreateConditionRequest, type CreateSurgeryRequest, type CreateAllergyRequest, type ApiError } from '@/lib/api'
import createContextHook from '@nkzw/create-context-hook'
import { useAuth } from './AuthContext'

export interface MedicalHistoryContextType {
  conditions: MedicalCondition[]
  surgeries: Surgery[]
  allergies: Allergy[]
  isLoading: boolean
  error: Error | null
  
  // Conditions
  addCondition: (condition: Omit<MedicalCondition, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; condition?: MedicalCondition; error?: string }>
  updateCondition: (id: string, updates: Partial<MedicalCondition>) => Promise<{ success: boolean; condition?: MedicalCondition; error?: string }>
  deleteCondition: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Surgeries
  addSurgery: (surgery: Omit<Surgery, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; surgery?: Surgery; error?: string }>
  updateSurgery: (id: string, updates: Partial<Surgery>) => Promise<{ success: boolean; surgery?: Surgery; error?: string }>
  deleteSurgery: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Allergies
  addAllergy: (allergy: Omit<Allergy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; allergy?: Allergy; error?: string }>
  updateAllergy: (id: string, updates: Partial<Allergy>) => Promise<{ success: boolean; allergy?: Allergy; error?: string }>
  deleteAllergy: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Refetch
  refetch: () => Promise<void>
}

export const [MedicalHistoryProvider, useMedicalHistory] = createContextHook(() => {
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

  // Fetch medical conditions - only when authenticated, auth initialized, and token exists
  const {
    data: conditionsData,
    isLoading: isLoadingConditions,
    error: conditionsError,
  } = useQuery({
    queryKey: ['medical-history', 'conditions'],
    queryFn: async () => {
      const response = await medicalHistoryService.getMedicalConditions()
      return response.data || []
    },
    staleTime: 30000,
    enabled: isAuthenticated && !authLoading && hasToken, // Only fetch when authenticated, auth initialized, and token exists
    retry: false, // Don't retry on 404
  })

  // Fetch surgeries - only when authenticated, auth initialized, and token exists
  const {
    data: surgeriesData,
    isLoading: isLoadingSurgeries,
    error: surgeriesError,
  } = useQuery({
    queryKey: ['medical-history', 'surgeries'],
    queryFn: async () => {
      const response = await medicalHistoryService.getSurgeries()
      return response.data || []
    },
    staleTime: 30000,
    enabled: isAuthenticated && !authLoading && hasToken, // Only fetch when authenticated, auth initialized, and token exists
    retry: false, // Don't retry on 404
  })

  // Fetch allergies - only when authenticated, auth initialized, and token exists
  const {
    data: allergiesData,
    isLoading: isLoadingAllergies,
    error: allergiesError,
  } = useQuery({
    queryKey: ['medical-history', 'allergies'],
    queryFn: async () => {
      const response = await medicalHistoryService.getAllergies()
      return response.data || []
    },
    staleTime: 30000,
    enabled: isAuthenticated && !authLoading && hasToken, // Only fetch when authenticated, auth initialized, and token exists
    retry: false, // Don't retry on 404
  })

  const conditions = conditionsData || []
  const surgeries = surgeriesData || []
  const allergies = allergiesData || []
  const isLoading = isLoadingConditions || isLoadingSurgeries || isLoadingAllergies
  const error = (conditionsError || surgeriesError || allergiesError) as Error | null

  // Condition mutations
  const createConditionMutation = useMutation({
    mutationFn: (data: CreateConditionRequest) => medicalHistoryService.createMedicalCondition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'conditions'] })
    },
  })

  const updateConditionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateConditionRequest> }) =>
      medicalHistoryService.updateMedicalCondition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'conditions'] })
    },
  })

  const deleteConditionMutation = useMutation({
    mutationFn: (id: string) => medicalHistoryService.deleteMedicalCondition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'conditions'] })
    },
  })

  // Surgery mutations
  const createSurgeryMutation = useMutation({
    mutationFn: (data: CreateSurgeryRequest) => medicalHistoryService.createSurgery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'surgeries'] })
    },
  })

  const updateSurgeryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSurgeryRequest> }) =>
      medicalHistoryService.updateSurgery(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'surgeries'] })
    },
  })

  const deleteSurgeryMutation = useMutation({
    mutationFn: (id: string) => medicalHistoryService.deleteSurgery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'surgeries'] })
    },
  })

  // Allergy mutations
  const createAllergyMutation = useMutation({
    mutationFn: (data: CreateAllergyRequest) => medicalHistoryService.createAllergy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'allergies'] })
    },
  })

  const updateAllergyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAllergyRequest> }) =>
      medicalHistoryService.updateAllergy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'allergies'] })
    },
  })

  const deleteAllergyMutation = useMutation({
    mutationFn: (id: string) => medicalHistoryService.deleteAllergy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'allergies'] })
    },
  })

  const addCondition = async (condition: Omit<MedicalCondition, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { name, diagnosedDate, status, notes } = condition
      const data: CreateConditionRequest = { name, diagnosedDate, status, notes }
      const response = await createConditionMutation.mutateAsync(data)
      return { success: true, condition: response.data }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to add condition' }
    }
  }

  const updateCondition = async (id: string, updates: Partial<MedicalCondition>) => {
    try {
      const { name, diagnosedDate, status, notes } = updates
      const data: Partial<CreateConditionRequest> = { name, diagnosedDate, status, notes }
      const response = await updateConditionMutation.mutateAsync({ id, data })
      return { success: true, condition: response.data }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to update condition' }
    }
  }

  const deleteCondition = async (id: string) => {
    try {
      await deleteConditionMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to delete condition' }
    }
  }

  const addSurgery = async (surgery: Omit<Surgery, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { name, date, hospital, surgeon, notes } = surgery
      const data: CreateSurgeryRequest = { name, date, hospital, surgeon, notes }
      const response = await createSurgeryMutation.mutateAsync(data)
      return { success: true, surgery: response.data }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to add surgery' }
    }
  }

  const updateSurgery = async (id: string, updates: Partial<Surgery>) => {
    try {
      const { name, date, hospital, surgeon, notes } = updates
      const data: Partial<CreateSurgeryRequest> = { name, date, hospital, surgeon, notes }
      const response = await updateSurgeryMutation.mutateAsync({ id, data })
      return { success: true, surgery: response.data }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to update surgery' }
    }
  }

  const deleteSurgery = async (id: string) => {
    try {
      await deleteSurgeryMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to delete surgery' }
    }
  }

  const addAllergy = async (allergy: Omit<Allergy, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { allergen, reaction, severity, notes } = allergy
      const data: CreateAllergyRequest = { allergen, reaction, severity, notes }
      const response = await createAllergyMutation.mutateAsync(data)
      return { success: true, allergy: response.data }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to add allergy' }
    }
  }

  const updateAllergy = async (id: string, updates: Partial<Allergy>) => {
    try {
      const { allergen, reaction, severity, notes } = updates
      const data: Partial<CreateAllergyRequest> = { allergen, reaction, severity, notes }
      const response = await updateAllergyMutation.mutateAsync({ id, data })
      return { success: true, allergy: response.data }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to update allergy' }
    }
  }

  const deleteAllergy = async (id: string) => {
    try {
      await deleteAllergyMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return { success: false, error: apiError.message || 'Failed to delete allergy' }
    }
  }

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'conditions'] }),
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'surgeries'] }),
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'allergies'] }),
    ])
  }

  return {
    conditions,
    surgeries,
    allergies,
    isLoading,
    error,
    addCondition,
    updateCondition,
    deleteCondition,
    addSurgery,
    updateSurgery,
    deleteSurgery,
    addAllergy,
    updateAllergy,
    deleteAllergy,
    refetch,
  }
})
