/**
 * File: src/components/SidePanel.tsx
 * Module: Components
 * Responsibility: Renders authenticated navigation and account actions
 */

import type { ReactNode } from 'react'
import { FileText, LogOut, Settings, X } from 'lucide-react'
import logo from '@/assets/branding/logo-horizontal.png'
import type { AppPage } from '@/types/navigation'

type NavItem = {
  id: AppPage
  label: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  { id: 'evaluation', label: 'Evaluasi CV', icon: <FileText size={18} aria-hidden="true" /> },
  { id: 'settings', label: 'Pengaturan', icon: <Settings size={18} aria-hidden="true" /> },
]

type SidePanelProps = {
  activePage: AppPage
  mobileOpen: boolean
  onLogout: () => void
  onMobileClose: () => void
  onPageChange: (page: AppPage) => void
}

export function SidePanel({ activePage, mobileOpen, onLogout, onMobileClose, onPageChange }: SidePanelProps) {
  function handleNavigate(page: AppPage) {
    onPageChange(page)
    onMobileClose()
  }

  function handleLogout() {
    onLogout()
    onMobileClose()
  }

  const content = (
    <div className="sidebar-content">
      <div className="sidebar-logo-row">
        <img className="sidebar-logo" src={logo} alt="Sistem Evaluasi CV" />
        <button type="button" className="sidebar-close-button" onClick={onMobileClose} aria-label="Tutup navigasi">
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Navigasi utama">
        <p>Menu Utama</p>
        <ul>
          {navItems.map((item) => {
            const active = activePage === item.id

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={active ? 'active' : ''}
                  onClick={() => handleNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-label">{item.label}</span>
                  {active && <span className="sidebar-active-dot" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <button type="button" className="side-panel-logout" onClick={handleLogout}>
        <LogOut size={18} aria-hidden="true" />
        <span>Keluar</span>
      </button>
    </div>
  )

  return (
    <>
      <aside className="sidebar-desktop">{content}</aside>

      {mobileOpen && (
        <div className="sidebar-mobile-layer">
          <button type="button" className="sidebar-backdrop" onClick={onMobileClose} aria-label="Tutup navigasi" />
          <aside className="sidebar-mobile-panel">{content}</aside>
        </div>
      )}
    </>
  )
}
