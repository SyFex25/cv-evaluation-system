/**
 * File: src/components/ui/InfoTip.tsx
 * Module: UI Components
 * Responsibility: Provides accessible contextual help for labels and section titles
 */

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { Info } from 'lucide-react'

export interface InfoTipProps {
  title?: string
  description: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  maxWidth?: number
}

type InfoTipStyle = CSSProperties & {
  '--info-tip-max-width'?: string
}

export function InfoTip({ title, description, side = 'top', maxWidth = 260 }: InfoTipProps) {
  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return undefined

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      event.currentTarget.blur()
    }
  }

  return (
    <span
      className={['ui-info-tip', `ui-info-tip-${side}`, open ? 'is-open' : ''].filter(Boolean).join(' ')}
      ref={rootRef}
      style={{ '--info-tip-max-width': `${maxWidth}px` } as InfoTipStyle}
    >
      <button
        type="button"
        className="ui-info-tip-trigger"
        aria-describedby={tooltipId}
        aria-expanded={open}
        aria-label={title ? `Info: ${title}` : 'Info tambahan'}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <Info size={14} aria-hidden="true" strokeWidth={2.4} />
      </button>
      <span className="ui-info-tip-panel" id={tooltipId} role="tooltip">
        {title && <strong>{title}</strong>}
        <span>{description}</span>
      </span>
    </span>
  )
}