import { ReactElement } from 'react'
import { Folder } from 'react-feather'
import { StripedWrapper } from '../../components/StripedWrapper'

export function FolderIcon(): ReactElement {
  return (
    <StripedWrapper>
      <Folder />
    </StripedWrapper>
  )
}
