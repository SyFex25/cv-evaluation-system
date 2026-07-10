/**
 * File: src/components/ui/Button.tsx
 * Module: UI Components
 * Responsibility: Provides a reusable accessible button with optional icon and loading state
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
}

export function Button({
  children,
  className = '',
  disabled,
  icon,
  iconPosition = 'right',
  isLoading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const visualIcon = isLoading ? <Loader2 className="spin" size={16} aria-hidden="true" /> : icon

  return (
    <button
      className={["ui-button", `ui-button-${variant}`, className].filter(Boolean).join(' ')}
      type={type}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {visualIcon && iconPosition === 'left' && <span className="ui-button-icon">{visualIcon}</span>}
      <span>{children}</span>
      {visualIcon && iconPosition === 'right' && <span className="ui-button-icon">{visualIcon}</span>}
    </button>
  )
}
