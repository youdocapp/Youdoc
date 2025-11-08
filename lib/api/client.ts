import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

// Get API base URL from environment or use default
const getApiBaseUrl = (): string => {
  if (typeof Constants !== 'undefined' && Constants.expoConfig?.extra?.apiBaseUrl) {
    return Constants.expoConfig.extra.apiBaseUrl
  }
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) {
    // Remove trailing slash if present
    const url = process.env.EXPO_PUBLIC_API_BASE_URL.trim()
    return url.endsWith('/') ? url.slice(0, -1) : url
  }
  return 'https://youdoc.onrender.com'
}

const API_BASE_URL = getApiBaseUrl()

// Log API base URL for debugging
console.log('🔧 API Base URL:', API_BASE_URL)

export interface ApiError {
  error: boolean
  message: string
  details?: Record<string, any>
}

interface RequestConfig {
  method: string
  headers: Record<string, string>
  body?: any
}

export class ApiClient {
  private baseUrl: string
  private isRefreshing: boolean = false
  private refreshPromise: Promise<string | null> | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('accessToken')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = (async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken')
        if (!refreshToken) {
          return null
        }

        const response = await fetch(`${this.baseUrl}/auth/token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        })

        if (response.ok) {
          const data = await response.json()
          await AsyncStorage.setItem('accessToken', data.access)
          return data.access
        } else {
          // Refresh failed, clear tokens
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user'])
          return null
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user'])
        return null
      } finally {
        this.isRefreshing = false
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    
    let data: any
    if (isJson) {
      data = await response.json()
    } else {
      const text = await response.text()
      data = text ? { message: text } : {}
    }

    if (!response.ok) {
      // Log full error details for debugging
      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data: data,
      })
      
      const error: ApiError = {
        error: true,
        message: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
        details: data.details || data || {},
      }
      throw error
    }

    return data as T
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig,
    requiresAuth: boolean = true,
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Log request details for debugging
    console.log('🌐 API Request:', {
      method: config.method,
      url,
      requiresAuth,
      hasBody: !!config.body,
    })
    
    let response: Response
    try {
      // Add timeout to fetch request (30 seconds)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
    } catch (error: any) {
      // Log detailed error information
      console.error('❌ Fetch error:', {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        url,
        method: config.method,
        isAborted: error?.name === 'AbortError',
      })
      
      // Provide more specific error messages
      let errorMessage = 'Network error. Please check your connection.'
      if (error?.name === 'AbortError') {
        errorMessage = 'Request timeout. Please check your connection and try again.'
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      throw {
        error: true,
        message: errorMessage,
        details: {
          originalError: error?.message,
          errorName: error?.name,
          url,
          method: config.method,
        },
      } as ApiError
    }

    // Handle 401 Unauthorized - try to refresh token once
    if (response.status === 401 && requiresAuth && retryCount === 0) {
      const newAccessToken = await this.refreshAccessToken()
      
      if (newAccessToken) {
        // Retry with new token
        const newHeaders = { ...config.headers }
        newHeaders['Authorization'] = `Bearer ${newAccessToken}`
        
        const retryConfig: RequestConfig = {
          ...config,
          headers: newHeaders,
        }
        
        try {
          response = await fetch(url, retryConfig)
        } catch (error) {
          throw {
            error: true,
            message: 'Network error. Please check your connection.',
            details: {},
          } as ApiError
        }
      }
    }

    return this.handleResponse<T>(response)
  }

  async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    const headers = requiresAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' }
    
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'GET',
        headers,
      },
      requiresAuth
    )
  }

  async post<T>(
    endpoint: string,
    data?: any,
    requiresAuth: boolean = true,
    isFormData: boolean = false
  ): Promise<T> {
    const headers = requiresAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' }
    
    if (isFormData) {
      delete headers['Content-Type'] // Let browser set boundary for FormData
    }

    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined)

    return this.makeRequest<T>(
      endpoint,
      {
        method: 'POST',
        headers,
        body,
      },
      requiresAuth
    )
  }

  async put<T>(
    endpoint: string,
    data?: any,
    requiresAuth: boolean = true,
    isFormData: boolean = false
  ): Promise<T> {
    const headers = requiresAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' }
    
    if (isFormData) {
      delete headers['Content-Type']
    }

    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined)

    return this.makeRequest<T>(
      endpoint,
      {
        method: 'PUT',
        headers,
        body,
      },
      requiresAuth
    )
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    requiresAuth: boolean = true,
    isFormData: boolean = false
  ): Promise<T> {
    const headers = requiresAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' }
    
    if (isFormData) {
      delete headers['Content-Type']
    }

    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined)

    return this.makeRequest<T>(
      endpoint,
      {
        method: 'PATCH',
        headers,
        body,
      },
      requiresAuth
    )
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    const headers = requiresAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' }
    
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'DELETE',
        headers,
      },
      requiresAuth
    )
  }
}

export const apiClient = new ApiClient()
