/**
 * File: src/components/ui/Card.tsx
 * Module: UI Components
 * Responsibility: Provides a reusable content container with default enterprise styling
 */

import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={["ui-card", className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}
