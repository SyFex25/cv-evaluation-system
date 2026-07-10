/**
 * File: src/services/settingsService.ts
 * Module: Services
 * Responsibility: Retrieves and updates safe runtime settings through the backend
 */

import { apiClient } from '@/services/apiClient'
import type { ProviderName, ProviderRuntimeSettingsUpdate, SettingsResponse } from '@/types/api'

export async function getRuntimeSettings(): Promise<SettingsResponse> {
  const response = await apiClient.get<SettingsResponse>('/settings')
  return response.data
}

export async function updateProviderRuntimeSettings(
  provider: ProviderName,
  payload: ProviderRuntimeSettingsUpdate,
): Promise<SettingsResponse> {
  const response = await apiClient.put<SettingsResponse>(`/settings/providers/${provider}`, payload)
  return response.data
}
