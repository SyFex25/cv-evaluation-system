/**
 * File: src/components/AppHeader.tsx
 * Module: Components
 * Responsibility: Renders the fixed application header for authenticated pages
 */

import { Menu, Moon, Sun, UserRound } from 'lucide-react'
import type { User } from '@/types/api'

type AppHeaderProps = {
  onMobileMenuOpen: () => void
  onThemeToggle: () => void
  theme: 'light' | 'dark'
  user: User | null
}

export function AppHeader({ onMobileMenuOpen, onThemeToggle, theme, user }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-title">
        <button type="button" className="mobile-menu-button" onClick={onMobileMenuOpen} aria-label="Buka navigasi">
          <Menu size={20} aria-hidden="true" />
        </button>
        <div className="app-header-copy">
          <h1>CV Evaluation System</h1>
          <p>Biro HR</p>
        </div>
      </div>

      <div className="app-header-actions">
        <div className="app-header-user">
          <strong>{user?.full_name || 'Departemen HR'}</strong>
          <span>{user?.email || 'Pengguna Internal'}</span>
        </div>
        <span className="app-header-avatar" aria-hidden="true">
          <UserRound size={18} />
        </span>
        <button
          type="button"
          className="app-header-theme-toggle"
          onClick={onThemeToggle}
          aria-label={theme === 'dark' ? 'Aktifkan tampilan terang' : 'Aktifkan tampilan gelap'}
        >
          {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}