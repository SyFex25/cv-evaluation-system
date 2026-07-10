/**
 * File: src/pages/Login.tsx
 * Module: Pages
 * Responsibility: Renders the login page for unauthenticated users
 */

import type { FormEvent } from 'react'
import { AlertCircle, ArrowRight, Mail } from 'lucide-react'
import logo from '@/assets/branding/logo-horizontal.png'
import towerBackground from '@/assets/branding/calvin_tower_bg.png'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import type { LoginCredentials } from '@/services/authService'

type LoginProps = {
  email: string
  password: string
  remember: boolean
  isAuthenticating: boolean
  error: string
  fieldErrors: Partial<Record<keyof LoginCredentials, string>>
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onRememberChange: (remember: boolean) => void
  onSubmit: (credentials: LoginCredentials) => void
}

export function Login({
  email,
  password,
  remember,
  isAuthenticating,
  error,
  fieldErrors,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
}: LoginProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <main className="login-page">
      <div className="login-columns">
        <section className="login-visual" aria-label="Kampus Calvin Institute of Technology">
          <img className="login-background" src={towerBackground} alt="" aria-hidden="true" />
          <div className="login-overlay" />
          <div className="login-visual-copy">
            <p className="login-visual-eyebrow">Selamat Datang</p>
            <p className="login-visual-title">Sistem Evaluasi CV</p>
            <p className="login-visual-subtitle">
              Platform internal Calvin Institute of Technology untuk menilai dan menyaring kandidat secara efisien.
            </p>
          </div>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-content">
            <img className="login-card-logo" src={logo} alt="Calvin Institute of Technology" />

            <div className="login-heading">
              <h1 id="login-title">Masuk</h1>
              <p>Gunakan akun institusi untuk mengakses sistem internal.</p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="Masukkan email institusi"
                autoComplete="email"
                autoFocus
                disabled={isAuthenticating}
                error={fieldErrors.email}
                icon={<Mail size={16} aria-hidden="true" />}
              />

              <PasswordInput
                label="Kata Sandi"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
                disabled={isAuthenticating}
                error={fieldErrors.password}
              />

              <div className="login-options">
                <Checkbox
                  label="Ingat Saya"
                  checked={remember}
                  disabled={isAuthenticating}
                  onChange={(event) => onRememberChange(event.target.checked)}
                />
              </div>

              <Button type="submit" icon={<ArrowRight size={16} aria-hidden="true" />} isLoading={isAuthenticating}>
                {isAuthenticating ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
