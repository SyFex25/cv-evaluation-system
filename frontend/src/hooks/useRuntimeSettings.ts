/**
 * File: src/hooks/useRuntimeSettings.ts
 * Module: Hooks
 * Responsibility: Loads and updates backend runtime settings for frontend presentation
 */

import { useEffect, useState } from 'react'
import { getRuntimeSettings, updateProviderRuntimeSettings } from '@/services/settingsService'
import type { ProviderName, ProviderRuntimeSettingsUpdate, SettingsResponse } from '@/types/api'

type RuntimeSettingsState = {
  settings: SettingsResponse | null
  loading: boolean
  saving: boolean
  error: string | null
  saveError: string | null
  saveProviderSettings: (provider: ProviderName, payload: ProviderRuntimeSettingsUpdate) => Promise<boolean>
}

export function useRuntimeSettings(): RuntimeSettingsState {
  const [settings, setSettings] = useState<SettingsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadSettings() {
      try {
        setLoading(true)
        setError(null)
        const data = await getRuntimeSettings()

        if (active) {
          setSettings(data)
        }
      } catch {
        if (active) {
          setError('Konfigurasi sistem belum dapat dimuat.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      active = false
    }
  }, [])

  async function saveProviderSettings(provider: ProviderName, payload: ProviderRuntimeSettingsUpdate) {
    try {
      setSaving(true)
      setSaveError(null)
      const data = await updateProviderRuntimeSettings(provider, payload)
      setSettings(data)
      return true
    } catch {
      setSaveError('Pengaturan model belum dapat disimpan.')
      return false
    } finally {
      setSaving(false)
    }
  }

  return { settings, loading, saving, error, saveError, saveProviderSettings }
}
