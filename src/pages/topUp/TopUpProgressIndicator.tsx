import { ReactElement } from 'react'

import { ProgressIndicator } from '../../components/ProgressIndicator'

interface Props {
  index: number
}

export function TopUpProgressIndicator({ index }: Props): ReactElement {
  return <ProgressIndicator index={index} steps={['Buy xDAI', 'Swap xBZZ']} />
}
