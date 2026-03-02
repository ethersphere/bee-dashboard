import { ReactElement } from 'react'
import FileIcon from 'remixicon-react/FileTextLineIcon'
import ImageIcon from 'remixicon-react/Image2LineIcon'

import { guessMime } from './view'

interface ContextMenuProps {
  name: string
  metadata?: Record<string, string>
  size?: string
  color?: string
}

export function GetIconElement({ name, metadata, size = '21px', color = '#ed8131' }: ContextMenuProps): ReactElement {
  const { mime } = guessMime(name, metadata)

  const iconType = mime.split('/')[0]?.toLowerCase() || 'file'

  switch (iconType) {
    case 'image':
      return <ImageIcon size={size} color={color} />
    default:
      return <FileIcon size={size} color={color} />
  }
}
