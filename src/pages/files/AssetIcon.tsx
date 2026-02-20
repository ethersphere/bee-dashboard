import { ReactElement } from 'react'

import { StripedWrapper } from '../../components/StripedWrapper'

interface Props {
  icon: ReactElement
}

export function AssetIcon({ icon }: Props): ReactElement {
  return <StripedWrapper>{icon}</StripedWrapper>
}
