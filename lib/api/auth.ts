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
    return apiClient.post<RegisterResponse>('/auth/register', data, false)
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data, false)
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    return apiClient.post<VerifyOTPResponse>('/auth/verify-otp', data, false)
  }

  async resendVerification(data: ResendVerificationRequest): Promise<ResendVerificationResponse> {
    return apiClient.post<ResendVerificationResponse>('/auth/resend-verification', data, false)
  }

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile')
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return apiClient.patch<UpdateProfileResponse>('/auth/profile', data)
  }

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return apiClient.post<ChangePasswordResponse>('/auth/change-password', data)
  }

  async passwordResetRequest(data: PasswordResetRequest): Promise<PasswordResetResponse> {
    return apiClient.post<PasswordResetResponse>('/auth/password-reset-request', data, false)
  }

  async passwordResetConfirm(data: PasswordResetConfirmRequest): Promise<PasswordResetConfirmResponse> {
    return apiClient.post<PasswordResetConfirmResponse>('/auth/password-reset-confirm', data, false)
  }

  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>('/auth/logout', data)
  }

  async deleteAccount(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>('/auth/delete-account')
  }

  async googleAuth(data: GoogleAuthRequest): Promise<GoogleAuthResponse> {
    return apiClient.post<GoogleAuthResponse>('/auth/google', data, false)
  }

  async refreshToken(data: TokenRefreshRequest): Promise<TokenRefreshResponse> {
    return apiClient.post<TokenRefreshResponse>('/auth/token/refresh', data, false)
  }
}

export const authService = new AuthService()

