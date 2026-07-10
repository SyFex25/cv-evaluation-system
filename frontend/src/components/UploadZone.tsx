/**
 * File: src/components/UploadZone.tsx
 * Module: Components
 * Responsibility: Renders drag-and-drop CV upload controls and selected-file summary
 */

import { useRef, useState } from 'react'
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react'

export type UploadedFile = {
  name: string
  size: string
  uploadedAt: string
  rawFile: File
}

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatUploadedAt(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function UploadZone({ onFileSelected }: { onFileSelected: (file: UploadedFile) => void }) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | undefined) {
    if (!file) {
      return
    }

    onFileSelected({
      name: file.name,
      size: formatSize(file.size),
      uploadedAt: formatUploadedAt(new Date()),
      rawFile: file,
    })
  }

  return (
    <div
      className={dragOver ? 'upload-zone drag-over' : 'upload-zone'}
      onClick={() => inputRef.current?.click()}
      onDragLeave={() => setDragOver(false)}
      onDragOver={(event) => {
        event.preventDefault()
        setDragOver(true)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        handleFile(event.dataTransfer.files?.[0])
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
    >
      <div className="upload-zone-content">
        <span className="upload-zone-icon">
          <UploadCloud size={28} aria-hidden="true" />
        </span>

        <h3>{dragOver ? 'Lepaskan CV di sini' : 'Tarik dan letakkan CV di sini'}</h3>
        <p>Klik area ini untuk memilih CV dari perangkat. Mendukung drag & drop.</p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => handleFile(event.target.files?.[0] ?? undefined)}
        />

        <div className="upload-zone-notes" aria-label="Ketentuan berkas">
          <span>
            <CheckCircle2 size={13} aria-hidden="true" /> PDF
          </span>
          <span>
            <CheckCircle2 size={13} aria-hidden="true" /> DOCX
          </span>
          <span>
            <FileText size={13} aria-hidden="true" /> Maksimal 10 MB
          </span>
          <span>
            <FileText size={13} aria-hidden="true" /> Drag & drop
          </span>
        </div>
      </div>
    </div>
  )
}

export function UploadedFilePill({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  return (
    <div className="uploaded-file-pill">
      <span className="uploaded-file-icon">
        <FileText size={20} aria-hidden="true" />
      </span>
      <div>
        <p>{file.name}</p>
        <span>
          {file.size} - Diunggah {file.uploadedAt}
        </span>
      </div>
      <button type="button" onClick={onRemove} aria-label="Hapus berkas">
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  )
}
