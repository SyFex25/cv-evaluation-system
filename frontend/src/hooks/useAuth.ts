/**
 * File: src/hooks/useAuth.ts
 * Module: Hooks
 * Responsibility: Manages authentication state and non-UI login behavior
 */

import { useEffect, useState } from 'react'
import { AuthService } from '@/services/authService'
import type { LoginCredentials } from '@/services/authService'
import type { User } from '@/types/api'

const USER_KEY = 'user'
const REMEMBER_KEY = 'remember'
const REMEMBERED_EMAIL_KEY = 'rememberedEmail'

type LoginFieldErrors = Partial<Record<keyof LoginCredentials, string>>

export function useAuth() {
  const [remember, setRemember] = useState(() => localStorage.getItem(REMEMBER_KEY) !== 'false')
  const [email, setEmailValue] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? '')
  const [password, setPasswordValue] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  // The auth token lives in an httpOnly cookie the browser sends automatically; it is
  // never exposed to JavaScript. We cache only the non-secret user profile for instant UI.
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    return storedUser ? (JSON.parse(storedUser) as User) : null
  })
  const [authError, setAuthError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const isAuthenticated = Boolean(user)

  // Verify the session cookie on mount and reconcile the cached user with the server.
  useEffect(() => {
    let active = true

    // Purge legacy pre-cookie storage (raw token + plaintext password) from older builds.
    localStorage.removeItem('accessToken')
    localStorage.removeItem('rememberedPassword')

    AuthService.getCurrentUser()
      .then((currentUser) => {
        if (active) {
          persistUser(currentUser)
          setUser(currentUser)
        }
      })
      .catch(() => {
        if (active) {
          clearUser()
          setUser(null)
        }
      })

    return () => {
      active = false
    }
  }, [])

  async function login(credentials: LoginCredentials) {
    if (isAuthenticating) {
      return false
    }

    setAuthError('')

    const validationErrors = validateLoginCredentials(credentials)
    setFieldErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return false
    }

    setIsAuthenticating(true)

    try {
      const trimmedEmail = credentials.email.trim()
      const authResponse = await AuthService.login({
        email: trimmedEmail,
        password: credentials.password,
        remember,
      })

      localStorage.setItem(REMEMBER_KEY, String(remember))
      if (remember) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, trimmedEmail)
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY)
      }

      persistUser(authResponse.user)
      setEmailValue(trimmedEmail)
      setPasswordValue('')
      setUser(authResponse.user)
      return true
    } catch (caughtError) {
      setAuthError(caughtError instanceof Error ? caughtError.message : 'Autentikasi gagal.')
      return false
    } finally {
      setIsAuthenticating(false)
    }
  }

  function setEmail(emailValue: string) {
    setEmailValue(emailValue)
    clearFieldError('email')
  }

  function setPassword(passwordValue: string) {
    setPasswordValue(passwordValue)
    clearFieldError('password')
  }

  function updateRemember(value: boolean) {
    setRemember(value)
    localStorage.setItem(REMEMBER_KEY, String(value))
    if (!value) {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    }
  }

  function clearFieldError(field: keyof LoginCredentials) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  async function logout() {
    try {
      await AuthService.logout()
    } catch {
      // Even if the network call fails, drop the local session so the UI logs out.
    }
    clearUser()
    setUser(null)
  }

  return {
    authError,
    email,
    fieldErrors,
    isAuthenticated,
    isAuthenticating,
    password,
    remember,
    user,
    login,
    logout,
    setAuthError,
    setEmail,
    setPassword,
    setRemember: updateRemember,
  }
}

function persistUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearUser() {
  localStorage.removeItem(USER_KEY)
}

function validateLoginCredentials(credentials: LoginCredentials): LoginFieldErrors {
  const errors: LoginFieldErrors = {}

  if (!credentials.email.trim()) {
    errors.email = 'Email wajib diisi.'
  }

  if (!credentials.password) {
    errors.password = 'Kata sandi wajib diisi.'
  }

  return errors
}
