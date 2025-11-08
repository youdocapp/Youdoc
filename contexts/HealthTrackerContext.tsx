import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { healthTrackingService, type HealthData, type ConnectedDevice, type HealthGoal, type HealthInsight, type GoalProgress, type UpdateHealthDataRequest, type CreateDeviceRequest, type CreateGoalRequest, type ApiError } from '@/lib/api'
import { googleFitService } from '@/lib/health/google-fit'
import { appleHealthService } from '@/lib/health/apple-health'
import { Platform } from 'react-native'
import createContextHook from '@nkzw/create-context-hook'
import { useAuth } from './AuthContext'

export interface HealthTrackerContextType {
  healthData: HealthData | null
  connectedDevices: ConnectedDevice[]
  healthGoals: HealthGoal[]
  healthInsights: {
    total_insights: number
    unread_insights: number
    recent_insights: HealthInsight[]
  } | null
  goalProgress: GoalProgress[]
  isLoading: boolean
  error: Error | null
  
  // Health data
  updateHealthData: (data: UpdateHealthDataRequest) => Promise<{ success: boolean; data?: HealthData; error?: string }>
  refetchHealthData: () => Promise<void>
  
  // Devices
  connectDevice: (deviceId: string) => Promise<{ success: boolean; error?: string }>
  disconnectDevice: (deviceId: string) => Promise<{ success: boolean; error?: string }>
  syncHealthData: (deviceId: string) => Promise<{ success: boolean; error?: string }>
  addCustomDevice: (deviceName: string) => Promise<{ success: boolean; device?: ConnectedDevice; error?: string }>
  
  // Goals
  createGoal: (data: CreateGoalRequest) => Promise<{ success: boolean; goal?: HealthGoal; error?: string }>
  updateGoal: (id: string, data: Partial<CreateGoalRequest>) => Promise<{ success: boolean; goal?: HealthGoal; error?: string }>
  deleteGoal: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Insights
  markInsightRead: (insightId: string) => Promise<{ success: boolean; error?: string }>
  
  // Platform-specific health sync
  syncWithPlatform: () => Promise<{ success: boolean; error?: string }>
}

