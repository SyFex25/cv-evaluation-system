/**
 * File: src/pages/Settings.tsx
 * Module: Pages
 * Responsibility: Lets HR users choose and configure the AI used to evaluate CVs
 */

import { useId, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { Check, ChevronRight, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { InfoTip } from '@/components/ui/InfoTip'
import { useRuntimeSettings } from '@/hooks/useRuntimeSettings'
import type { ProviderName, ProviderRuntimeSettings, ProviderRuntimeSettingsUpdate, User } from '@/types/api'

type ProviderOption = {
  id: ProviderName
  label: string
  provider: string
}

type ProviderDraft = {
  model: string
  temperature: string
  maxTokens: string
}

const providerOptions: ProviderOption[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    provider: 'OpenAI',
  },
  {
    id: 'xai',
    label: 'xAI',
    provider: 'xAI',
  },
  {
    id: 'anthropic',
    label: 'Claude',
    provider: 'Claude',
  },
]
type SettingsProps = {
  user: User | null
}

type ProviderSettingsFormProps = {
  provider: ProviderName
  option: ProviderOption | undefined
  runtime: ProviderRuntimeSettings | undefined
  saving: boolean
  onSave: (provider: ProviderName, payload: ProviderRuntimeSettingsUpdate) => Promise<boolean>
}

function SectionHeader({
  description,
  icon,
  infoTip,
  title,
}: {
  description: string
  icon: ReactNode
  infoTip?: ReactNode
  title: string
}) {
  return (
    <div className="settings-section-header compact-header">
      <span className="card-icon card-icon-maroon">{icon}</span>
      <div>
        <h2 className="settings-title-with-tip">
          <span>{title}</span>
          {infoTip}
        </h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

function describeTone(temperature?: number) {
  if (temperature === undefined) return 'Belum dipilih'
  if (temperature <= 0.3) return 'Konsisten'
  if (temperature <= 0.7) return 'Seimbang'
  return 'Eksploratif'
}

function findProviderSettings(
  settings: ProviderRuntimeSettings[] | undefined,
  provider: ProviderName,
): ProviderRuntimeSettings | undefined {
  return settings?.find((item) => item.provider === provider)
}

function createDraft(runtime?: ProviderRuntimeSettings): ProviderDraft {
  return {
    model: runtime?.model || '',
    temperature: String(runtime?.temperature ?? 0.2),
    maxTokens: String(runtime?.max_tokens ?? 2000),
  }
}

function clampTemperature(value: string) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return 0.2
  return Math.min(1, Math.max(0, parsed))
}

function clampMaxTokens(value: string) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return 2000
  return Math.min(4096, Math.max(512, Math.round(parsed)))
}

function ProviderSettingsForm({ provider, option, runtime, saving, onSave }: ProviderSettingsFormProps) {
  const fieldId = useId()
  const [draft, setDraft] = useState<ProviderDraft>(() => createDraft(runtime))
  const [saved, setSaved] = useState(false)
  const draftTemperature = clampTemperature(draft.temperature)
  const draftMaxTokens = clampMaxTokens(draft.maxTokens)
  const canSave = Boolean(draft.model) && !saving
  const modelFieldId = `${fieldId}-model`
  const temperatureFieldId = `${fieldId}-temperature`
  const maxTokensFieldId = `${fieldId}-max-tokens`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSave) return

    const ok = await onSave(provider, {
      model: draft.model,
      temperature: draftTemperature,
      max_tokens: draftMaxTokens,
      set_as_default: true,
    })

    if (ok) {
      setSaved(true)
      window.setTimeout(() => setSaved(false), 1800)
    }
  }

  return (
    <form className="settings-model-form" onSubmit={handleSubmit}>
      <div className="settings-model-form-heading">
        <div>
          <h3>Atur {option?.label || 'AI'}</h3>
          <p>Pilih model, tingkat kreativitas, dan maksimum token yang sesuai untuk evaluasi CV.</p>
        </div>
        <span>{describeTone(draftTemperature)}</span>
      </div>

      <div className="settings-field">
        <span className="settings-label-with-tip">
          <label className="settings-field-label" htmlFor={modelFieldId}>
            Model yang digunakan
          </label>
          <InfoTip
            title="Model AI"
            description="Model yang berbeda dapat memberi gaya evaluasi yang berbeda, misalnya lebih ringkas atau lebih rinci."
          />
        </span>
        <select
          id={modelFieldId}
          value={draft.model}
          onChange={(event) => setDraft((current) => ({ ...current, model: event.target.value }))}
        >
          {runtime?.available_models.map((model) => (
            <option value={model} key={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-field">
        <span className="settings-field-heading">
          <span className="settings-label-with-tip">
            <label className="settings-field-label" htmlFor={temperatureFieldId}>
              Tingkat Kreativitas
            </label>
            <InfoTip
              title="Tingkat Kreativitas"
              description="Nilai rendah membuat evaluasi lebih konsisten. Nilai tinggi memberi ruang untuk jawaban yang lebih bervariasi."
            />
          </span>
          <em className="settings-field-readout">{draftTemperature.toFixed(1)}</em>
        </span>
        <input
          id={temperatureFieldId}
          type="range"
          className="settings-range"
          min="0"
          max="1"
          step="0.1"
          value={draftTemperature}
          onChange={(event) => setDraft((current) => ({ ...current, temperature: event.target.value }))}
          style={{ '--range-fill': `${draftTemperature * 100}%` } as CSSProperties}
          aria-label="Tingkat kreativitas jawaban"
        />
        <div className="settings-range-labels" aria-hidden="true">
          <span>0.0 - Konsisten</span>
          <span>1.0 - Bervariasi</span>
        </div>
      </div>

      <div className="settings-field">
        <span className="settings-label-with-tip">
          <label className="settings-field-label" htmlFor={maxTokensFieldId}>
            Maksimum Token
          </label>
          <InfoTip
            title="Maksimum Token"
            description="Batas ini mengatur jumlah token maksimal yang dapat digunakan AI saat menyusun jawaban. Token lebih banyak tidak selalu membuat hasil lebih baik."
          />
        </span>
        <input
          id={maxTokensFieldId}
          type="number"
          min="512"
          max="4096"
          step="128"
          value={draft.maxTokens}
          onChange={(event) => setDraft((current) => ({ ...current, maxTokens: event.target.value }))}
          onBlur={() => setDraft((current) => ({ ...current, maxTokens: String(draftMaxTokens) }))}
        />
      </div>

      <div className="settings-actions inline-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setDraft(createDraft(runtime))}
          disabled={saving}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={saving}
          disabled={!canSave}
          icon={saved ? <Check size={15} aria-hidden="true" /> : undefined}
          iconPosition="left"
        >
          {saved ? 'Tersimpan' : 'Simpan Pengaturan'}
        </Button>
      </div>
    </form>
  )
}

export function Settings({ user }: SettingsProps) {
  void user
  const { settings, loading, saving, error, saveError, saveProviderSettings } = useRuntimeSettings()
  const [selectedProviderOverride, setSelectedProviderOverride] = useState<ProviderName | null>(null)
  const selectedProvider = selectedProviderOverride ?? settings?.default_provider ?? 'openai'

  const selectedRuntime = useMemo(
    () => findProviderSettings(settings?.provider_settings, selectedProvider),
    [selectedProvider, settings?.provider_settings],
  )

  const selectedOption = providerOptions.find((option) => option.id === selectedProvider)

  return (
    <section className="dashboard-page settings-page human-settings-page" aria-labelledby="settings-title">
      <header className="dashboard-header settings-hero-header">
        <div>
          <div className="dashboard-breadcrumb" aria-label="Lokasi halaman">
            <span>Human Resources</span>
            <ChevronRight size={13} aria-hidden="true" />
            <span>Pengaturan</span>
          </div>
          <h1 id="settings-title">Pengaturan</h1>
          <p className="dashboard-lede">
            Pilih dan sesuaikan AI yang digunakan untuk mengevaluasi CV.
          </p>
        </div>
      </header>

      {(error || saveError) && (
        <div className="settings-error" role="alert">
          <Cpu size={16} aria-hidden="true" />
          <p>{error || saveError}</p>
        </div>
      )}

      <div className="settings-stack">
        <Card className="settings-panel human-settings-panel">
          <SectionHeader
            icon={<Cpu size={18} aria-hidden="true" />}
            title="Konfigurasi AI"
            description="Pilih AI yang digunakan untuk mengevaluasi CV, lalu sesuaikan pengaturannya di bawah."
          />

          {loading ? (
            <div className="settings-loading">Memuat pilihan penyedia...</div>
          ) : (
            <div className="ai-config">
              <div className="ai-provider-grid" role="radiogroup" aria-label="Pilihan penyedia AI">
                {providerOptions.map((option) => {
                  const active = selectedProvider === option.id

                  return (
                    <button
                      type="button"
                      className={active ? 'ai-provider-choice active' : 'ai-provider-choice'}
                      key={option.id}
                      onClick={() => setSelectedProviderOverride(option.id)}
                      role="radio"
                      aria-checked={active}
                    >
                      <span>{option.provider.slice(0, 2).toUpperCase()}</span>
                      <strong>{option.label}</strong>
                      <i>{active && <Check size={14} aria-hidden="true" />}</i>
                    </button>
                  )
                })}
              </div>

              <div
                className="ai-config-fade"
                key={selectedProvider}
                role="region"
                aria-label={`Konfigurasi ${selectedOption?.label ?? 'AI'}`}
              >
                <ProviderSettingsForm
                  provider={selectedProvider}
                  option={selectedOption}
                  runtime={selectedRuntime}
                  saving={saving}
                  onSave={saveProviderSettings}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
