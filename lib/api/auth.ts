import { apiClient } from './client'

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirm: string
  mobile?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  height?: number
  weight?: number
}

export interface RegisterResponse {
  success: boolean
  message: string
  email: string
  requiresVerification: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  access: string
  refresh: string
  user: User
}

export interface User {
  publicId: string
  email: string
  firstName: string
  lastName: string
  mobile?: string
  dateOfBirth?: string
  gender?: string
  bloodType?: string
  height?: number
  weight?: number
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
}

export interface VerifyOTPResponse {
  success: boolean
  message: string
  access: string
  refresh: string
  user: User
}

export interface ResendVerificationRequest {
  email: string
}

export interface ResendVerificationResponse {
  success: boolean
  message: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  mobile?: string
  dateOfBirth?: string
  gender?: string
  bloodType?: string
  height?: number
  weight?: number
}

export interface UpdateProfileResponse {
  message: string
  user: User
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  newPasswordConfirm: string
}

export interface ChangePasswordResponse {
  message: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetResponse {
  success: boolean
  message: string
}

export interface PasswordResetConfirmRequest {
  token: string
  newPassword: string
  newPasswordConfirm: string
}

export interface PasswordResetConfirmResponse {
  message: string
}

export interface LogoutRequest {
  refresh: string
}

export interface LogoutResponse {
  message: string
}

export interface GoogleAuthRequest {
  access_token: string
}

export interface GoogleAuthResponse {
  success: boolean
  message: string
  access: string
  refresh: string
  user: User
}

export interface TokenRefreshRequest {
  refresh: string
}

export interface TokenRefreshResponse {
  access: string
}

export class AuthService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // Transform camelCase to snake_case for backend
    const transformedData: any = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      password_confirm: data.passwordConfirm,
      mobile: data.mobile,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      blood_type: data.bloodType,
      height: data.height,
      weight: data.weight,
    }
    
    // Remove undefined fields
    Object.keys(transformedData).forEach(key => {
      if (transformedData[key] === undefined) {
        delete transformedData[key]
      }
    })
    
    console.log('📤 Register data transformed:', {
      original: { firstName: data.firstName, lastName: data.lastName, email: data.email },
      transformed: { first_name: transformedData.first_name, last_name: transformedData.last_name, email: transformedData.email }
    })
    
    return apiClient.post<RegisterResponse>('/auth/register/', transformedData, false)
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<any>('/auth/login/', data, false)
    // Transform snake_case to camelCase for user object
    if (response.user) {
      response.user = {
        publicId: response.user.public_id || response.user.publicId,
        email: response.user.email,
        firstName: response.user.first_name || response.user.firstName,
        lastName: response.user.last_name || response.user.lastName,
        mobile: response.user.mobile,
        dateOfBirth: response.user.date_of_birth || response.user.dateOfBirth,
        gender: response.user.gender,
        bloodType: response.user.blood_type || response.user.bloodType,
        height: response.user.height,
        weight: response.user.weight,
        isEmailVerified: response.user.is_email_verified || response.user.isEmailVerified,
        createdAt: response.user.created_at || response.user.createdAt,
        updatedAt: response.user.updated_at || response.user.updatedAt,
      } as User
    }
    return response as LoginResponse
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    const response = await apiClient.post<any>('/auth/verify-otp/', data, false)
    // Transform snake_case to camelCase for user object
    if (response.user) {
      response.user = {
        publicId: response.user.public_id || response.user.publicId,
        email: response.user.email,
        firstName: response.user.first_name || response.user.firstName,
        lastName: response.user.last_name || response.user.lastName,
        mobile: response.user.mobile,
        dateOfBirth: response.user.date_of_birth || response.user.dateOfBirth,
        gender: response.user.gender,
        bloodType: response.user.blood_type || response.user.bloodType,
        height: response.user.height,
        weight: response.user.weight,
        isEmailVerified: response.user.is_email_verified || response.user.isEmailVerified,
        createdAt: response.user.created_at || response.user.createdAt,
        updatedAt: response.user.updated_at || response.user.updatedAt,
      } as User
    }
    return response as VerifyOTPResponse
  }

  async resendVerification(data: ResendVerificationRequest): Promise<ResendVerificationResponse> {
    return apiClient.post<ResendVerificationResponse>('/auth/resend-verification/', data, false)
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<any>('/auth/profile/')
    // Transform snake_case to camelCase
    return {
      publicId: response.public_id || response.publicId,
      email: response.email,
      firstName: response.first_name || response.firstName,
      lastName: response.last_name || response.lastName,
      mobile: response.mobile,
      dateOfBirth: response.date_of_birth || response.dateOfBirth,
      gender: response.gender,
      bloodType: response.blood_type || response.bloodType,
      height: response.height,
      weight: response.weight,
      isEmailVerified: response.is_email_verified || response.isEmailVerified,
      createdAt: response.created_at || response.createdAt,
      updatedAt: response.updated_at || response.updatedAt,
    } as User
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await apiClient.patch<any>('/auth/profile/', data)
    // Transform snake_case to camelCase for user object
    if (response.user) {
      response.user = {
        publicId: response.user.public_id || response.user.publicId,
        email: response.user.email,
        firstName: response.user.first_name || response.user.firstName,
        lastName: response.user.last_name || response.user.lastName,
        mobile: response.user.mobile,
        dateOfBirth: response.user.date_of_birth || response.user.dateOfBirth,
        gender: response.user.gender,
        bloodType: response.user.blood_type || response.user.bloodType,
        height: response.user.height,
        weight: response.user.weight,
        isEmailVerified: response.user.is_email_verified || response.user.isEmailVerified,
        createdAt: response.user.created_at || response.user.createdAt,
        updatedAt: response.user.updated_at || response.user.updatedAt,
      } as User
    }
    return response as UpdateProfileResponse
  }

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return apiClient.post<ChangePasswordResponse>('/auth/change-password/', data)
  }

  async passwordResetRequest(data: PasswordResetRequest): Promise<PasswordResetResponse> {
    return apiClient.post<PasswordResetResponse>('/auth/password-reset-request/', data, false)
  }

  async passwordResetConfirm(data: PasswordResetConfirmRequest): Promise<PasswordResetConfirmResponse> {
    return apiClient.post<PasswordResetConfirmResponse>('/auth/password-reset-confirm/', data, false)
  }

  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>('/auth/logout/', data)
  }

  async deleteAccount(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>('/auth/delete-account/')
  }

  async googleAuth(data: GoogleAuthRequest): Promise<GoogleAuthResponse> {
    const response = await apiClient.post<any>('/auth/google/', data, false)
    // Transform snake_case to camelCase for user object
    if (response.user) {
      response.user = {
        publicId: response.user.public_id || response.user.publicId,
        email: response.user.email,
        firstName: response.user.first_name || response.user.firstName,
        lastName: response.user.last_name || response.user.lastName,
        mobile: response.user.mobile,
        dateOfBirth: response.user.date_of_birth || response.user.dateOfBirth,
        gender: response.user.gender,
        bloodType: response.user.blood_type || response.user.bloodType,
        height: response.user.height,
        weight: response.user.weight,
        isEmailVerified: response.user.is_email_verified || response.user.isEmailVerified,
        createdAt: response.user.created_at || response.user.createdAt,
        updatedAt: response.user.updated_at || response.user.updatedAt,
      } as User
    }
    return response as GoogleAuthResponse
  }

  async refreshToken(data: TokenRefreshRequest): Promise<TokenRefreshResponse> {
    return apiClient.post<TokenRefreshResponse>('/auth/token/refresh/', data, false)
  }
}

export const authService = new AuthService()

