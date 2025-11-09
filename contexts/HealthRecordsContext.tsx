import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { healthRecordsService, type HealthRecord, type CreateHealthRecordRequest, type UpdateHealthRecordRequest, type ApiError } from '@/lib/api'
import createContextHook from '@nkzw/create-context-hook'
import { useAuth } from './AuthContext'

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
  const { isAuthenticated } = useAuth()

  // Fetch health records - only when authenticated
  const {
    data: records = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['health-records'],
    queryFn: () => healthRecordsService.getHealthRecords(),
    staleTime: 30000, // 30 seconds
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: ({ data, file }: { data: CreateHealthRecordRequest; file?: any }) =>
      healthRecordsService.createHealthRecord(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data, file }: { id: string; data: UpdateHealthRecordRequest; file?: any }) =>
      healthRecordsService.updateHealthRecord(id, data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => healthRecordsService.deleteHealthRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] })
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

  // Ensure records is always an array
  const safeRecords = Array.isArray(records) ? records : []

  return {
    records: safeRecords,
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
