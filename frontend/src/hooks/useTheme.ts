/**
 * File: src/hooks/useTheme.ts
 * Module: Hooks
 * Responsibility: Manages the app-wide light/dark theme preference
 */

import { useEffect, useState } from 'react'

export type ThemeOption = 'light' | 'dark'

const THEME_STORAGE_KEY = 'cv-evaluation-theme'

export function useTheme() {
  const [theme, setTheme] = useState<ThemeOption>(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return { theme, setTheme, toggleTheme }
}
