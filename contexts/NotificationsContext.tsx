import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsService, type Notification, type NotificationPreference, type DeviceToken, type NotificationStats, type CreateNotificationRequest, type UpdateNotificationRequest, type BulkActionRequest, type CreatePreferenceRequest, type RegisterDeviceTokenRequest, type ApiError } from '@/lib/api'
import createContextHook from '@nkzw/create-context-hook'
import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { useAuth } from './AuthContext'

export interface NotificationsContextType {
  notifications: Notification[]
  preferences: NotificationPreference[]
  deviceTokens: DeviceToken[]
  stats: NotificationStats | null
  isLoading: boolean
  error: Error | null
  
  // Notifications
  getNotifications: (filters?: {
    is_read?: boolean
    type?: string
    date_from?: string
    date_to?: string
    page?: number
    page_size?: number
  }) => Promise<{ notifications: Notification[]; count: number }>
  markNotificationRead: (id: string) => Promise<{ success: boolean; error?: string }>
  markAllNotificationsRead: () => Promise<{ success: boolean; error?: string }>
  deleteNotification: (id: string) => Promise<{ success: boolean; error?: string }>
  bulkAction: (data: BulkActionRequest) => Promise<{ success: boolean; error?: string }>
  
  // Preferences
  getPreferences: () => Promise<NotificationPreference[]>
  updatePreferences: (preferences: CreatePreferenceRequest[]) => Promise<{ success: boolean; error?: string }>
  
  // Device tokens
  registerDeviceToken: () => Promise<{ success: boolean; error?: string }>
  getDeviceTokens: () => Promise<DeviceToken[]>
  
  // Refetch
  refetch: () => Promise<void>
}

const [NotificationsProviderBase, useNotificationsBase] = createContextHook(() => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  // Fetch notifications - only when authenticated
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    error: notificationsError,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.getNotifications({ page_size: 50 }),
    staleTime: 30000, // 30 seconds
    refetchInterval: isAuthenticated ? 60000 : false, // Only refetch when authenticated
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Fetch notification preferences - only when authenticated
  const {
    data: preferences = [],
    isLoading: isLoadingPreferences,
    error: preferencesError,
  } = useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: () => notificationsService.getNotificationPreferences(),
    staleTime: 300000, // 5 minutes
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Fetch device tokens - only when authenticated
  const {
    data: deviceTokens = [],
    isLoading: isLoadingTokens,
    error: tokensError,
  } = useQuery({
    queryKey: ['notifications', 'device-tokens'],
    queryFn: () => notificationsService.getDeviceTokens(),
    staleTime: 300000, // 5 minutes
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  // Fetch notification stats - only when authenticated
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: () => notificationsService.getNotificationStats(),
    staleTime: 60000, // 1 minute
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: false, // Don't retry on 404
  })

  const notifications = notificationsData?.results || []
  const isLoading = isLoadingNotifications || isLoadingPreferences || isLoadingTokens || isLoadingStats
  const error = (notificationsError || preferencesError || tokensError || statsError) as Error | null

  // Mark notification read mutation
  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] })
    },
  })

  // Mark all read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] })
    },
  })

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationsService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] })
    },
  })

  // Bulk action mutation
  const bulkActionMutation = useMutation({
    mutationFn: (data: BulkActionRequest) => notificationsService.bulkAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] })
    },
  })

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences: CreatePreferenceRequest[]) =>
      notificationsService.updateNotificationPreferences({ preferences }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] })
    },
  })

  // Register device token mutation
  const registerDeviceTokenMutation = useMutation({
    mutationFn: (data: RegisterDeviceTokenRequest) =>
      notificationsService.registerDeviceToken(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'device-tokens'] })
    },
  })

  const getNotifications = async (filters?: {
    is_read?: boolean
    type?: string
    date_from?: string
    date_to?: string
    page?: number
    page_size?: number
  }) => {
    try {
      const response = await notificationsService.getNotifications(filters)
      return {
        notifications: response.results,
        count: response.count,
      }
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error)
      return { notifications: [], count: 0 }
    }
  }

  const markNotificationRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to mark notification as read',
      }
    }
  }

  const markAllNotificationsRead = async () => {
    try {
      await markAllReadMutation.mutateAsync()
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to mark all notifications as read',
      }
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to delete notification',
      }
    }
  }

  const bulkAction = async (data: BulkActionRequest) => {
    try {
      await bulkActionMutation.mutateAsync(data)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to perform bulk action',
      }
    }
  }

  const getPreferences = async () => {
    try {
      return await notificationsService.getNotificationPreferences()
    } catch (error: any) {
      console.error('Failed to fetch preferences:', error)
      return []
    }
  }

  const updatePreferences = async (preferences: CreatePreferenceRequest[]) => {
    try {
      await updatePreferencesMutation.mutateAsync(preferences)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to update preferences',
      }
    }
  }

  const registerDeviceToken = async () => {
    try {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        return { success: false, error: 'Notification permissions not granted' }
      }

      // Get device token
      const tokenData = await Notifications.getExpoPushTokenAsync()
      const deviceType = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web'

      await registerDeviceTokenMutation.mutateAsync({
        token: tokenData.data,
        device_type: deviceType,
      })

      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to register device token',
      }
    }
  }

  const getDeviceTokens = async () => {
    try {
      return await notificationsService.getDeviceTokens()
    } catch (error: any) {
      console.error('Failed to fetch device tokens:', error)
      return []
    }
  }

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications', 'device-tokens'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] }),
    ])
  }

  return {
    notifications,
    preferences,
    deviceTokens,
    stats: stats || null,
    isLoading,
    error,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    bulkAction,
    getPreferences,
    updatePreferences,
    registerDeviceToken,
    getDeviceTokens,
    refetch,
  }
})

// Export with proper naming
export const NotificationsProvider = NotificationsProviderBase
export const useNotifications = useNotificationsBase

