/**
 * File: src/components/ui/Input.tsx
 * Module: UI Components
 * Responsibility: Provides a reusable accessible text input with optional icon and inline error
 */

import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id?: string
  label: string
  error?: string
  icon?: ReactNode
  className?: string
  inputClassName?: string
}

export function Input({
  id,
  label,
  error,
  icon,
  className = '',
  inputClassName = '',
  ...props
}: InputProps) {
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
          className={[icon ? 'ui-input-with-icon' : '', inputClassName].filter(Boolean).join(' ')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
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
