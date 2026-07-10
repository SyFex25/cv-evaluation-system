/**
 * File: src/components/ui/PasswordInput.tsx
 * Module: UI Components
 * Responsibility: Provides a reusable accessible password input with visibility toggle
 */

import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  id?: string
  label: string
  error?: string
  icon?: ReactNode
  className?: string
  inputClassName?: string
}

export function PasswordInput({
  id,
  label,
  error,
  icon = <Lock size={16} aria-hidden="true" />,
  className = '',
  inputClassName = '',
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <label className={["ui-field", className].filter(Boolean).join(' ')} htmlFor={inputId}>
      <span className="ui-field-label">{label}</span>
      <span className="ui-input-wrap">
        {icon && <span className="ui-input-icon">{icon}</span>}
        <input
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          className={["ui-input-with-icon", "ui-input-with-action", inputClassName].filter(Boolean).join(' ')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <button
          type="button"
          className="ui-input-action"
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          aria-controls={inputId}
        >
          {isVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
      </span>
      <span
        className="ui-field-error"
        id={errorId}
        role={error ? 'alert' : undefined}
        aria-hidden={error ? undefined : true}
      >
        {error}
      </span>
    </label>
  )
}
