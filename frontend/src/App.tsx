/**
 * File: src/App.tsx
 * Module: Application
 * Responsibility: Coordinates authentication and top-level page selection
 */

import { useState } from 'react'
import './App.css'
import { AppHeader } from '@/components/AppHeader'
import { SidePanel } from '@/components/SidePanel'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Evaluation } from '@/pages/Evaluation'
import { Login } from '@/pages/Login'
import { Settings } from '@/pages/Settings'
import type { LoginCredentials } from '@/services/authService'
import type { AppPage } from '@/types/navigation'

function App() {
  const [activePage, setActivePage] = useState<AppPage>('evaluation')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()

  async function handleAuthSubmit(credentials: LoginCredentials) {
    await auth.login(credentials)
  }

  async function handleLogout() {
    await auth.logout()
    setActivePage('evaluation')
    setMobileSidebarOpen(false)
  }

  if (!auth.isAuthenticated) {
    return (
      <Login
        email={auth.email}
        password={auth.password}
        remember={auth.remember}
        isAuthenticating={auth.isAuthenticating}
        error={auth.authError}
        fieldErrors={auth.fieldErrors}
        onEmailChange={auth.setEmail}
        onPasswordChange={auth.setPassword}
        onRememberChange={auth.setRemember}
        onSubmit={handleAuthSubmit}
      />
    )
  }

  return (
    <main className="app-shell">
      <SidePanel
        activePage={activePage}
        mobileOpen={mobileSidebarOpen}
        onLogout={handleLogout}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onPageChange={setActivePage}
      />

      <div className="app-content">
        <AppHeader
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
          onThemeToggle={toggleTheme}
          theme={theme}
          user={auth.user}
        />

        {activePage === 'evaluation' && <Evaluation />}
        {activePage === 'settings' && <Settings user={auth.user} />}
      </div>
    </main>
  )
}

export default App
