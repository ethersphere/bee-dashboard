import { ReactElement, CSSProperties } from 'react'

interface Props {
  style?: CSSProperties
}

export default function Card({ style }: Props): ReactElement {
  return <div style={Object.assign({}, style, { width: '100%', height: '380px', backgroundColor: '#f3f3f3' })}></div>
}
