import { ReactElement } from 'react'
import { Chrome } from 'react-feather'
import { StripedWrapper } from '../../components/StripedWrapper'

export function WebsiteIcon(): ReactElement {
  return (
    <StripedWrapper>
      <Chrome />
    </StripedWrapper>
  )
}
