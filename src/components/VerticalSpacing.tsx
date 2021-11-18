// FIXME remove this lazy workaround

import { ReactElement } from 'react'

interface Props {
  px: number
}

export function VerticalSpacing({ px }: Props): ReactElement {
  return <div style={{ marginBottom: px + 'px' }}></div>
}
