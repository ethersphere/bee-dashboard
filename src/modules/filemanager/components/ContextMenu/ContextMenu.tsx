import { ReactElement } from 'react'

import './ContextMenu.scss'

interface ContextMenuProps {
  children?: ReactElement | ReactElement[]
}

export function ContextMenu({ children }: ContextMenuProps): ReactElement {
  return <div className="fm-context-menu">{children}</div>
}
