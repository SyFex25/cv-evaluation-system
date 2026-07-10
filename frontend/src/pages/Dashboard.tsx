/**
 * File: src/pages/Dashboard.tsx
 * Module: Pages
 * Responsibility: Renders the CV upload and evaluation workflow
 */

import type { FormEvent } from 'react'
import { AnalyzeForm } from '@/components/AnalyzeForm'
import { EvaluationReport } from '@/components/EvaluationReport'
import { useCvAnalysis } from '@/hooks/useCvAnalysis'

export function Dashboard() {
  const analysis = useCvAnalysis()

  async function handleAnalyzeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await analysis.submitAnalysis()
  }

  return (
    <section className="workspace">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Dasbor</p>
          <h2>Unggah CV</h2>
        </div>
        <span className="status ready">Siap</span>
      </header>

      <AnalyzeForm
        file={analysis.file}
        provider={analysis.provider}
        isAuthenticated
        isAnalyzing={analysis.isAnalyzing}
        onFileChange={analysis.setFile}
        onProviderChange={analysis.setProvider}
        onAnalyzeSubmit={handleAnalyzeSubmit}
      />

      {analysis.analysisError && <p className="error-message">{analysis.analysisError}</p>}

      <EvaluationReport result={analysis.result} />
    </section>
  )
}