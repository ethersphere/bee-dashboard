import { ReactElement } from 'react'
import { File } from 'react-feather'
import { StripedWrapper } from '../../components/StripedWrapper'

export function FileIcon(): ReactElement {
  return (
    <StripedWrapper>
      <File />
    </StripedWrapper>
  )
}
