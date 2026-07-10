/**
 * File: src/services/apiClient.ts
 * Module: Services
 * Responsibility: Creates the shared Axios client for FastAPI communication
 */

import axios from 'axios'
import { getApiBaseUrl } from '@/config/api'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  // Send and receive the httpOnly auth cookie on every request.
  withCredentials: true,
})