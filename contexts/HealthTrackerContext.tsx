import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { healthTrackingService, type HealthData, type ConnectedDevice, type HealthGoal, type HealthInsight, type HealthInsightsResponse, type GoalProgress, type UpdateHealthDataRequest, type CreateDeviceRequest, type CreateGoalRequest, type ApiError } from '@/lib/api'
import { googleFitService } from '@/lib/health/google-fit'
import { appleHealthService } from '@/lib/health/apple-health'
import { Platform } from 'react-native'
import createContextHook from '@nkzw/create-context-hook'
import { useAuth } from './AuthContext'

// Toggle for local mock mode; keep false to use real backend
const MOCK_MODE = false

const now = new Date()
const isoNow = now.toISOString()
const today = isoNow.split('T')[0]

const MOCK_HEALTH_DATA: HealthData = {
  id: 'mock-health-data',
  date: today,
  heartRate: 72,
  steps: 7850,
  distance: 5.4,
  sleep: 7.3,
  calories: 1650,
  weight: 72,
  bloodPressure: {
    systolic: 118,
    diastolic: 76,
  },
  device_type: 'apple_health',
  lastSync: isoNow,
  created_at: isoNow,
  updated_at: isoNow,
}

const MOCK_CONNECTED_DEVICES: ConnectedDevice[] = [
  {
    id: 'mock-device-apple',
    name: 'Apple Health',
    type: 'apple_health',
    connected: true,
    lastSync: isoNow,
    created_at: isoNow,
    updated_at: isoNow,
  },
  {
    id: 'mock-device-fitbit',
    name: 'Fitbit Inspire 3',
    type: 'fitbit',
    connected: false,
    lastSync: '',
    created_at: isoNow,
    updated_at: isoNow,
  },
]

const MOCK_HEALTH_GOALS: HealthGoal[] = [
  {
    id: 'mock-goal-steps',
    goal_type: 'steps',
    target_value: 10000,
    unit: 'steps',
    is_active: true,
    start_date: today,
    end_date: undefined,
    created_at: isoNow,
    updated_at: isoNow,
  },
  {
    id: 'mock-goal-sleep',
    goal_type: 'sleep',
    target_value: 8,
    unit: 'hours',
    is_active: true,
    start_date: today,
    end_date: undefined,
    created_at: isoNow,
    updated_at: isoNow,
  },
]

const MOCK_HEALTH_INSIGHTS: HealthInsightsResponse = {
  total_insights: 3,
  unread_insights: 1,
  recent_insights: [
    {
      id: 'mock-insight-1',
      insight_type: 'trend',
      title: 'Great job keeping active!',
      description: 'You walked 20% more steps this week compared to last week.',
      metric_type: 'steps',
      value: 20,
      is_read: false,
      created_at: isoNow,
    },
    {
      id: 'mock-insight-2',
      insight_type: 'goal_progress',
      title: 'Sleep goal almost complete',
      description: 'You maintained over 7 hours of sleep for 5 nights in a row.',
      metric_type: 'sleep',
      value: 7.2,
      is_read: true,
      created_at: isoNow,
    },
    {
      id: 'mock-insight-3',
      insight_type: 'recommendation',
      title: 'Hydration reminder',
      description: 'Drink a glass of water to support your recovery.',
      metric_type: 'hydration',
      value: undefined,
      is_read: true,
      created_at: isoNow,
    },
  ],
}

const MOCK_GOAL_PROGRESS: GoalProgress[] = [
  {
    goal: MOCK_HEALTH_GOALS[0],
    current_value: 7850,
    progress_percentage: 78.5,
    days_remaining: 5,
    is_on_track: true,
  },
  {
    goal: MOCK_HEALTH_GOALS[1],
    current_value: 7.3,
    progress_percentage: 91.2,
    days_remaining: 2,
    is_on_track: true,
  },
]

const LOCAL_CONNECTED_DEVICES_KEY = 'youdoc.localConnectedDevices'

