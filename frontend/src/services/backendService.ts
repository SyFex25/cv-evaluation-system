/**
 * File: src/services/backendService.ts
 * Module: Services
 * Responsibility: Handles non-authentication feature communication with the FastAPI backend
 */

import { AxiosError } from 'axios'
import { apiClient } from '@/services/apiClient'
import type { AnalyzeResponse, ProviderName } from '@/types/api'

const apiErrorTranslations: Record<string, string> = {
  'Only PDF and DOCX files are supported.': 'Hanya berkas PDF dan DOCX yang didukung.',
  'Uploaded file is too large.': 'Ukuran berkas terlalu besar. Maksimal 10 MB.',
  'Could not extract text from the uploaded CV.': 'Teks CV tidak dapat diekstrak. Gunakan PDF berbasis teks atau DOCX.',
  'Unsupported file type.': 'Jenis berkas tidak didukung.',
  'Please upload a text-based PDF or DOCX file.': 'Unggah PDF berbasis teks atau berkas DOCX.',
  'Job description is required.': 'Deskripsi lowongan wajib diisi.',
}

export async function analyzeCv(file: File, jobDescription: string, provider?: ProviderName): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('job_description', jobDescription)

  if (provider) {
    formData.append('provider', provider)
  }

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
      return apiErrorTranslations[detail] ?? detail
    }
  }

  return 'Permintaan gagal diproses.'
}
