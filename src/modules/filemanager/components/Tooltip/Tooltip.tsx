import React, { ReactElement, useCallback, useRef, useState } from 'react'
import InfoIcon from 'remixicon-react/InformationLineIcon'

import './Tooltip.scss'

interface TooltipProps {
  label: string
  iconSize?: string
  edgeOffsetPx?: number
  gapPx?: number
  children?: React.ReactNode
  disableMargin?: boolean
  bottomTooltip?: boolean
}

export function Tooltip({
  label,
  iconSize = '16px',
  edgeOffsetPx = 12,
  gapPx = 6,
  children,
  disableMargin = false,
  bottomTooltip = false,
}: TooltipProps): ReactElement {
  const [alignLeft, setAlignLeft] = useState(false)
  const [position, setPosition] = useState<{ top: number; left?: number; right?: number } | null>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  const evaluateAlignment = useCallback(() => {
    const wrapper = wrapperRef.current

    if (!wrapper) return
    const container = wrapper.querySelector('.fm-tooltip-container') as HTMLElement | null

    if (!container) return

    const wrapperRect = wrapper.getBoundingClientRect()

    const modalContainer = wrapper.closest('.fm-modal-container') as HTMLElement | null
    let containerOffset = 0

    if (modalContainer) {
      const containerRect = modalContainer.getBoundingClientRect()
      containerOffset = containerRect.left
    }

    const tooltipWidth = container.offsetWidth || 0
    const projectedRight = wrapperRect.right + gapPx + tooltipWidth + edgeOffsetPx
    const viewportWidth = window.innerWidth

    const top = wrapperRect.top + wrapperRect.height / 2

    if (projectedRight > viewportWidth) {
      setAlignLeft(true)
      setPosition({ top, right: viewportWidth - wrapperRect.left + gapPx - containerOffset })
    } else {
      setAlignLeft(false)
      setPosition({ top, left: wrapperRect.right + gapPx - containerOffset })
    }
  }, [edgeOffsetPx, gapPx])

  return (
    <span
      ref={wrapperRef}
      className={`fm-tooltip-wrapper${alignLeft ? ' left' : ''}${disableMargin ? ' no-margin' : ''}`}
      aria-label="info tooltip"
      onMouseEnter={evaluateAlignment}
      style={{ ['--fm-tooltip-gap' as string]: `${gapPx}px` }}
    >
      {children && <span className="fm-tooltip-text">{children}</span>}
      <span className="fm-tooltip-trigger" role="button" tabIndex={0}>
        <InfoIcon size={iconSize} />
      </span>
      <div
        className={`fm-tooltip-container${bottomTooltip ? ' bottom' : ''}`}
        style={
          position
            ? {
                top: `${position.top}px`,
                left: position.left !== undefined ? `${position.left}px` : undefined,
                right: position.right !== undefined ? `${position.right}px` : undefined,
                transform: 'translateY(-50%)',
              }
            : undefined
        }
        // Safe: label is always from static TOOLTIPS constant or hardcoded strings, never user input
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </span>
  )
}
