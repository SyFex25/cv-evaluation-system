/**
 * File: src/components/AuthPanel.tsx
 * Module: Components
 * Responsibility: Renders authenticated user context, page navigation, and session controls
 */

import logo from '@/assets/branding/logo-horizontal.png'
import type { AppPage } from '@/types/navigation'
import type { User } from '@/types/api'

type AuthPanelProps = {
  activePage: AppPage
  user: User | null
  onLogout: () => void
  onPageChange: (page: AppPage) => void
}

export function AuthPanel({ activePage, user, onLogout, onPageChange }: AuthPanelProps) {
  return (
    <aside className="auth-panel">
      <img className="brand-logo" src={logo} alt="Sistem Evaluasi CV" />
      <div>
        <p className="eyebrow">Sumber Daya Manusia</p>
        <h1>Sistem Evaluasi CV</h1>
        <p className="lede">Unggah CV kandidat, pilih penyedia analisis, dan tinjau laporan evaluasi terstruktur.</p>
      </div>

      <nav className="side-nav" aria-label="Navigasi utama">
        <button
          type="button"
          className={activePage === 'dashboard' ? 'active' : ''}
          onClick={() => onPageChange('dashboard')}
        >
          Dasbor
        </button>
        <button
          type="button"
          className={activePage === 'settings' ? 'active' : ''}
          onClick={() => onPageChange('settings')}
        >
          Pengaturan
        </button>
      </nav>

      <section className="session-card" aria-label="Sesi saat ini">
        <span>Masuk sebagai</span>
        <strong>{user?.full_name || user?.email}</strong>
        <button type="button" className="secondary-button" onClick={onLogout}>
          Keluar
        </button>
      </section>
    </aside>
  )
}