interface Props {
  children: React.ReactNode
  p?: number
  gap?: number
  left?: boolean
  full?: boolean
}

export function Vertical({ children, p = 0, gap = 0, left = false, full = false }: Props) {
  const style = {
    display: 'flex',
    flexDirection: 'column' as 'column', //eslint-disable-line
    alignItems: left ? 'flex-start' : 'center',
    gap: `${gap}px`,
    width: full ? '100%' : 'auto',
    padding: `${p}px`,
  }

  return <div style={style}>{children}</div>
}
