import { ReactElement } from 'react'

interface Props {
  usage: number
}

export function Capacity({ usage }: Props): ReactElement {
  const integerUsage = Math.round(usage * 100)
  const usedPx = integerUsage
  const freePx = 100 - 2 - usedPx

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
      <div style={{ display: 'flex', height: '4px' }}>
        <div style={{ width: usedPx + 'px', background: '#dd7200' }} />
        <div style={{ width: '2px' }} />
        <div style={{ width: freePx + 'px', background: '#c9c9c9' }} />
      </div>
    </div>
  )
}
