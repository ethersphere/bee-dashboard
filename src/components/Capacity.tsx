import { ReactElement } from 'react'

interface Props {
  width: string
  usage: number
}

export function Capacity({ width, usage }: Props): ReactElement {
  const integerUsage = Math.round(usage * 100)
  const used = integerUsage + '%'
  const free = 100 - 2 - integerUsage + '%'

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', width }}>
      <div style={{ display: 'flex', height: '4px', width: '100%' }}>
        <div style={{ width: used, background: '#dd7200' }} />
        <div style={{ width: '2%' }} />
        <div style={{ width: free, background: '#c9c9c9' }} />
      </div>
    </div>
  )
}
