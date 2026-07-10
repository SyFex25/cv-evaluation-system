/**
 * File: src/hooks/useCvAnalysis.ts
 * Module: Hooks
 * Responsibility: Manages CV upload, provider selection, and non-UI analysis behavior
 */

import { useState } from 'react'
import { analyzeCv } from '@/services/backendService'
import type { AnalyzeResponse, ProviderName } from '@/types/api'

export function useCvAnalysis() {
  const [provider, setProvider] = useState<ProviderName>('openai')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [analysisError, setAnalysisError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  async function submitAnalysis() {
    setAnalysisError('')
    setResult(null)

    if (!file) {
      setAnalysisError('Unggah CV dalam format PDF atau DOCX terlebih dahulu.')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await analyzeCv(file, provider)
      setResult(response)
    } catch (caughtError) {
      setAnalysisError(caughtError instanceof Error ? caughtError.message : 'Analisis CV gagal.')
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
    provider,
    result,
    clearResult,
    setAnalysisError,
    setFile,
    setProvider,
    submitAnalysis,
  }
}