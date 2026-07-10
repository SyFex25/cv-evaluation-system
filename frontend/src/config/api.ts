/**
 * File: src/config/api.ts
 * Module: Config
 * Responsibility: Exposes frontend API configuration from Vite environment variables
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error('Konfigurasi VITE_API_BASE_URL belum tersedia.')
  }

  return API_BASE_URL
}