export const [HealthTrackerProvider, useHealthTracker] = createContextHook(() => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  // Fetch health data - only when authenticated
  const {
    data: healthData,
    isLoading: isLoadingHealthData,
    error: healthDataError,
    refetch: refetchHealthData,
  } = useQuery({
    queryKey: ['health-tracking', 'data'],
    queryFn: () => healthTrackingService.getHealthData(),
    staleTime: 60000, // 1 minute
    refetchInterval: isAuthenticated ? 300000 : false, // Only refetch when authenticated
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Fetch connected devices - only when authenticated
  const {
    data: connectedDevices = [],
    isLoading: isLoadingDevices,
    error: devicesError,
  } = useQuery({
    queryKey: ['health-tracking', 'devices'],
    queryFn: () => healthTrackingService.getConnectedDevices(),
    staleTime: 60000,
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Fetch health goals - only when authenticated
  const {
    data: healthGoals = [],
    isLoading: isLoadingGoals,
    error: goalsError,
  } = useQuery({
    queryKey: ['health-tracking', 'goals'],
    queryFn: () => healthTrackingService.getHealthGoals(),
    staleTime: 60000,
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Fetch health insights - only when authenticated
  const {
    data: healthInsights,
    isLoading: isLoadingInsights,
    error: insightsError,
  } = useQuery({
    queryKey: ['health-tracking', 'insights'],
    queryFn: () => healthTrackingService.getHealthInsights(),
    staleTime: 300000, // 5 minutes
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Fetch goal progress - only when authenticated
  const {
    data: goalProgress = [],
    isLoading: isLoadingProgress,
    error: progressError,
  } = useQuery({
    queryKey: ['health-tracking', 'goals', 'progress'],
    queryFn: () => healthTrackingService.getGoalProgress(),
    staleTime: 60000,
    refetchInterval: isAuthenticated ? 300000 : false, // Only refetch when authenticated
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  const isLoading = isLoadingHealthData || isLoadingDevices || isLoadingGoals || isLoadingInsights || isLoadingProgress
  const error = (healthDataError || devicesError || goalsError || insightsError || progressError) as Error | null

  // Update health data mutation
  const updateHealthDataMutation = useMutation({
    mutationFn: (data: UpdateHealthDataRequest) => healthTrackingService.updateHealthData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'data'] })
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'goals', 'progress'] })
    },
  })

  // Connect device mutation
  const connectDeviceMutation = useMutation({
    mutationFn: (deviceId: string) => healthTrackingService.toggleDeviceConnection(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'devices'] })
    },
  })

  // Disconnect device mutation
  const disconnectDeviceMutation = useMutation({
    mutationFn: (deviceId: string) => healthTrackingService.toggleDeviceConnection(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'devices'] })
    },
  })

  // Sync health data mutation
  const syncHealthDataMutation = useMutation({
    mutationFn: (deviceId: string) => healthTrackingService.syncHealthData(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'data'] })
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'devices'] })
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'goals', 'progress'] })
    },
  })

  // Create device mutation
  const createDeviceMutation = useMutation({
    mutationFn: (data: CreateDeviceRequest) => healthTrackingService.createConnectedDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'devices'] })
    },
  })

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: (data: CreateGoalRequest) => healthTrackingService.createHealthGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'goals'] })
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'goals', 'progress'] })
    },
  })

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGoalRequest> }) =>
      healthTrackingService.updateHealthGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'goals'] })
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'goals', 'progress'] })
    },
  })

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => healthTrackingService.deleteHealthGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'goals'] })
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'goals', 'progress'] })
    },
  })

  // Mark insight read mutation
  const markInsightReadMutation = useMutation({
    mutationFn: (insightId: string) => healthTrackingService.markInsightRead(insightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-tracking', 'insights'] })
    },
  })

  const updateHealthData = async (data: UpdateHealthDataRequest) => {
    try {
      const updated = await updateHealthDataMutation.mutateAsync(data)
      return { success: true, data: updated }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to update health data',
      }
    }
  }

  const connectDevice = async (deviceId: string) => {
    try {
      await connectDeviceMutation.mutateAsync(deviceId)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to connect device',
      }
    }
  }

  const disconnectDevice = async (deviceId: string) => {
    try {
      await disconnectDeviceMutation.mutateAsync(deviceId)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to disconnect device',
      }
    }
  }

  const syncHealthData = async (deviceId: string) => {
    try {
      await syncHealthDataMutation.mutateAsync(deviceId)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to sync health data',
      }
    }
  }

  const addCustomDevice = async (deviceName: string) => {
    try {
      const data: CreateDeviceRequest = {
        name: deviceName,
        device_type: 'custom',
      }
      const device = await createDeviceMutation.mutateAsync(data)
      return { success: true, device }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to add device',
      }
    }
  }

  const createGoal = async (data: CreateGoalRequest) => {
    try {
      const goal = await createGoalMutation.mutateAsync(data)
      return { success: true, goal }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to create goal',
      }
    }
  }

  const updateGoal = async (id: string, data: Partial<CreateGoalRequest>) => {
    try {
      const goal = await updateGoalMutation.mutateAsync({ id, data })
      return { success: true, goal }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to update goal',
      }
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      await deleteGoalMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to delete goal',
      }
    }
  }

  const markInsightRead = async (insightId: string) => {
    try {
      await markInsightReadMutation.mutateAsync(insightId)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to mark insight as read',
      }
    }
  }

  const syncWithPlatform = async () => {
    try {
      let platformData: {
        steps?: number
        heartRate?: number
        distance?: number
        sleep?: number
        weight?: number
        calories?: number
      } = {}

      if (Platform.OS === 'android') {
        // Sync with Google Fit
        const isAvailable = await googleFitService.isAvailable()
        if (isAvailable) {
          platformData = await googleFitService.syncHealthData()
        }
      } else if (Platform.OS === 'ios') {
        // Sync with Apple Health
        const isAvailable = await appleHealthService.isAvailable()
        if (isAvailable) {
          platformData = await appleHealthService.syncHealthData()
        }
      }

      // Update health data on backend
      if (Object.keys(platformData).length > 0) {
        await updateHealthDataMutation.mutateAsync({
          ...platformData,
          device_type: Platform.OS === 'android' ? 'google_fit' : 'apple_health',
        })
      }

      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to sync with platform',
      }
    }
  }

  return {
    healthData: healthData || null,
    connectedDevices,
    healthGoals,
    healthInsights: healthInsights || null,
    goalProgress,
    isLoading,
    error,
    updateHealthData,
    refetchHealthData: async () => {
      await refetchHealthData()
    },
    connectDevice,
    disconnectDevice,
    syncHealthData,
    addCustomDevice,
    createGoal,
    updateGoal,
    deleteGoal,
    markInsightRead,
    syncWithPlatform,
  }
})
