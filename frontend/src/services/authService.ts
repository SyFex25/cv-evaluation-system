/**
 * File: src/services/authService.ts
 * Module: Services
 * Responsibility: Handles authentication requests against the FastAPI backend
 */

import { AxiosError } from 'axios'
import { apiClient } from '@/services/apiClient'
import type { AuthResponse, User } from '@/types/api'

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginPayload = LoginCredentials & {
  remember: boolean
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', payload)
      return response.data
    } catch (error) {
      throw new Error(getAuthErrorMessage(error), { cause: error })
    }
  },

  async getCurrentUser(): Promise<User> {
    // Authentication travels in the httpOnly cookie sent automatically by the browser.
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail

    if (typeof detail === 'string') {
      return detail
    }
  }

  return 'Autentikasi gagal. Periksa email dan kata sandi Anda.'
}