const buildDefaultLocalDevices = (): ConnectedDevice[] => {
  const iso = new Date().toISOString()
  return [
    {
      id: 'apple_health',
      name: 'Apple Health',
      type: 'apple_health',
      connected: false,
      lastSync: '',
      created_at: iso,
      updated_at: iso,
    },
    {
      id: 'google_fit',
      name: 'Google Fit',
      type: 'google_fit',
      connected: false,
      lastSync: '',
      created_at: iso,
      updated_at: iso,
    },
  ]
}

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
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [hasToken, setHasToken] = React.useState(false)
  const [mockHealthData, setMockHealthData] = React.useState<HealthData | null>(MOCK_MODE ? MOCK_HEALTH_DATA : null)
  const [mockConnectedDevices, setMockConnectedDevices] = React.useState<ConnectedDevice[]>(MOCK_MODE ? MOCK_CONNECTED_DEVICES : [])
  const [mockHealthGoals, setMockHealthGoals] = React.useState<HealthGoal[]>(MOCK_MODE ? MOCK_HEALTH_GOALS : [])
  const [mockHealthInsights, setMockHealthInsights] = React.useState<HealthInsightsResponse>(
    MOCK_MODE ? MOCK_HEALTH_INSIGHTS : { total_insights: 0, unread_insights: 0, recent_insights: [] }
  )
  const [mockGoalProgress, setMockGoalProgress] = React.useState<GoalProgress[]>(MOCK_MODE ? MOCK_GOAL_PROGRESS : [])
  const [localDevices, setLocalDevices] = React.useState<ConnectedDevice[]>(() => buildDefaultLocalDevices())
  const [platformHealthSnapshot, setPlatformHealthSnapshot] = React.useState<HealthData | null>(null)

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

  React.useEffect(() => {
    if (MOCK_MODE) return
    const loadLocalDevices = async () => {
      try {
        const stored = await AsyncStorage.getItem(LOCAL_CONNECTED_DEVICES_KEY)
        if (stored) {
          setLocalDevices(JSON.parse(stored))
        } else {
          await AsyncStorage.setItem(LOCAL_CONNECTED_DEVICES_KEY, JSON.stringify(localDevices))
        }
      } catch (error) {
        console.warn('Failed to load local devices', error)
      }
    }
    loadLocalDevices()
    // we intentionally omit localDevices from deps to avoid overwriting user toggles after first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persistLocalDevices = React.useCallback((updater: (prev: ConnectedDevice[]) => ConnectedDevice[]) => {
    setLocalDevices((prev) => {
      const next = updater(prev)
      AsyncStorage.setItem(LOCAL_CONNECTED_DEVICES_KEY, JSON.stringify(next)).catch((error) =>
        console.warn('Failed to persist connected devices', error)
      )
      return next
    })
  }, [])

  // Fetch health data - only when authenticated, auth initialized, and token exists
  const {
    data: healthData,
    isLoading: isLoadingHealthData,
    error: healthDataError,
    refetch: refetchHealthData,
  } = useQuery({
    queryKey: ['health-tracking', 'data'],
    queryFn: () => healthTrackingService.getHealthData(),
    staleTime: 60000, // 1 minute
    refetchInterval: isAuthenticated && hasToken ? 300000 : false,
    enabled: isAuthenticated && !authLoading && hasToken,
    retry: false, // Don't retry on 404
  })

  // Fetch connected devices - only when authenticated, auth initialized, and token exists
  const {
    data: connectedDevices = [],
    isLoading: isLoadingDevices,
    error: devicesError,
  } = useQuery({
    queryKey: ['health-tracking', 'devices'],
    queryFn: () => healthTrackingService.getConnectedDevices(),
    staleTime: 60000,
    enabled: isAuthenticated && !authLoading && hasToken,
    retry: false, // Don't retry on 404
  })

  // Fetch health goals - only when authenticated, auth initialized, and token exists
  const {
    data: healthGoals = [],
    isLoading: isLoadingGoals,
    error: goalsError,
  } = useQuery({
    queryKey: ['health-tracking', 'goals'],
    queryFn: () => healthTrackingService.getHealthGoals(),
    staleTime: 60000,
    enabled: isAuthenticated && !authLoading && hasToken,
    retry: false, // Don't retry on 404
  })

  // Fetch health insights - only when authenticated, auth initialized, and token exists
  const {
    data: healthInsights,
    isLoading: isLoadingInsights,
    error: insightsError,
  } = useQuery({
    queryKey: ['health-tracking', 'insights'],
    queryFn: () => healthTrackingService.getHealthInsights(),
    staleTime: 300000, // 5 minutes
    enabled: isAuthenticated && !authLoading && hasToken,
    retry: false, // Don't retry on 404
  })

  // Fetch goal progress - only when authenticated, auth initialized, and token exists
  const {
    data: goalProgress = [],
    isLoading: isLoadingProgress,
    error: progressError,
  } = useQuery({
    queryKey: ['health-tracking', 'goals', 'progress'],
    queryFn: () => healthTrackingService.getGoalProgress(),
    staleTime: 60000,
    refetchInterval: isAuthenticated && hasToken ? 300000 : false,
    enabled: isAuthenticated && !authLoading && hasToken,
    retry: false, // Don't retry on 404
  })

  const isLoading = isLoadingHealthData || isLoadingDevices || isLoadingGoals || isLoadingInsights || isLoadingProgress
  const error = (healthDataError || devicesError || goalsError || insightsError || progressError) as Error | null
  const serverDevices = connectedDevices ?? []
  const shouldUseServerDevices = !MOCK_MODE && isAuthenticated && hasToken && serverDevices.length > 0

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
    if (MOCK_MODE) {
      const nextData: HealthData = {
        ...(mockHealthData ?? MOCK_HEALTH_DATA),
        ...data,
        updated_at: new Date().toISOString(),
      }
      setMockHealthData(nextData)
      return { success: true, data: nextData }
    }

    try {
      const updated = await updateHealthDataMutation.mutateAsync(data)
      setPlatformHealthSnapshot(updated)
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
    if (MOCK_MODE) {
      setMockConnectedDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, connected: true, lastSync: new Date().toISOString() } : device
        )
      )
      return { success: true }
    }

    if (!shouldUseServerDevices) {
      const iso = new Date().toISOString()
      persistLocalDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, connected: true, lastSync: iso, updated_at: iso } : device
        )
      )
      return { success: true }
    }

    try {
      await connectDeviceMutation.mutateAsync(deviceId)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      console.warn('Failed to connect device via API, falling back to local storage', apiError.message)
      persistLocalDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, connected: true, lastSync: new Date().toISOString(), updated_at: new Date().toISOString() }
            : device
        )
      )
      return {
        success: false,
        error: apiError.message || 'Failed to connect device',
      }
    }
  }

  const disconnectDevice = async (deviceId: string) => {
    if (MOCK_MODE) {
      setMockConnectedDevices((prev) =>
        prev.map((device) => (device.id === deviceId ? { ...device, connected: false } : device))
      )
      return { success: true }
    }

    if (!shouldUseServerDevices) {
      persistLocalDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, connected: false, updated_at: new Date().toISOString() } : device
        )
      )
      return { success: true }
    }

    try {
      await disconnectDeviceMutation.mutateAsync(deviceId)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      console.warn('Failed to disconnect device via API, falling back to local storage', apiError.message)
      persistLocalDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, connected: false, updated_at: new Date().toISOString() } : device
        )
      )
      return {
        success: false,
        error: apiError.message || 'Failed to disconnect device',
      }
    }
  }

  const syncHealthData = async (deviceId: string) => {
    if (MOCK_MODE) {
      setMockHealthData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          steps: (prev.steps ?? 0) + 500,
          heartRate: (prev.heartRate ?? 70) + 1,
          calories: (prev.calories ?? 0) + 120,
          lastSync: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      })
      return { success: true }
    }

    if (!shouldUseServerDevices) {
      const result = await syncWithPlatform()
      if (result.success) {
        const iso = new Date().toISOString()
        persistLocalDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId ? { ...device, connected: true, lastSync: iso, updated_at: iso } : device
          )
        )
      }
      return result
    }

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
    if (MOCK_MODE) {
      const iso = new Date().toISOString()
      const newDevice: ConnectedDevice = {
        id: `mock-device-${Date.now()}`,
        name: deviceName,
        type: 'custom',
        connected: true,
        lastSync: iso,
        created_at: iso,
        updated_at: iso,
      }
      setMockConnectedDevices((prev) => [newDevice, ...prev])
      return { success: true, device: newDevice }
    }

    if (!shouldUseServerDevices) {
      const iso = new Date().toISOString()
      const newDevice: ConnectedDevice = {
        id: `custom-${Date.now()}`,
        name: deviceName,
        type: 'custom',
        connected: true,
        lastSync: iso,
        created_at: iso,
        updated_at: iso,
      }
      persistLocalDevices((prev) => [newDevice, ...prev])
      return { success: true, device: newDevice }
    }

    try {
      const data: CreateDeviceRequest = {
        name: deviceName,
        device_type: 'custom',
      }
      const device = await createDeviceMutation.mutateAsync(data)
      return { success: true, device }
    } catch (error: any) {
      const apiError = error as ApiError
      console.warn('Failed to add device via API, storing locally', apiError.message)
      const iso = new Date().toISOString()
      const localDevice: ConnectedDevice = {
        id: `custom-${Date.now()}`,
        name: deviceName,
        type: 'custom',
        connected: true,
        lastSync: iso,
        created_at: iso,
        updated_at: iso,
      }
      persistLocalDevices((prev) => [localDevice, ...prev])
      return {
        success: false,
        error: apiError.message || 'Failed to add device',
      }
    }
  }

  const createGoal = async (data: CreateGoalRequest) => {
    if (MOCK_MODE) {
      const iso = new Date().toISOString()
      const newGoal: HealthGoal = {
        id: `mock-goal-${Date.now()}`,
        goal_type: data.goal_type,
        target_value: data.target_value,
        unit: data.unit,
        is_active: true,
        start_date: data.start_date ?? today,
        end_date: data.end_date,
        created_at: iso,
        updated_at: iso,
      }
      setMockHealthGoals((prev) => [newGoal, ...prev])
      setMockGoalProgress((prev) => [
        {
          goal: newGoal,
          current_value: 0,
          progress_percentage: 0,
          days_remaining: undefined,
          is_on_track: true,
        },
        ...prev,
      ])
      return { success: true, goal: newGoal }
    }

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
    if (MOCK_MODE) {
      let updatedGoal: HealthGoal | undefined
      setMockHealthGoals((prev) =>
        prev.map((goal) => {
          if (goal.id !== id) return goal
          updatedGoal = {
            ...goal,
            ...data,
            target_value: data.target_value ?? goal.target_value,
            unit: data.unit ?? goal.unit,
            goal_type: data.goal_type ?? goal.goal_type,
            updated_at: new Date().toISOString(),
          }
          return updatedGoal!
        })
      )
      setMockGoalProgress((prev) =>
        prev.map((entry) => (entry.goal.id === id && updatedGoal ? { ...entry, goal: updatedGoal } : entry))
      )
      return { success: true, goal: updatedGoal }
    }

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
    if (MOCK_MODE) {
      setMockHealthGoals((prev) => prev.filter((goal) => goal.id !== id))
      setMockGoalProgress((prev) => prev.filter((entry) => entry.goal.id !== id))
      return { success: true }
    }

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
    if (MOCK_MODE) {
      setMockHealthInsights((prev) => ({
        ...prev,
        unread_insights: Math.max(prev.unread_insights - 1, 0),
        recent_insights: prev.recent_insights.map((insight) =>
          insight.id === insightId ? { ...insight, is_read: true } : insight
        ),
      }))
      return { success: true }
    }

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

  const syncWithPlatform = React.useCallback(async () => {
    if (MOCK_MODE) {
      setMockHealthData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          steps: (prev.steps ?? 0) + 750,
          heartRate: 70 + Math.floor(Math.random() * 6),
          calories: (prev.calories ?? 0) + 150,
          sleep: 7.5,
          lastSync: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      })
      return { success: true }
    }

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
        const isAvailable = await googleFitService.isAvailable()
        if (isAvailable) {
          platformData = await googleFitService.syncHealthData()
        }
      } else if (Platform.OS === 'ios') {
        const isAvailable = await appleHealthService.isAvailable()
        if (isAvailable) {
          platformData = await appleHealthService.syncHealthData()
        }
      }

      if (Object.keys(platformData).length === 0) {
        return { success: false, error: 'No health data available from device' }
      }

      const iso = new Date().toISOString()
      const snapshot: HealthData = {
        id: 'platform-health',
        date: iso.split('T')[0],
        heartRate: platformData.heartRate,
        steps: platformData.steps,
        distance: platformData.distance,
        sleep: platformData.sleep,
        calories: platformData.calories,
        weight: platformData.weight,
        device_type: Platform.OS === 'android' ? 'google_fit' : 'apple_health',
        lastSync: iso,
        created_at: iso,
        updated_at: iso,
      }
      setPlatformHealthSnapshot(snapshot)

      if (hasToken) {
        await updateHealthDataMutation.mutateAsync({
          ...platformData,
          device_type: snapshot.device_type,
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
  }, [hasToken, updateHealthDataMutation])

  React.useEffect(() => {
    if (MOCK_MODE) return
    if (!isAuthenticated || !hasToken) return
    const devicePool = shouldUseServerDevices ? serverDevices : localDevices
    const hasNativeConnection = devicePool.some(
      (device) => device.connected && (device.type === 'apple_health' || device.type === 'google_fit')
    )
    if (!hasNativeConnection) return

    let cancelled = false

    const runSync = async () => {
      if (cancelled) return
      await syncWithPlatform()
    }

    runSync()
    const interval = setInterval(runSync, 5 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [isAuthenticated, hasToken, shouldUseServerDevices, serverDevices, localDevices, syncWithPlatform])

  const effectiveHealthData = MOCK_MODE ? mockHealthData : healthData || platformHealthSnapshot || null
  const effectiveConnectedDevices = MOCK_MODE ? mockConnectedDevices : shouldUseServerDevices ? serverDevices : localDevices
  const effectiveHealthGoals = MOCK_MODE ? mockHealthGoals : healthGoals
  const effectiveHealthInsights = MOCK_MODE ? mockHealthInsights : healthInsights || null
  const effectiveGoalProgress = MOCK_MODE ? mockGoalProgress : goalProgress
  const effectiveLoading = MOCK_MODE ? false : shouldUseServerDevices ? isLoading : false
  const effectiveError = MOCK_MODE ? null : error

  return {
    healthData: effectiveHealthData,
    connectedDevices: effectiveConnectedDevices,
    healthGoals: effectiveHealthGoals,
    healthInsights: effectiveHealthInsights,
    goalProgress: effectiveGoalProgress,
    isLoading: effectiveLoading,
    error: effectiveError,
    updateHealthData,
    refetchHealthData: async () => {
      if (!MOCK_MODE) {
      await refetchHealthData()
      }
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
