/**
 * File: src/components/EvaluationReport.tsx
 * Module: Components
 * Responsibility: Renders the structured CV evaluation report returned by the backend
 */

import type { AnalyzeResponse } from '@/types/api'
import { ReportList } from '@/components/ReportList'

type EvaluationReportProps = {
  result: AnalyzeResponse | null
}

export function EvaluationReport({ result }: EvaluationReportProps) {
  if (!result) {
    return (
      <section className="empty-state">
        <h3>Belum ada laporan</h3>
        <p>Masuk, unggah CV PDF atau DOCX berbasis teks, lalu jalankan analisis.</p>
      </section>
    )
  }

  return (
    <section className="report" aria-label="Laporan evaluasi">
      <div className="score-block">
        <span>Skor keseluruhan</span>
        <strong>{result.report.overall_score}</strong>
        <small>{result.provider}</small>
      </div>
      <div className="report-summary">
        <h3>Ringkasan</h3>
        <p>{result.report.summary}</p>
      </div>
      <div className="report-grid">
        <ReportList title="Kekuatan" items={result.report.strengths} />
        <ReportList title="Kelemahan" items={result.report.weaknesses} />
      </div>
      <div className="skills-table">
        <h3>Keterampilan</h3>
        {result.report.skills.map((skill) => (
          <div className="skill-row" key={`${skill.name}-${skill.score}`}>
            <span>{skill.name}</span>
            <strong>{skill.score}</strong>
            <p>{skill.evidence}</p>
          </div>
        ))}
      </div>
      <div className="recommendation">
        <h3>Rekomendasi</h3>
        <p>{result.report.recommendation}</p>
      </div>
    </section>
  )
}