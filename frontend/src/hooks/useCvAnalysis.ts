/**
 * File: src/hooks/useCvAnalysis.ts
 * Module: Hooks
 * Responsibility: Manages CV upload and non-UI analysis behavior
 */

import { useState } from 'react'
import { analyzeCv } from '@/services/backendService'
import type { AnalyzeResponse } from '@/types/api'

export function useCvAnalysis() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [analysisError, setAnalysisError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  async function submitAnalysis(jobDescription: string) {
    setAnalysisError('')
    setResult(null)

    if (!jobDescription.trim()) {
      setAnalysisError('Isi deskripsi lowongan terlebih dahulu agar kecocokan kandidat dapat dinilai.')
      return
    }

    if (!file) {
      setAnalysisError('Unggah CV dalam format PDF atau DOCX terlebih dahulu.')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await analyzeCv(file, jobDescription.trim())
      setResult(response)
    } catch (caughtError) {
      setAnalysisError(caughtError instanceof Error ? caughtError.message : 'Analisis kecocokan kandidat gagal.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  function clearResult() {
    setResult(null)
  }

  return {
    analysisError,
    file,
    isAnalyzing,
    result,
    clearResult,
    setAnalysisError,
    setFile,
    submitAnalysis,
  }
}
