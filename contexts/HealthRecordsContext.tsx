import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { healthRecordsService, type HealthRecord, type CreateHealthRecordRequest, type UpdateHealthRecordRequest, type ApiError } from '@/lib/api'
import createContextHook from '@nkzw/create-context-hook'
import { useAuth } from './AuthContext'

// TEMPORARY: Disable backend calls to test UI only
const MOCK_MODE = true

export interface HealthRecordContextType {
  records: HealthRecord[]
  isLoading: boolean
  error: Error | null
  
  addRecord: (record: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>, file?: any) => Promise<{ success: boolean; record?: HealthRecord; error?: string }>
  updateRecord: (id: string, updates: Partial<HealthRecord>, file?: any) => Promise<{ success: boolean; record?: HealthRecord; error?: string }>
  deleteRecord: (id: string) => Promise<{ success: boolean; error?: string }>
  getRecordsByType: (type: HealthRecord['type']) => HealthRecord[]
  refetch: () => Promise<void>
}

export const [HealthRecordsProvider, useHealthRecords] = createContextHook(() => {
  const queryClient = useQueryClient()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [hasToken, setHasToken] = React.useState(false)

  // Check if token exists in AsyncStorage
  React.useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated && !authLoading) {
        const token = await AsyncStorage.getItem('accessToken')
        const tokenExists = !!token
        console.log('🔍 Token check in HealthRecordsContext:', {
          isAuthenticated,
          authLoading,
          tokenExists,
          tokenLength: token?.length || 0,
          tokenPrefix: token ? token.substring(0, 20) + '...' : 'none'
        })
        setHasToken(tokenExists)
      } else {
        setHasToken(false)
      }
    }
    checkToken()
  }, [isAuthenticated, authLoading])

  // Fetch health records - only when authenticated, auth is not loading, and token exists
  const {
    data: recordsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['health-records'],
    queryFn: async () => {
      try {
        // Double-check token exists before making request
        const token = await AsyncStorage.getItem('accessToken')
        if (!token) {
          console.warn('⚠️ No token found when queryFn runs, skipping request')
          throw new Error('No authentication token available')
        }
        console.log('🔑 Token verified before GET request:', token.substring(0, 20) + '...')
        const response = await healthRecordsService.getHealthRecords()
        console.log('📥 Health Records API Response:', response)
        return response
      } catch (err) {
        console.error('❌ Error fetching health records:', err)
        throw err
      }
    },
    staleTime: 30000, // 30 seconds
    enabled: !MOCK_MODE && isAuthenticated && !authLoading && hasToken, // Disabled in mock mode
    retry: false, // Don't retry on 404
  })

  // Extract results from response - handle both direct array and paginated response
  const records = Array.isArray(recordsData)
    ? recordsData
    : (recordsData?.results || [])
  
  // Debug logging
  React.useEffect(() => {
    console.log('🔍 Health Records Context State:', {
      isAuthenticated,
      isLoading,
      hasRecordsData: !!recordsData,
      recordsData,
      recordsCount: records.length,
      records,
      error: error?.message,
    })
  }, [isAuthenticated, isLoading, recordsData, records.length, error])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: ({ data, file }: { data: CreateHealthRecordRequest; file?: any }) =>
      healthRecordsService.createHealthRecord(data, file),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['health-records'] })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data, file }: { id: string; data: UpdateHealthRecordRequest; file?: any }) =>
      healthRecordsService.updateHealthRecord(id, data, file),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['health-records'] })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => healthRecordsService.deleteHealthRecord(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['health-records'] })
    },
  })

  const addRecord = async (record: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>, file?: any) => {
    try {
      const { type, title, date, description, notes } = record
      const data: CreateHealthRecordRequest = {
        type,
        title,
        date,
        description,
        notes,
      }
      const newRecord = await createMutation.mutateAsync({ data, file })
      return { success: true, record: newRecord }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to add health record',
      }
    }
  }

  const updateRecord = async (id: string, updates: Partial<HealthRecord>, file?: any) => {
    try {
      const { type, title, date, description, notes } = updates
      const data: UpdateHealthRecordRequest = {
        type,
        title,
        date,
        description,
        notes,
      }
      const updatedRecord = await updateMutation.mutateAsync({ id, data, file })
      return { success: true, record: updatedRecord }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to update health record',
      }
    }
  }

  const deleteRecord = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to delete health record',
      }
    }
  }

  const getRecordsByType = (type: HealthRecord['type']) => {
    const safeRecords = Array.isArray(records) ? records : []
    return safeRecords.filter(record => record.type === type)
  }

  return {
    records,
    isLoading,
    error: error as Error | null,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordsByType,
    refetch: async () => {
      await refetch()
    },
  }
})
