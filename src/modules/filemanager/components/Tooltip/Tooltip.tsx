import { ReactElement, useState, useRef, useCallback } from 'react'
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
  const wrapperRef = useRef<HTMLSpanElement>(null)

  const evaluateAlignment = useCallback(() => {
    const wrapper = wrapperRef.current

    if (!wrapper) return
    const container = wrapper.querySelector('.fm-tooltip-container') as HTMLElement | null

    if (!container) return

    const wrapperRect = wrapper.getBoundingClientRect()
    const tooltipWidth = container.offsetWidth || 0
    const projectedRight = wrapperRect.right + gapPx + tooltipWidth + edgeOffsetPx
    const viewportWidth = window.innerWidth

    if (projectedRight > viewportWidth) {
      setAlignLeft(true)
    } else {
      setAlignLeft(false)
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
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </span>
  )
}
