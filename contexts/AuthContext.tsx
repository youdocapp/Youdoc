import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, type User, type RegisterRequest, type LoginRequest, type VerifyOTPRequest, type UpdateProfileRequest, type ChangePasswordRequest, type PasswordResetRequest, type PasswordResetConfirmRequest, type GoogleAuthRequest, type ApiError } from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  
  // Auth actions
  register: (data: RegisterRequest) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  login: (data: LoginRequest) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  logout: () => Promise<void>
  verifyOTP: (data: VerifyOTPRequest) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  resendOTP: (email: string) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  
  // Profile actions
  updateProfile: (data: UpdateProfileRequest) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  changePassword: (data: ChangePasswordRequest) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  
  // Password reset
  passwordResetRequest: (data: PasswordResetRequest) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  passwordResetConfirm: (data: PasswordResetConfirmRequest) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  
  // OAuth
  googleAuth: (data: GoogleAuthRequest) => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  
  // Account management
  deleteAccount: () => Promise<{ success: boolean; message?: string; error?: string; details?: Record<string, any> }>
  
  // Token management
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  // Check if user is authenticated on mount
  useEffect(() => {
    initializeAuth()
  }, [])

    const initializeAuth = async () => {
      try {
      const [storedUser, accessToken] = await Promise.all([
        AsyncStorage.getItem(USER_KEY),
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
      ])

      if (storedUser && accessToken) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        // Optionally validate token by fetching profile
        try {
          const profile = await authService.getProfile()
          setUser(profile)
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile))
        } catch (error) {
          // Token might be expired, try to refresh
          const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
          if (refreshToken) {
            try {
              const response = await authService.refreshToken({ refresh: refreshToken })
              await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.access)
              const profile = await authService.getProfile()
              setUser(profile)
              await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile))
            } catch (refreshError) {
              // Refresh failed, clear auth
              await clearAuth()
            }
        } else {
            await clearAuth()
          }
        }
        }
      } catch (error) {
      console.error('❌ Error initializing auth:', error)
      await clearAuth()
      } finally {
      setLoading(false)
    }
  }

  const clearAuth = async () => {
    await Promise.all([
      AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ])
    setUser(null)
    queryClient.clear()
  }

  const storeAuth = async (accessToken: string, refreshToken: string, userData: User) => {
    await Promise.all([
      AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
    ])
    setUser(userData)
  }

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      console.log('📤 Register request:', { email: data.email, firstName: data.firstName, lastName: data.lastName })
      const response = await authService.register(data)
      console.log('📥 Register response:', response)
      if (response.success) {
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'Registration failed' }
    } catch (error: any) {
      console.error('❌ Register error:', error)
      const apiError = error as ApiError
      // Log full error details
      console.error('❌ Register error details:', {
        message: apiError.message,
        details: apiError.details,
        fullError: error,
      })
      return { 
        success: false, 
        error: apiError.message || 'Registration failed',
        message: apiError.message,
        details: apiError.details,
      }
    }
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await authService.login(data)
      console.log('📥 Login response:', response)
      if (response.success) {
        await storeAuth(response.access, response.refresh, response.user)
        // Fetch fresh profile after login to ensure we have all data
        try {
          const profile = await authService.getProfile()
          console.log('📥 Profile after login:', profile)
          setUser(profile)
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile))
        } catch (profileError) {
          console.error('⚠️ Failed to fetch profile after login, using login response user:', profileError)
        }
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'Login failed' }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'Login failed',
        message: apiError.message,
      }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
      if (refreshToken) {
        try {
          await authService.logout({ refresh: refreshToken })
        } catch (error) {
          console.error('Logout API call failed:', error)
        }
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      await clearAuth()
    }
  }, [])

  const verifyOTP = useCallback(async (data: VerifyOTPRequest) => {
    try {
      const response = await authService.verifyOTP(data)
      if (response.success) {
        await storeAuth(response.access, response.refresh, response.user)
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'OTP verification failed' }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'OTP verification failed',
        message: apiError.message,
      }
    }
  }, [])

  const resendOTP = useCallback(async (email: string) => {
    try {
      const response = await authService.resendVerification({ email })
      if (response.success) {
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'Failed to resend OTP' }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'Failed to resend OTP',
        message: apiError.message,
      }
    }
  }, [])

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      const response = await authService.updateProfile(data)
      setUser(response.user)
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user))
      return { success: true, message: response.message }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'Failed to update profile',
        message: apiError.message,
      }
    }
  }, [])

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      const response = await authService.changePassword(data)
      return { success: true, message: response.message }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'Failed to change password',
        message: apiError.message,
      }
    }
  }, [])

  const passwordResetRequest = useCallback(async (data: PasswordResetRequest) => {
    try {
      const response = await authService.passwordResetRequest(data)
      if (response.success) {
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'Failed to send password reset email' }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'Failed to send password reset email',
        message: apiError.message,
      }
    }
  }, [])

  const passwordResetConfirm = useCallback(async (data: PasswordResetConfirmRequest) => {
    try {
      const response = await authService.passwordResetConfirm(data)
      return { success: true, message: response.message }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'Failed to reset password',
        message: apiError.message,
      }
    }
  }, [])

  const googleAuth = useCallback(async (data: GoogleAuthRequest) => {
    try {
      const response = await authService.googleAuth(data)
      if (response.success) {
        await storeAuth(response.access, response.refresh, response.user)
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'Google authentication failed' }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'Google authentication failed',
        message: apiError.message,
      }
    }
  }, [])

  const deleteAccount = useCallback(async () => {
    try {
      const response = await authService.deleteAccount()
      await clearAuth()
      return { success: true, message: response.message }
    } catch (error: any) {
      const apiError = error as ApiError
      return { 
        success: false, 
        error: apiError.message || 'Failed to delete account',
        message: apiError.message,
      }
    }
  }, [])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
      if (!refreshTokenValue) {
        return false
      }

      const response = await authService.refreshToken({ refresh: refreshTokenValue })
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.access)
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      await clearAuth()
      return false
    }
  }, [])

  const value: AuthContextType = {
        user,
        loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
        verifyOTP,
        resendOTP,
    updateProfile,
    changePassword,
    passwordResetRequest,
    passwordResetConfirm,
    googleAuth,
        deleteAccount,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
