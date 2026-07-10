/**
 * File: src/services/backendService.ts
 * Module: Services
 * Responsibility: Handles non-authentication feature communication with the FastAPI backend
 */

import { AxiosError } from 'axios'
import { apiClient } from '@/services/apiClient'
import type { AnalyzeResponse, ProviderName } from '@/types/api'

export async function analyzeCv(file: File, provider: ProviderName): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('provider', provider)

  try {
    // The httpOnly auth cookie is attached automatically by the shared client.
    const response = await apiClient.post<AnalyzeResponse>('/analyze', formData)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail

    if (typeof detail === 'string') {
      return detail
    }
  }

  return 'Permintaan gagal diproses.'
}