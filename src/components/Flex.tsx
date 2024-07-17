import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function Flex({ children }: Props) {
  return <div style={{ display: 'flex' }}>{children}</div>
}
