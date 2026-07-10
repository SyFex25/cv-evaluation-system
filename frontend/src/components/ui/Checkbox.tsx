/**
 * File: src/components/ui/Checkbox.tsx
 * Module: UI Components
 * Responsibility: Provides a reusable accessible checkbox with optional inline error
 */

import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  id?: string
  label: string
  error?: string
  className?: string
}

export function Checkbox({ id, label, error, className = '', ...props }: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <label className={["ui-checkbox", className].filter(Boolean).join(' ')} htmlFor={inputId}>
      <input id={inputId} type="checkbox" aria-invalid={Boolean(error)} aria-describedby={errorId} {...props} />
      <span>{label}</span>
      {error && (
        <span className="ui-field-error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </label>
  )
}
