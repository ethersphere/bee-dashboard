import { ReactElement } from 'react'

import { useView } from '../../../../../pages/filemanager/ViewContext'
import { ViewType } from '../../../constants/transfers'

import './FileBrowserTopBar.scss'

type Props = {
  onOpenMenu?: (anchorEl: HTMLElement) => void
  canOpen?: boolean
}

export function FileBrowserTopBar({ onOpenMenu, canOpen = true }: Props): ReactElement {
  const { view, actualItemView } = useView()

  const viewText = view === ViewType.Trash ? ' Trash' : ''

  return (
    <div className="fm-file-browser-top-bar">
      <div className="fm-file-browser-top-bar__title">
        {actualItemView}
        {viewText}
      </div>
      {canOpen && (
        <button
          type="button"
          className="fm-topbar-kebab"
          aria-haspopup="menu"
          aria-label="More actions"
          onClick={e => onOpenMenu?.(e.currentTarget)}
        >
          ⋯
        </button>
      )}
    </div>
  )
}
