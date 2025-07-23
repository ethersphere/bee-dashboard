import { ReactElement } from 'react'
import './FileBrowser.scss'
import { FileBrowserTopBar } from './FileBrowserTopBar/FileBrowserTopBar'
import DownIcon from 'remixicon-react/ArrowDownSLineIcon'
import UpIcon from 'remixicon-react/ArrowUpSLineIcon'
import { FileItem } from './FileItem/FileItem'
import { ContextMenu } from '../ContextMenu/ContextMenu'
import { useContextMenu } from '../../hooks/useContextMenu'
import { NotificationBar } from '../NotificationBar/NotificationBar'

import { FileTransferType, ViewType } from '../../constants/constants'
import { FileProgressNotification } from '../FileProgressNotification/FileProgressNotification'
import { useView } from '../../providers/FileViewContext'

export function FileBrowser(): ReactElement {
  const { showContext, pos, contextRef, handleContextMenu, handleCloseContext } = useContextMenu<HTMLDivElement>()

  const { view } = useView()

  function handleFileBrowserContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('.fm-file-item-content')) {
      return
    }
    handleContextMenu(e)
  }

  return (
    <>
      <div className="fm-file-browser-container">
        <FileBrowserTopBar />
        <div className="fm-file-browser-content">
          <div className="fm-file-browser-content-header">
            <div className="fm-file-browser-content-header-item fm-checkbox">
              <input type="checkbox" />
            </div>
            <div className="fm-file-browser-content-header-item fm-name">
              Name
              <div className="fm-file-browser-content-header-item-icon">
                <DownIcon size="16px" />
              </div>
            </div>
            <div className="fm-file-browser-content-header-item fm-size">
              Size
              <div className="fm-file-browser-content-header-item-icon">
                <DownIcon size="16px" />
              </div>
            </div>
            <div className="fm-file-browser-content-header-item fm-date-mod">
              Date mod.
              <div className="fm-file-browser-content-header-item-icon">
                <DownIcon size="16px" />
              </div>
            </div>
          </div>
          <div
            className="fm-file-browser-content-body"
            onContextMenu={handleFileBrowserContextMenu}
            onClick={handleCloseContext}
          >
            <FileItem icon="image" name="File1.jpg" size="1.2MB" dateMod="2025-05-19" />
            <FileItem icon="doc" name="Report.pdf" size="0.5MB" dateMod="2025-05-25" />
            {showContext && (
              <div
                ref={contextRef}
                className={'fm-file-browser-context-menu'}
                style={{
                  top: pos.y,
                  left: pos.x,
                }}
              >
                {view === ViewType.Trash ? (
                  <ContextMenu>
                    <div className="fm-context-item">Empty trash</div>
                  </ContextMenu>
                ) : (
                  <ContextMenu>
                    <div className="fm-context-item">New folder</div>
                    <div className="fm-context-item">Upload file</div>
                    <div className="fm-context-item">Upload folder</div>
                    <div className="fm-context-item-border"></div>
                    <div className="fm-context-item">Paste</div>
                    <div className="fm-context-item-border"></div>
                    <div className="fm-context-item">Refresh</div>
                  </ContextMenu>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="fm-file-browser-footer">
          <FileProgressNotification label="Uploading files" type={FileTransferType.Upload} />
          <FileProgressNotification label="Downloading files" type={FileTransferType.Download} />
          <NotificationBar numberOfExpiration={2} />
        </div>
      </div>
    </>
  )
}
