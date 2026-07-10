/**
 * File: src/components/AnalyzeForm.tsx
 * Module: Components
 * Responsibility: Renders provider selection and CV upload controls
 */

import type { FormEvent } from 'react'
import { ChevronRight, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { ProviderName } from '@/types/api'

const providerOptions: Array<{ label: string; value: ProviderName }> = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Claude', value: 'anthropic' },
  { label: 'Grok', value: 'xai' },
  { label: 'DeepSeek', value: 'deepseek' },
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
      <div className="analysis-form-header">
        <span className="card-icon card-icon-maroon">
          <Upload size={18} aria-hidden="true" />
        </span>
        <div>
          <h2>Unggah dan Analisis CV</h2>
          <p>Pilih berkas kandidat, lalu jalankan analisis untuk menghasilkan laporan HR.</p>
        </div>
      </div>

      <div className="analysis-fields">
        <label className="analysis-provider-field">
          Penyedia analisis
          <select value={provider} onChange={(event) => onProviderChange(event.target.value as ProviderName)} disabled={!isAuthenticated}>
            {providerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="file-input">
          <span>Berkas CV</span>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            disabled={!isAuthenticated}
          />
          <span className="file-input-display">
            <FileText size={18} aria-hidden="true" />
            <span>{file?.name ?? 'Pilih berkas PDF atau DOCX'}</span>
          </span>
        </label>
      </div>

      <Button
        className="analysis-submit-button"
        type="submit"
        disabled={!isAuthenticated || isAnalyzing}
        isLoading={isAnalyzing}
        icon={<ChevronRight size={16} aria-hidden="true" />}
      >
        {isAnalyzing ? 'Menganalisis CV' : 'Analisis CV'}
      </Button>
    </form>
  )
}
