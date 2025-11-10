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

  private async getAuthHeaders(includeContentType: boolean = true, requiresAuth: boolean = true): Promise<Record<string, string>> {
    console.log('🔑 getAuthHeaders called:', { includeContentType, requiresAuth })
    const token = await AsyncStorage.getItem('accessToken')
    console.log('🔑 getAuthHeaders: Token retrieved:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPrefix: token ? token.substring(0, 20) + '...' : 'none',
      tokenTrimmed: token ? token.trim().length : 0
    })
    
    const headers: Record<string, string> = {}
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json'
    }
    
    if (token && token.trim()) {
      headers['Authorization'] = `Bearer ${token.trim()}`
      console.log('🔑 Token found, adding Authorization header:', {
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 20) + '...',
        hasAuthHeader: !!headers['Authorization'],
        allHeaders: Object.keys(headers),
        authHeaderLength: headers['Authorization'].length
      })
    } else {
      if (requiresAuth) {
        console.error('❌ getAuthHeaders: No access token found but auth is required', {
          tokenExists: !!token,
          tokenValue: token || 'null',
          tokenLength: token?.length || 0,
          requiresAuth
        })
        throw {
          error: true,
          message: 'Authentication credentials were not provided.',
          details: {}
        } as ApiError
    } else {
      console.warn('⚠️ No access token found in AsyncStorage')
      console.warn('⚠️ Request will be made without Authorization header')
      }
    }
    
    console.log('🔑 getAuthHeaders returning:', {
      headerKeys: Object.keys(headers),
      hasAuth: !!headers['Authorization']
    })
    return headers
  }

  private async hasToken(): Promise<boolean> {
    const token = await AsyncStorage.getItem('accessToken')
    return !!token
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
          console.error('❌ No refresh token available')
          return null
        }

        console.log('🔄 Refreshing token...', {
          refreshTokenPrefix: refreshToken.substring(0, 20) + '...',
          refreshTokenLength: refreshToken.length
        })

        const response = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        })

        console.log('🔄 Token refresh response:', {
          status: response.status,
          ok: response.ok,
          url: response.url
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Token refresh successful:', {
            hasAccessToken: !!data.access,
            accessTokenPrefix: data.access ? data.access.substring(0, 20) + '...' : 'none',
            accessTokenLength: data.access?.length || 0,
            responseKeys: Object.keys(data)
          })
          
          if (data.access) {
            await AsyncStorage.setItem('accessToken', data.access)
            console.log('✅ New access token saved to AsyncStorage')
            return data.access
          } else {
            console.error('❌ Token refresh response missing access token:', data)
            return null
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ Token refresh failed:', {
            status: response.status,
            error: errorData
          })
          // Refresh failed, clear tokens
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user'])
          return null
        }
      } catch (error) {
        console.error('❌ Token refresh error:', error)
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user'])
        return null
      } finally {
        this.isRefreshing = false
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  private async handleResponse<T>(response: Response, method: string = 'GET'): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    
    let data: any
    if (isJson) {
      data = await response.json()
    } else {
      const text = await response.text()
      data = text ? { message: text } : {}
    }

    // Log successful responses for POST requests to help debug
    if (response.ok && method.toUpperCase() === 'POST') {
      console.log('✅ POST Success:', {
        status: response.status,
        url: response.url,
        hasData: !!data
      })
    }
    
    if (!response.ok) {
      // For mutations (POST, PUT, PATCH, DELETE), always throw errors
      const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())
      
      // Log error details for POST requests to help debug why medication creation might fail
      if (method.toUpperCase() === 'POST') {
        console.error('❌ POST Request Failed:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          responseData: data,
          isMutation
        })
      }
      
      // Handle 404 errors - only return empty data for GET requests
      if (response.status === 404) {
        if (isMutation) {
          // For mutations, throw error on 404
          const error: ApiError = {
            error: true,
            message: data.message || data.error || 'Resource not found',
            details: data.details || data || {},
          }
          throw error
        }
        // For GET requests, return empty data (allows optional endpoints to fail silently)
        return {} as T
      }
      
      // Handle 401 errors
      if (response.status === 401) {
        // Log the actual server response for debugging
        console.error('❌ 401 Error - Server Response:', {
          status: response.status,
          url: response.url,
          responseData: data,
          responseMessage: data.message || data.error || data.detail || 'No message',
          fullResponse: data
        })
        
        const hasToken = await this.hasToken()
        if (!hasToken) {
          // No token available
          if (isMutation) {
            // For mutations, throw error with authentication message
            const error: ApiError = {
              error: true,
              message: data.message || data.error || data.detail || 'Authentication required. Please log in.',
              details: data.details || data || {},
            }
            throw error
          }
          // For GET requests, return empty data (allows queries to fail silently when disabled by isAuthenticated)
          return {} as T
        }
        // If we have a token but still got 401, throw error (token might be invalid)
        // Use the actual server error message if available
        const serverMessage = data.message || data.error || data.detail || data.detail || 'Authentication failed. Please log in again.'
        const error: ApiError = {
          error: true,
          message: serverMessage,
          details: data.details || data || {},
        }
        throw error
      }
      
      // Log full error details for debugging (only for non-404/401 errors, or 401 with token)
      if (response.status !== 404 && response.status !== 401) {
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data: data,
        })
      }
      
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
    retryCount: number = 0,
    timeout: number = 30000
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Log request details for debugging
    console.log('🌐 API Request:', {
      method: config.method,
      url,
      requiresAuth,
      hasBody: !!config.body,
      timeout,
      hasAuthHeader: !!config.headers['Authorization'],
      authHeaderPrefix: config.headers['Authorization']?.substring(0, 30) || 'none'
    })
    
    let response: Response
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    try {
      // Add timeout to fetch request (default 30 seconds, longer for auth endpoints)
      const controller = new AbortController()
      timeoutId = setTimeout(() => controller.abort(), timeout)
      
      // Ensure headers are properly set - create a new object to avoid mutation issues
      const requestHeaders: Record<string, string> = { ...config.headers }
      
      // Ensure Authorization header is present if required
      if (requiresAuth) {
        // First check if it's already in the headers
        if (!requestHeaders['Authorization']) {
          // If not, get token from AsyncStorage
        const token = await AsyncStorage.getItem('accessToken')
          if (token && token.trim()) {
            requestHeaders['Authorization'] = `Bearer ${token.trim()}`
            console.log('🔧 Added Authorization header directly in makeRequest')
          } else {
            // No token available - this should not happen if get() method worked correctly
            console.error('❌ No token available in makeRequest despite requiresAuth=true')
            throw {
              error: true,
              message: 'Authentication credentials were not provided.',
              details: {}
            } as ApiError
          }
        } else {
          // Header already exists, verify it's properly formatted
          if (!requestHeaders['Authorization'].startsWith('Bearer ')) {
            const token = requestHeaders['Authorization'].replace('Bearer ', '')
          requestHeaders['Authorization'] = `Bearer ${token}`
          }
        }
      }
      
      // Ensure headers are properly formatted for React Native fetch
      // Create a new headers object to ensure proper formatting
      const finalHeaders: Record<string, string> = {}
      Object.keys(requestHeaders).forEach(key => {
        // Ensure Authorization header is properly capitalized
        if (key.toLowerCase() === 'authorization') {
          finalHeaders['Authorization'] = requestHeaders[key]
        } else {
          finalHeaders[key] = requestHeaders[key]
        }
      })
      
      const requestConfig = {
        method: config.method,
        headers: finalHeaders,
        body: config.body,
        signal: controller.signal,
      }
      
      // Verify Authorization header is present and properly formatted
      const authHeader = requestConfig.headers['Authorization']
      if (requiresAuth && !authHeader) {
        console.error('❌ CRITICAL: Authorization header missing in fetch config!', {
          requiresAuth,
          allHeaders: Object.keys(requestConfig.headers),
          headerValues: requestConfig.headers
        })
        throw {
          error: true,
          message: 'Authentication credentials were not provided.',
          details: {}
        } as ApiError
      }
      
      console.log('📤 Fetch request config:', {
        method: requestConfig.method,
        url,
        hasAuthHeader: !!authHeader,
        authHeaderPrefix: authHeader?.substring(0, 50) || 'none',
        authHeaderLength: authHeader?.length || 0,
        allHeaderKeys: Object.keys(requestConfig.headers),
        requiresAuth
      })
      
      response = await fetch(url, requestConfig)
      
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      // Log response details for debugging
      console.log('📥 Fetch response received:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        hasAuthHeader: !!requestConfig.headers['Authorization'],
        authHeaderPrefix: requestConfig.headers['Authorization']?.substring(0, 50) || 'none'
      })
    } catch (error: any) {
      // Clear timeout if it hasn't fired yet
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
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
      
      // Handle network request failures (server unreachable, sleeping, etc.)
      if (error?.message === 'Network request failed' || error?.name === 'TypeError') {
        // Check if this might be a cold start on Render.com
        const isRenderCom = this.baseUrl.includes('onrender.com')
        if (isRenderCom && retryCount === 0) {
          // Retry once with longer timeout (cold start on Render.com can take 30-60 seconds)
          console.log('🔄 Retrying request with longer timeout (possible cold start on Render.com)...')
          return this.makeRequest<T>(endpoint, config, requiresAuth, retryCount + 1, 90000)
        }
        errorMessage = 'Unable to connect to the server. The server may be starting up. Please try again in a moment.'
      } else if (error?.name === 'AbortError') {
        // Check if this is an auth endpoint that might be experiencing a cold start
        const isAuthEndpoint = endpoint.includes('/auth/')
        if (isAuthEndpoint && retryCount === 0) {
          // Retry once with longer timeout for auth endpoints (cold start on Render.com)
          console.log('🔄 Retrying auth request with longer timeout (possible cold start)...')
          return this.makeRequest<T>(endpoint, config, requiresAuth, retryCount + 1, 90000)
        }
        errorMessage = 'Request timeout. The server may be starting up. Please try again in a moment.'
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
      console.log('🔄 401 received, attempting token refresh...')
      const hasToken = await this.hasToken()
      
      // Only try to refresh if we have a token (might be expired)
      if (hasToken) {
        console.log('🔄 Token exists, refreshing...')
        const newAccessToken = await this.refreshAccessToken()
        
        if (newAccessToken) {
          console.log('✅ Token refreshed successfully, retrying request...')
          // Retry with new token
          const newHeaders = { ...config.headers }
          newHeaders['Authorization'] = `Bearer ${newAccessToken.trim()}`
          
          console.log('🔄 Retry headers:', {
            hasAuth: !!newHeaders['Authorization'],
            authHeaderPrefix: newHeaders['Authorization']?.substring(0, 50) || 'none',
            authHeaderLength: newHeaders['Authorization']?.length || 0,
            allHeaderKeys: Object.keys(newHeaders)
          })
          
          const retryConfig: RequestConfig = {
            ...config,
            headers: newHeaders,
          }
          
          // Ensure headers are properly formatted for fetch
          const finalRetryHeaders: Record<string, string> = {}
          Object.keys(newHeaders).forEach(key => {
            if (key.toLowerCase() === 'authorization') {
              finalRetryHeaders['Authorization'] = newHeaders[key]
            } else {
              finalRetryHeaders[key] = newHeaders[key]
            }
          })
          
          console.log('🔄 Final retry headers for fetch:', {
            hasAuth: !!finalRetryHeaders['Authorization'],
            authHeaderPrefix: finalRetryHeaders['Authorization']?.substring(0, 50) || 'none',
            allHeaderKeys: Object.keys(finalRetryHeaders)
          })
          
          try {
            console.log('🔄 Retrying request with new token...')
            
            // Verify the Authorization header is present before making the request
            if (!finalRetryHeaders['Authorization']) {
              console.error('❌ CRITICAL: Authorization header missing in retry headers!', {
                allHeaders: Object.keys(finalRetryHeaders),
                headerValues: finalRetryHeaders
              })
              throw {
                error: true,
                message: 'Authentication credentials were not provided.',
                details: {}
              } as ApiError
            }
            
            const retryResponse = await fetch(url, {
              method: retryConfig.method,
              headers: finalRetryHeaders,
              body: retryConfig.body,
            })
            
            // Log what was actually sent
            console.log('📤 Retry fetch request sent:', {
              method: retryConfig.method,
              url,
              hasAuthHeader: !!finalRetryHeaders['Authorization'],
              authHeaderPrefix: finalRetryHeaders['Authorization']?.substring(0, 50) || 'none',
              allHeaderKeys: Object.keys(finalRetryHeaders)
            })
            
            // Log retry response details before handleResponse reads it
            const retryResponseClone = retryResponse.clone()
            const retryResponseText = await retryResponseClone.text()
            let retryResponseData: any = {}
            try {
              retryResponseData = JSON.parse(retryResponseText)
            } catch {
              retryResponseData = { raw: retryResponseText }
            }
            
            console.log('📥 Retry response:', {
              status: retryResponse.status,
              ok: retryResponse.ok,
              url: retryResponse.url,
              responseData: retryResponseData,
              responseMessage: retryResponseData.message || retryResponseData.error || retryResponseData.detail || 'No message',
              newTokenPrefix: newAccessToken.substring(0, 20) + '...'
            })
            
            // Use the original response for handleResponse
            response = retryResponse
          } catch (error) {
            console.error('❌ Retry request failed:', error)
            throw {
              error: true,
              message: 'Network error. Please check your connection.',
              details: {},
            } as ApiError
          }
        } else {
          console.error('❌ Token refresh failed - no new token received')
        }
      } else {
        console.error('❌ No token available to refresh')
      }
      // If no token, let handleResponse handle it (will throw error for mutations)
    }

    return this.handleResponse<T>(response, config.method)
  }

  async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    console.log('📥 API Client GET called:', { endpoint, requiresAuth })
    
    try {
      // Use the same getAuthHeaders method that POST uses (which works!)
    // For GET requests, don't include Content-Type header (no body)
      console.log('📥 GET: About to call getAuthHeaders with requiresAuth=', requiresAuth)
      const headers = requiresAuth ? await this.getAuthHeaders(false, requiresAuth) : {}
      console.log('📥 GET: getAuthHeaders returned:', {
        hasHeaders: !!headers,
        headerKeys: Object.keys(headers),
        hasAuth: !!headers['Authorization']
      })
    
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'GET',
        headers,
      },
      requiresAuth
    )
    } catch (error) {
      console.error('📥 GET: Error in get method:', error)
      throw error
    }
  }

  async post<T>(
    endpoint: string,
    data?: any,
    requiresAuth: boolean = true,
    isFormData: boolean = false
  ): Promise<T> {
    console.log('📤 API Client POST called:', { endpoint, requiresAuth, isFormData })
    
    try {
      const headers = requiresAuth ? await this.getAuthHeaders(!isFormData, requiresAuth) : (isFormData ? {} : { 'Content-Type': 'application/json' })
      
      console.log('📤 POST: getAuthHeaders returned:', {
        hasHeaders: !!headers,
        headerKeys: Object.keys(headers),
        hasAuth: !!headers['Authorization'],
        hasContentType: !!headers['Content-Type']
      })
    
    if (isFormData) {
      delete headers['Content-Type'] // Let browser set boundary for FormData
    }

    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined)

    // Use longer timeout for auth endpoints (90 seconds) to handle Render.com cold starts
    const isAuthEndpoint = endpoint.includes('/auth/')
    const timeout = isAuthEndpoint ? 90000 : 30000

    return this.makeRequest<T>(
      endpoint,
      {
        method: 'POST',
        headers,
        body,
      },
      requiresAuth,
      0,
      timeout
    )
    } catch (error) {
      console.error('📤 POST: Error in post method:', error)
      throw error
    }
  }

  async put<T>(
    endpoint: string,
    data?: any,
    requiresAuth: boolean = true,
    isFormData: boolean = false
  ): Promise<T> {
    const headers = requiresAuth ? await this.getAuthHeaders(true, requiresAuth) : { 'Content-Type': 'application/json' }
    
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
    const headers = requiresAuth ? await this.getAuthHeaders(true, requiresAuth) : { 'Content-Type': 'application/json' }
    
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
    const headers = requiresAuth ? await this.getAuthHeaders(true, requiresAuth) : { 'Content-Type': 'application/json' }
    
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
