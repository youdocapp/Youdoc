import { apiClient } from './client'

export interface Notification {
  id: string
  type: 'medication' | 'health-tip' | 'sync' | 'general'
  type_display?: string
  title: string
  message: string
  is_read: boolean
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  status_display?: string
  scheduled_for?: string
  sent_at?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  time_ago?: string
}

export interface NotificationPreference {
  id: string
  notification_type: string
  notification_type_display?: string
  push_enabled: boolean
  email_enabled: boolean
  sms_enabled: boolean
  created_at: string
  updated_at: string
}

export interface DeviceToken {
  id: string
  token: string
  token_masked?: string
  device_type: 'ios' | 'android' | 'web'
  device_type_display?: string
  is_active: boolean
  last_used?: string
  created_at: string
}

export interface NotificationStats {
  total_notifications: number
  unread_notifications: number
  notifications_by_type: Record<string, number>
  recent_notifications: Notification[]
}

export interface CreateNotificationRequest {
  type: 'medication' | 'health-tip' | 'sync' | 'general'
  title: string
  message: string
  scheduled_for?: string
  metadata?: Record<string, any>
}

export interface UpdateNotificationRequest {
  is_read?: boolean
}

export interface BulkActionRequest {
  notification_ids: string[]
  action: 'mark_read' | 'mark_unread' | 'delete'
}

export interface BulkActionResponse {
  message: string
}

export interface CreatePreferenceRequest {
  notification_type: string
  push_enabled: boolean
  email_enabled: boolean
  sms_enabled: boolean
}

export interface BulkUpdatePreferencesRequest {
  preferences: CreatePreferenceRequest[]
}

export interface RegisterDeviceTokenRequest {
  token: string
  device_type: 'ios' | 'android' | 'web'
}

export interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

export class NotificationsService {
  async getNotifications(filters?: {
    is_read?: boolean
    type?: string
    date_from?: string
    date_to?: string
    page?: number
    page_size?: number
  }): Promise<PaginatedResponse<Notification>> {
    const params = new URLSearchParams()
    if (filters?.is_read !== undefined) params.append('is_read', String(filters.is_read))
    if (filters?.type) params.append('type', filters.type)
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.page_size) params.append('page_size', String(filters.page_size))
    
    const query = params.toString()
    return apiClient.get<PaginatedResponse<Notification>>(`/notifications/${query ? `?${query}` : ''}`)
  }

  async getNotification(id: string): Promise<Notification> {
    return apiClient.get<Notification>(`/notifications/${id}/`)
  }

  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    return apiClient.post<Notification>('/notifications/create/', data)
  }

  async updateNotification(id: string, data: UpdateNotificationRequest): Promise<Notification> {
    return apiClient.patch<Notification>(`/notifications/${id}/`, data)
  }

  async deleteNotification(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/notifications/${id}/`)
  }

  async getNotificationStats(): Promise<NotificationStats> {
    return apiClient.get<NotificationStats>('/notifications/stats/')
  }

  async markNotificationRead(id: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/notifications/${id}/read/`)
  }

  async markAllNotificationsRead(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/notifications/mark-all-read/')
  }

  async bulkAction(data: BulkActionRequest): Promise<BulkActionResponse> {
    return apiClient.post<BulkActionResponse>('/notifications/bulk-action/', data)
  }

  // Preferences
  async getNotificationPreferences(): Promise<NotificationPreference[]> {
    return apiClient.get<NotificationPreference[]>('/notifications/preferences/')
  }

  async createNotificationPreference(data: CreatePreferenceRequest): Promise<NotificationPreference> {
    return apiClient.post<NotificationPreference>('/notifications/preferences/', data)
  }

  async updateNotificationPreferences(data: BulkUpdatePreferencesRequest): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>('/notifications/preferences/update/', data)
  }

  async getNotificationPreference(id: string): Promise<NotificationPreference> {
    return apiClient.get<NotificationPreference>(`/notifications/preferences/${id}/`)
  }

  async updateNotificationPreference(id: string, data: Partial<CreatePreferenceRequest>): Promise<NotificationPreference> {
    return apiClient.patch<NotificationPreference>(`/notifications/preferences/${id}/`, data)
  }

  async deleteNotificationPreference(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/notifications/preferences/${id}/`)
  }

  // Device Tokens
  async getDeviceTokens(): Promise<DeviceToken[]> {
    return apiClient.get<DeviceToken[]>('/notifications/device-tokens/')
  }

  async registerDeviceToken(data: RegisterDeviceTokenRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/notifications/register-device/', data)
  }

  async getDeviceToken(id: string): Promise<DeviceToken> {
    return apiClient.get<DeviceToken>(`/notifications/device-tokens/${id}/`)
  }

  async updateDeviceToken(id: string, data: Partial<DeviceToken>): Promise<DeviceToken> {
    return apiClient.patch<DeviceToken>(`/notifications/device-tokens/${id}/`, data)
  }

  async deleteDeviceToken(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/notifications/device-tokens/${id}/`)
  }
}

export const notificationsService = new NotificationsService()

