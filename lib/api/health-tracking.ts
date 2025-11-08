import { apiClient } from './client'

export interface HealthData {
  id: string
  date: string
  heartRate?: number
  steps?: number
  distance?: number
  sleep?: number
  calories?: number
  weight?: number
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  device_type?: string
  lastSync?: string
  created_at: string
  updated_at: string
}

export interface ConnectedDevice {
  id: string
  name: string
  type: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health' | 'custom'
  connected: boolean
  lastSync?: string
  created_at: string
  updated_at: string
}

export interface HealthGoal {
  id: string
  goal_type: 'steps' | 'distance' | 'calories' | 'sleep' | 'weight' | 'heartRate'
  target_value: number
  unit: string
  is_active: boolean
  start_date: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface HealthTrend {
  date: string
  value: number
  metric_type: string
}

export interface HealthInsight {
  id: string
  insight_type: 'trend' | 'goal_progress' | 'recommendation' | 'alert' | 'achievement'
  title: string
  description: string
  metric_type?: string
  value?: number
  is_read: boolean
  created_at: string
}

export interface HealthInsightsResponse {
  total_insights: number
  unread_insights: number
  recent_insights: HealthInsight[]
}

export interface GoalProgress {
  goal: HealthGoal
  current_value: number
  progress_percentage: number
  days_remaining?: number
  is_on_track: boolean
}

export interface SyncHistory {
  id: string
  device_name: string
  status: 'success' | 'failed'
  metrics_synced: number
  error_message?: string
  sync_duration: number
  started_at: string
  completed_at: string
}

export interface UpdateHealthDataRequest {
  heartRate?: number
  steps?: number
  distance?: number
  sleep?: number
  calories?: number
  weight?: number
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  device_type?: string
}

export interface CreateDeviceRequest {
  name: string
  device_type: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health' | 'custom'
  device_id?: string
  access_token?: string
  refresh_token?: string
}

export interface CreateGoalRequest {
  goal_type: 'steps' | 'distance' | 'calories' | 'sleep' | 'weight' | 'heartRate'
  target_value: number
  unit: string
  start_date?: string
  end_date?: string
}

export interface SyncResponse {
  message: string
  sync_id: string
  last_sync: string
}

export class HealthTrackingService {
  async getHealthData(): Promise<HealthData> {
    return apiClient.get<HealthData>('/health-tracking/data')
  }

  async updateHealthData(data: UpdateHealthDataRequest): Promise<HealthData> {
    return apiClient.post<HealthData>('/health-tracking/data/update', data)
  }

  async getConnectedDevices(): Promise<ConnectedDevice[]> {
    return apiClient.get<ConnectedDevice[]>('/health-tracking/devices')
  }

  async createConnectedDevice(data: CreateDeviceRequest): Promise<ConnectedDevice> {
    return apiClient.post<ConnectedDevice>('/health-tracking/devices', data)
  }

  async updateConnectedDevice(id: string, data: Partial<CreateDeviceRequest>): Promise<ConnectedDevice> {
    return apiClient.patch<ConnectedDevice>(`/health-tracking/devices/${id}`, data)
  }

  async deleteConnectedDevice(id: string): Promise<void> {
    return apiClient.delete<void>(`/health-tracking/devices/${id}`)
  }

  async toggleDeviceConnection(deviceId: string): Promise<{ connected: boolean }> {
    return apiClient.post<{ connected: boolean }>(`/health-tracking/devices/${deviceId}/toggle`)
  }

  async syncHealthData(deviceId: string): Promise<SyncResponse> {
    return apiClient.post<SyncResponse>(`/health-tracking/devices/${deviceId}/sync`)
  }

  async getHealthGoals(): Promise<HealthGoal[]> {
    return apiClient.get<HealthGoal[]>('/health-tracking/goals')
  }

  async createHealthGoal(data: CreateGoalRequest): Promise<HealthGoal> {
    return apiClient.post<HealthGoal>('/health-tracking/goals', data)
  }

  async updateHealthGoal(id: string, data: Partial<CreateGoalRequest>): Promise<HealthGoal> {
    return apiClient.patch<HealthGoal>(`/health-tracking/goals/${id}`, data)
  }

  async deleteHealthGoal(id: string): Promise<void> {
    return apiClient.delete<void>(`/health-tracking/goals/${id}`)
  }

  async getHealthTrends(metric: string, days: number = 30): Promise<HealthTrend[]> {
    const params = new URLSearchParams()
    params.append('metric', metric)
    params.append('days', String(days))
    return apiClient.get<HealthTrend[]>(`/health-tracking/trends?${params.toString()}`)
  }

  async getHealthInsights(): Promise<HealthInsightsResponse> {
    return apiClient.get<HealthInsightsResponse>('/health-tracking/insights')
  }

  async markInsightRead(insightId: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/health-tracking/insights/${insightId}/read`)
  }

  async getGoalProgress(): Promise<GoalProgress[]> {
    return apiClient.get<GoalProgress[]>('/health-tracking/goals/progress')
  }

  async getSyncHistory(deviceId?: string): Promise<SyncHistory[]> {
    const params = deviceId ? `?device_id=${deviceId}` : ''
    return apiClient.get<SyncHistory[]>(`/health-tracking/sync-history/${params}`)
  }
}

export const healthTrackingService = new HealthTrackingService()

