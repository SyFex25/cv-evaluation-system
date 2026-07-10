/**
 * File: src/components/EvaluationReport.tsx
 * Module: Components
 * Responsibility: Renders the structured candidate-position compatibility report returned by the backend
 */

import { AlertTriangle, CheckCircle2, ChevronRight, ClipboardList, FileText, Target, XCircle } from 'lucide-react'
import type { UploadedFile } from '@/components/UploadZone'
import type { AnalyzeResponse } from '@/types/api'

type EvaluationReportProps = {
  file?: UploadedFile | null
  result: AnalyzeResponse | null
}

function clampScore(score: number): number {
  return Math.min(Math.max(score, 0), 100)
}

function formatCompatibilityScore(score: number): string {
  const scoreOutOfTen = clampScore(score) / 10
  return scoreOutOfTen.toFixed(1).replace('.0', '')
}

function getCompatibilityTone(score: number) {
  if (score >= 80) {
    return {
      className: 'strong',
      icon: <CheckCircle2 size={17} aria-hidden="true" />,
      label: 'Cocok untuk proses seleksi berikutnya',
      recommendation: 'Layak diproses ke tahap interview',
      description: 'Kandidat memenuhi sebagian besar kriteria utama yang dibutuhkan untuk posisi ini.',
    }
  }

  if (score >= 60) {
    return {
      className: 'moderate',
      icon: <Target size={17} aria-hidden="true" />,
      label: 'Cukup cocok, perlu ditinjau lebih lanjut',
      recommendation: 'Dapat dipertimbangkan dengan verifikasi tambahan',
      description: 'Kandidat memiliki beberapa kecocokan penting, tetapi masih ada area yang perlu dipastikan oleh HR.',
    }
  }

  return {
    className: 'cautious',
    icon: <AlertTriangle size={17} aria-hidden="true" />,
    label: 'Perlu dipertimbangkan kembali',
    recommendation: 'Belum disarankan untuk lanjut tanpa pertimbangan tambahan',
    description: 'Kecocokan kandidat dengan kriteria utama posisi ini masih terbatas berdasarkan informasi yang tersedia.',
  }
}

function getParagraphs(summary: string): string[] {
  return summary
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function EvaluationReport({ file, result }: EvaluationReportProps) {
  if (!result) {
    return (
      <section className="empty-state">
        <span className="empty-state-icon">
          <ClipboardList size={22} aria-hidden="true" />
        </span>
        <div>
          <h3>Belum ada rekomendasi</h3>
          <p>Isi deskripsi lowongan, unggah CV, lalu jalankan analisis kecocokan kandidat.</p>
        </div>
      </section>
    )
  }

  const report = result.report
  const compatibilityTone = getCompatibilityTone(report.overall_score)
  const compatibilityScore = formatCompatibilityScore(report.overall_score)
  const summaryParagraphs = getParagraphs(report.summary)

  return (
    <section className="recruitment-report" aria-label="Rekomendasi rekrutmen kandidat">
      <header className="recruitment-report-header">
        <div className="dashboard-breadcrumb" aria-label="Lokasi laporan">
          <span>Human Resources</span>
          <ChevronRight size={13} aria-hidden="true" />
          <span>Evaluasi CV</span>
          <ChevronRight size={13} aria-hidden="true" />
          <span>Laporan Evaluasi</span>
        </div>

        <div className="recruitment-report-title-row">
          <div>
            <h2>Rekomendasi Kecocokan Kandidat</h2>
            <p>{file ? `${file.name} - Diunggah ${file.uploadedAt}` : 'Hasil evaluasi kandidat'}</p>
          </div>
          <span className={`recommendation-badge ${compatibilityTone.className}`}>
            {compatibilityTone.icon}
            {compatibilityTone.label}
          </span>
        </div>
      </header>

      <div className="recruitment-score-card">
        <div>
          <span className="recruitment-section-eyebrow">Kecocokan Kandidat</span>
          <strong>{compatibilityScore} / 10</strong>
          <p>{compatibilityTone.description}</p>
        </div>
        <span className={`recruitment-score-icon ${compatibilityTone.className}`}>{compatibilityTone.icon}</span>
      </div>

      <div className="recruitment-report-grid">
        <section className="recruitment-section recruitment-summary-section">
          <div className="recruitment-section-heading">
            <span className="recruitment-section-icon maroon">
              <FileText size={17} aria-hidden="true" />
            </span>
            <h3>Ringkasan</h3>
          </div>
          <div className="recruitment-summary-copy">
            {(summaryParagraphs.length ? summaryParagraphs : [report.summary]).map((paragraph, index) => (
              <p key={`${index}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="recruitment-section">
          <div className="recruitment-section-heading">
            <span className="recruitment-section-icon green">
              <CheckCircle2 size={17} aria-hidden="true" />
            </span>
            <h3>Kelebihan Kandidat</h3>
          </div>
          <ul className="recruitment-point-list positive">
            {report.strengths.map((item, index) => (
              <li key={`${index}-${item}`}>
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="recruitment-section">
          <div className="recruitment-section-heading">
            <span className="recruitment-section-icon orange">
              <AlertTriangle size={17} aria-hidden="true" />
            </span>
            <h3>Hal yang Perlu Diperhatikan</h3>
          </div>
          <ul className="recruitment-point-list caution">
            {report.weaknesses.map((item, index) => (
              <li key={`${index}-${item}`}>
                <XCircle size={16} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`recruitment-section recruitment-recommendation ${compatibilityTone.className}`}>
          <div className="recruitment-section-heading">
            <span className="recruitment-section-icon gold">
              <Target size={17} aria-hidden="true" />
            </span>
            <h3>Rekomendasi</h3>
          </div>
          <strong>{compatibilityTone.recommendation}</strong>
          <p>{report.recommendation}</p>
        </section>
      </div>

      <footer className="recruitment-report-footer">
        Rekomendasi ini adalah alat bantu. Keputusan rekrutmen akhir tetap menjadi tanggung jawab HR.
      </footer>
    </section>
  )
}
