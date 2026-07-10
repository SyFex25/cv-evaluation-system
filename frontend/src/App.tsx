/**
 * File: src/App.tsx
 * Module: Application
 * Responsibility: Coordinates authentication and top-level page selection
 */

import { useState } from 'react'
import './App.css'
import { AuthPanel } from '@/components/AuthPanel'
import { useAuth } from '@/hooks/useAuth'
import { Dashboard } from '@/pages/Dashboard'
import { Login } from '@/pages/Login'
import { Settings } from '@/pages/Settings'
import type { LoginCredentials } from '@/services/authService'
import type { AppPage } from '@/types/navigation'

function App() {
  const [activePage, setActivePage] = useState<AppPage>('dashboard')
  const auth = useAuth()

  async function handleAuthSubmit(credentials: LoginCredentials) {
    await auth.login(credentials)
  }

  async function handleLogout() {
    await auth.logout()
    setActivePage('dashboard')
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
      <AuthPanel activePage={activePage} user={auth.user} onLogout={handleLogout} onPageChange={setActivePage} />

      {activePage === 'dashboard' ? <Dashboard /> : <Settings user={auth.user} />}
    </main>
  )
}

export default App
