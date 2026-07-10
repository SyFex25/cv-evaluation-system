/**
 * File: src/components/AnalyzeForm.tsx
 * Module: Components
 * Responsibility: Renders provider selection and CV upload controls
 */

import type { FormEvent } from 'react'
import type { ProviderName } from '@/types/api'

const providerOptions: Array<{ label: string; value: ProviderName }> = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Claude', value: 'anthropic' },
  { label: 'Grok', value: 'xai' },
]

type AnalyzeFormProps = {
  file: File | null
  provider: ProviderName
  isAuthenticated: boolean
  isAnalyzing: boolean
  onFileChange: (file: File | null) => void
  onProviderChange: (provider: ProviderName) => void
  onAnalyzeSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AnalyzeForm({
  file,
  provider,
  isAuthenticated,
  isAnalyzing,
  onFileChange,
  onProviderChange,
  onAnalyzeSubmit,
}: AnalyzeFormProps) {
  return (
    <form className="analysis-form" onSubmit={onAnalyzeSubmit}>
      <label>
        Penyedia AI
        <select value={provider} onChange={(event) => onProviderChange(event.target.value as ProviderName)} disabled={!isAuthenticated}>
          {providerOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="file-input">
        Berkas CV
        <input
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          disabled={!isAuthenticated}
        />
        <span>{file?.name ?? 'Belum ada berkas dipilih'}</span>
      </label>

      <button type="submit" className="primary-button" disabled={!isAuthenticated || isAnalyzing}>
        {isAnalyzing ? 'Menganalisis...' : 'Analisis CV'}
      </button>
    </form>
  )
}