/**
 * File: src/pages/Evaluation.tsx
 * Module: Pages
 * Responsibility: Renders the dedicated job-context, CV upload, analysis, and evaluation report workflow
 */

import { useState } from 'react'
import { AlertCircle, BriefcaseBusiness, ChevronRight, ClipboardList, FileText, Search, Wand2 } from 'lucide-react'
import { EvaluationReport } from '@/components/EvaluationReport'
import { UploadZone, UploadedFilePill, type UploadedFile } from '@/components/UploadZone'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useCvAnalysis } from '@/hooks/useCvAnalysis'

const exampleJobDescriptionTemplate = `Posisi:
Frontend Developer

Kandidat diharapkan memiliki pengalaman React, TypeScript, REST API, Git, komunikasi yang baik, dan mampu bekerja dalam tim.`

const evaluationSteps = [
  {
    step: '01',
    title: 'Isi deskripsi lowongan',
    description: 'Tuliskan posisi, tanggung jawab utama, dan kriteria kandidat yang diharapkan.',
  },
  {
    step: '02',
    title: 'Unggah CV kandidat',
    description: 'Gunakan berkas PDF atau DOCX berbasis teks dengan ukuran maksimal 10 MB.',
  },
  {
    step: '03',
    title: 'Tinjau rekomendasi',
    description: 'Gunakan skor kecocokan, ringkasan, kelebihan, perhatian, dan rekomendasi sebagai bahan keputusan HR.',
  },
]

export function Evaluation() {
  const [jobDescription, setJobDescription] = useState('')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const analysis = useCvAnalysis()
  const hasReport = Boolean(analysis.result)
  const canAnalyze = Boolean(uploadedFile && jobDescription.trim()) && !analysis.isAnalyzing

  function handleFileSelected(file: UploadedFile) {
    setUploadedFile(file)
    analysis.setFile(file.rawFile)
    analysis.clearResult()
    analysis.setAnalysisError('')
  }

  function handleRemoveFile() {
    setUploadedFile(null)
    analysis.setFile(null)
    analysis.clearResult()
    analysis.setAnalysisError('')
  }

  function handleJobDescriptionChange(value: string) {
    setJobDescription(value)
    analysis.clearResult()
    analysis.setAnalysisError('')
  }

  function handleUseExampleTemplate() {
    handleJobDescriptionChange(exampleJobDescriptionTemplate)
  }

  async function handleAnalyze() {
    await analysis.submitAnalysis(jobDescription)
  }

  return (
    <section className="dashboard-page evaluation-page" aria-labelledby="evaluation-title">
      <header className="dashboard-header evaluation-header">
        <div>
          <div className="dashboard-breadcrumb" aria-label="Lokasi halaman">
            <span>Human Resources</span>
            <ChevronRight size={13} aria-hidden="true" />
            <span>Evaluasi CV</span>
          </div>
          <h1 id="evaluation-title">Evaluasi Kecocokan Kandidat</h1>
          <p className="dashboard-lede">Bandingkan CV kandidat dengan kebutuhan posisi yang sedang dibuka.</p>
        </div>
      </header>

      <div className="evaluation-stack">
        <Card className="evaluation-flow-card evaluation-work-card">
          <div className="evaluation-card-heading">
            <span className="card-icon card-icon-maroon">
              <ClipboardList size={17} aria-hidden="true" />
            </span>
            <div>
              <h2>Alur Evaluasi</h2>
              <p>Ikuti langkah berikut untuk menilai kecocokan kandidat dengan lowongan.</p>
            </div>
          </div>

          <ol className="evaluation-steps evaluation-steps-compact">
            {evaluationSteps.map((item) => (
              <li key={item.step}>
                <span className="step-number">{item.step}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="evaluation-job-card evaluation-work-card">
          <div className="evaluation-card-heading evaluation-card-heading-with-action">
            <span className="card-icon card-icon-maroon">
              <BriefcaseBusiness size={17} aria-hidden="true" />
            </span>
            <div>
              <h2>Deskripsi Lowongan</h2>
              <p>Jelaskan posisi yang sedang dibuka beserta kriteria kandidat yang diharapkan.</p>
            </div>
            <Button
              className="evaluation-template-button"
              type="button"
              variant="secondary"
              icon={<Wand2 size={15} aria-hidden="true" />}
              iconPosition="left"
              onClick={handleUseExampleTemplate}
            >
              Gunakan Template Contoh
            </Button>
          </div>

          <label className="sr-only" htmlFor="job-description">
            Deskripsi lowongan
          </label>
          <textarea
            id="job-description"
            className="evaluation-job-textarea"
            value={jobDescription}
            onChange={(event) => handleJobDescriptionChange(event.target.value)}
            placeholder="Tulis posisi, tanggung jawab utama, dan kriteria kandidat yang diharapkan."
            rows={8}
          />
        </Card>

        <Card className="evaluation-upload-card evaluation-work-card">
          <div className="evaluation-card-heading">
            <span className="card-icon card-icon-maroon">
              <FileText size={17} aria-hidden="true" />
            </span>
            <div>
              <h2>Dokumen CV</h2>
              <p>Unggah CV kandidat setelah deskripsi lowongan diisi.</p>
            </div>
          </div>

          {uploadedFile ? (
            <div className="uploaded-file-state evaluation-selected-file">
              <UploadedFilePill file={uploadedFile} onRemove={handleRemoveFile} />
            </div>
          ) : (
            <UploadZone onFileSelected={handleFileSelected} />
          )}

          <div className="evaluation-upload-actions">
            <Button
              className="evaluation-analyze-button"
              type="button"
              disabled={!canAnalyze}
              isLoading={analysis.isAnalyzing}
              icon={<ChevronRight size={15} aria-hidden="true" />}
              iconPosition="right"
              onClick={handleAnalyze}
            >
              <span className="evaluation-button-copy">
                <Search size={16} aria-hidden="true" />
                {analysis.isAnalyzing ? 'Menganalisis Kecocokan' : 'Analisis Kecocokan'}
              </span>
            </Button>
          </div>
        </Card>

        {analysis.analysisError && (
          <div className="error-message evaluation-error" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <p>{analysis.analysisError}</p>
          </div>
        )}

        {hasReport && (
          <div className="evaluation-report-area has-report">
            <EvaluationReport file={uploadedFile} result={analysis.result} />
          </div>
        )}
      </div>
    </section>
  )
}
