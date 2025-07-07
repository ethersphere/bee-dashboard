import { ReactElement } from 'react'
import './FileItem.scss'
import { GetIconElement } from '../../../utils/GetIconElement'
import { ContextMenu } from '../../ContextMenu/ContextMenu'
import { useContextMenu } from '../../../hooks/useContextMenu'

interface FileItemProps {
  icon: string
  name: string
  size: string
  dateMod: string
}

export function FileItem({ icon, name, size, dateMod }: FileItemProps): ReactElement {
  const { showContext, pos, contextRef, handleContextMenu, handleCloseContext } = useContextMenu<HTMLDivElement>()

  return (
    <div className="fm-file-item-content" onContextMenu={handleContextMenu} onClick={handleCloseContext}>
      <div className="fm-file-item-content-item fm-checkbox">
        <input type="checkbox" />
      </div>
      <div className="fm-file-item-content-item fm-name">
        <GetIconElement icon={icon} />
        {name}
      </div>
      <div className="fm-file-item-content-item fm-size">{size}</div>
      <div className="fm-file-item-content-item fm-date-mod">{dateMod}</div>
      {showContext && (
        <div
          ref={contextRef}
          className="fm-file-item-context-menu"
          style={{
            top: pos.y,
            left: pos.x,
          }}
        >
          <ContextMenu>
            <div className="fm-context-item">View / Open</div>
            <div className="fm-context-item">Download</div>
            <div className="fm-context-item">Rename</div>
            <div className="fm-context-item-border"></div>
            <div className="fm-context-item">Version history</div>
            <div className="fm-context-item red">Delete</div>
            <div className="fm-context-item-border"></div>
            <div className="fm-context-item">Get info</div>
          </ContextMenu>
        </div>
      )}
    </div>
  )
}
