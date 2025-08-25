import { ReactElement, useLayoutEffect, useState } from 'react'
import './FileItem.scss'
import { GetIconElement } from '../../../utils/GetIconElement'
import { ContextMenu } from '../../ContextMenu/ContextMenu'
import { useContextMenu } from '../../../hooks/useContextMenu'
import { ViewType } from '../../../constants/constants'
import { useView } from '../../../providers/FMFileViewContext'
import type { FileInfo } from '@solarpunkltd/file-manager-lib'
import { useFMDownloads } from '../../../hooks/useFMDownloads'

interface FileItemProps {
  fileInfo: FileInfo
}

const formatBytes = (v?: string) => {
  const n = v ? Number(v) : NaN

  if (!Number.isFinite(n) || n < 0) return '—'

  if (n < 1024) return `${n} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let val = n / 1024
  let i = 0
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024
    i++
  }

  return `${val.toFixed(1)} ${units[i]}`
}

export function FileItem({ fileInfo }: FileItemProps): ReactElement {
  const { showContext, pos, contextRef, handleContextMenu, handleCloseContext } = useContextMenu<HTMLDivElement>()
  const { view } = useView()
  const { downloadFile, viewFile } = useFMDownloads()

  const name = fileInfo.name
  const size = formatBytes(fileInfo.customMetadata?.size)
  const dateMod = new Date(fileInfo.timestamp || 0).toLocaleDateString()

  // keep context menu on screen
  const [safePos, setSafePos] = useState(pos)
  const [dropDir, setDropDir] = useState<'down' | 'up'>('down')

  useLayoutEffect(() => {
    if (!showContext) return
    requestAnimationFrame(() => {
      const menu = contextRef.current

      if (!menu) return

      const rect = menu.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const margin = 8

      const left = Math.max(margin, Math.min(pos.x, vw - rect.width - margin))

      let top = pos.y
      let dir: 'down' | 'up' = 'down'

      if (pos.y > vh * 0.5 || pos.y + rect.height + margin > vh) {
        top = Math.max(margin, pos.y - rect.height)
        dir = 'up'
      } else {
        top = Math.max(margin, Math.min(pos.y, vh - rect.height - margin))
      }

      setSafePos({ x: left, y: top })
      setDropDir(dir)
    })
  }, [showContext, pos, contextRef])

  return (
    <div className="fm-file-item-content" onContextMenu={handleContextMenu} onClick={handleCloseContext}>
      <div className="fm-file-item-content-item fm-checkbox">
        <input type="checkbox" />
      </div>
      <div className="fm-file-item-content-item fm-name">
        <GetIconElement icon={name} />
        {name}
      </div>
      <div className="fm-file-item-content-item fm-size">{size}</div>
      <div className="fm-file-item-content-item fm-date-mod">{dateMod}</div>

      {showContext && (
        <div
          ref={contextRef}
          className="fm-file-item-context-menu"
          style={{ top: safePos.y, left: safePos.x }}
          data-drop={dropDir}
        >
          {view === ViewType.File ? (
            <ContextMenu>
              <div
                className="fm-context-item"
                onClick={() => {
                  handleCloseContext()
                  viewFile(fileInfo)
                }}
              >
                View / Open
              </div>
              <div
                className="fm-context-item"
                onClick={() => {
                  handleCloseContext()
                  downloadFile(fileInfo)
                }}
              >
                Download
              </div>
              <div className="fm-context-item" onClick={handleCloseContext}>
                Rename
              </div>
              <div className="fm-context-item-border" />
              <div className="fm-context-item" onClick={handleCloseContext}>
                Version history
              </div>
              <div className="fm-context-item red" onClick={handleCloseContext}>
                Delete
              </div>
              <div className="fm-context-item-border" />
              <div className="fm-context-item" onClick={handleCloseContext}>
                Get info
              </div>
            </ContextMenu>
          ) : (
            <ContextMenu>
              <div
                className="fm-context-item"
                onClick={() => {
                  handleCloseContext()
                  viewFile(fileInfo)
                }}
              >
                View / Open
              </div>
              <div
                className="fm-context-item"
                onClick={() => {
                  handleCloseContext()
                  downloadFile(fileInfo)
                }}
              >
                Download
              </div>
              <div className="fm-context-item-border" />
              <div className="fm-context-item" onClick={handleCloseContext}>
                Version history
              </div>
              <div className="fm-context-item" onClick={handleCloseContext}>
                Restore
              </div>
              <div className="fm-context-item red" onClick={handleCloseContext}>
                Destroy
              </div>
              <div className="fm-context-item red" onClick={handleCloseContext}>
                Forget permanently
              </div>
              <div className="fm-context-item-border" />
              <div className="fm-context-item" onClick={handleCloseContext}>
                Get info
              </div>
            </ContextMenu>
          )}
        </div>
      )}
    </div>
  )
}
