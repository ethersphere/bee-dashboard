import { PostageBatch } from '@ethersphere/bee-js'
import { DriveInfo, FileInfo } from '@solarpunkltd/file-manager-lib'
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useView } from '../../../../../pages/filemanager/ViewContext'
import { Context as FMContext } from '../../../../../providers/FileManager'
import { Context as SettingsContext } from '../../../../../providers/Settings'
import { uuidV4 } from '../../../../../utils'
import { TOOLTIPS } from '../../../constants/tooltips'
import { DownloadProgress, FileAction, TrackDownloadProps, ViewType } from '../../../constants/transfers'
import { useContextMenu } from '../../../hooks/useContextMenu'
import { getUsableStamps, handleDestroyAndForgetDrive, verifyDriveSpace } from '../../../utils/bee'
import { Dir, formatBytes, isTrashed, safeSetState, truncateNameMiddle } from '../../../utils/common'
import { createDownloadAbort, startDownloadingQueue } from '../../../utils/download'
import { FileOperation, performFileOperation } from '../../../utils/fileOperations'
import { GetIconElement } from '../../../utils/GetIconElement'
import type { FilePropertyGroup } from '../../../utils/infoGroups'
import { buildGetInfoGroups } from '../../../utils/infoGroups'
import { computeContextMenuPosition } from '../../../utils/ui'
import { ConfirmModal } from '../../ConfirmModal/ConfirmModal'
import { ContextMenu } from '../../ContextMenu/ContextMenu'
import { DeleteFileModal } from '../../DeleteFileModal/DeleteFileModal'
import { DestroyDriveModal } from '../../DestroyDriveModal/DestroyDriveModal'
import { GetInfoModal } from '../../GetInfoModal/GetInfoModal'
import { RenameFileModal } from '../../RenameFileModal/RenameFileModal'
import { Tooltip } from '../../Tooltip/Tooltip'
import { VersionHistoryModal } from '../../VersionHistoryModal/VersionHistoryModal'

import './FileItem.scss'

const MenuItem = ({
  disabled,
  danger,
  onClick,
  children,
}: {
  disabled?: boolean
  danger?: boolean
  onClick?: () => void
  children: React.ReactNode
}) => (
  <div
    className={`fm-context-item${danger ? ' red' : ''}`}
    aria-disabled={disabled ? 'true' : 'false'}
    style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
    onClick={disabled ? undefined : onClick}
  >
    {children}
  </div>
)

interface FileItemProps {
  fileInfo: FileInfo
  onDownload: (props: TrackDownloadProps) => (dp: DownloadProgress) => void
  showDriveColumn?: boolean
  driveName: string
  selected?: boolean
  onToggleSelected?: (fi: FileInfo, checked: boolean) => void
  bulkSelectedCount?: number
  onBulk: {
    download?: () => void
    restore?: () => void
    forget?: () => void
    destroy?: () => void
    delete?: () => void
  }
  setErrorMessage?: (error: string) => void
}

export function FileItem({
  fileInfo,
  onDownload,
  showDriveColumn,
  driveName,
  selected = false,
  onToggleSelected,
  bulkSelectedCount,
  onBulk,
  setErrorMessage,
}: FileItemProps): ReactElement {
  const { showContext, pos, contextRef, handleContextMenu, handleCloseContext } = useContextMenu<HTMLDivElement>()
  const { fm, adminDrive, currentDrive, files, drives, setShowError, refreshStamp } = useContext(FMContext)
  const { beeApi } = useContext(SettingsContext)
  const { view } = useView()

  const [driveStamp, setDriveStamp] = useState<PostageBatch | undefined>(undefined)
  const [safePos, setSafePos] = useState(pos)
  const [dropDir, setDropDir] = useState<Dir>(Dir.Down)
  const [showGetInfoModal, setShowGetInfoModal] = useState(false)
  const [infoGroups, setInfoGroups] = useState<FilePropertyGroup[] | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDestroyDriveModal, setShowDestroyDriveModal] = useState(false)
  const [destroyDrive, setDestroyDrive] = useState<DriveInfo | null>(null)
  const [confirmForget, setConfirmForget] = useState(false)
  const [confirmRestore, setConfirmRestore] = useState(false)

  const isMountedRef = useRef(true)
  const rafIdRef = useRef<number | null>(null)

  const size = formatBytes(fileInfo.customMetadata?.size)
  const dateMod = new Date(fileInfo.timestamp || 0).toLocaleDateString()
  const isTrashedFile = isTrashed(fileInfo)
  const statusLabel = isTrashedFile ? 'Trash' : 'Active'

  const latestFileInfo = useMemo(() => {
    return files.find(f => f.topic.toString() === fileInfo.topic.toString()) ?? fileInfo
  }, [files, fileInfo])

  useEffect(() => {
    isMountedRef.current = true

    const getStamps = async () => {
      const stamps = await getUsableStamps(beeApi)
      const driveStamp = stamps.find(s =>
        drives.some(d => d.batchId.toString() === s.batchID.toString() && d.id === fileInfo.driveId),
      )

      safeSetState(isMountedRef, setDriveStamp)(driveStamp)
    }

    getStamps()

    return () => {
      isMountedRef.current = false

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [beeApi, drives, fileInfo.driveId])

  const openGetInfo = useCallback(async () => {
    if (!fm || !isMountedRef.current) return

    const groups = await buildGetInfoGroups(fm, fileInfo, driveName, driveStamp)
    setInfoGroups(groups)
    setShowGetInfoModal(true)
  }, [fm, fileInfo, driveName, driveStamp])

  const takenNames = useMemo(() => {
    if (!currentDrive || !files) return new Set<string>()
    const wanted = currentDrive.batchId.toString()
    const sameDrive = files.filter(fi => fi.batchId.toString() === wanted)
    const out = new Set<string>()
    sameDrive.forEach(fi => {
      if (fi.topic.toString() !== fileInfo.topic.toString()) out.add(fi.name)
    })

    return out
  }, [files, currentDrive, fileInfo.topic])

  const handleDownload = useCallback(
    async (isNewWindow?: boolean) => {
      if (!fm || !beeApi) return

      handleCloseContext()

      const rawSize = latestFileInfo.customMetadata?.size
      const expectedSize = rawSize ? Number(rawSize) : undefined

      createDownloadAbort(latestFileInfo.name)

      await startDownloadingQueue(
        fm,
        [latestFileInfo],
        [
          onDownload({
            uuid: uuidV4(),
            name: latestFileInfo.name,
            size: formatBytes(rawSize),
            expectedSize,
            driveName,
          }),
        ],
        isNewWindow,
      )
    },
    [handleCloseContext, fm, beeApi, latestFileInfo, onDownload, driveName],
  )

  const handleFileAction = useCallback(
    async (operation: FileOperation) => {
      if (!fm || !driveStamp || !currentDrive) return

      await performFileOperation({
        fm,
        file: latestFileInfo,
        redundancyLevel: currentDrive.redundancyLevel,
        driveId: currentDrive.id.toString(),
        stamp: driveStamp,
        adminStamp: fm.adminStamp,
        adminRedundancy: adminDrive?.redundancyLevel,
        operation,
        onError: err => {
          setErrorMessage?.(err)
          setShowError(true)
        },
        onSuccess: () => {
          const stampToRefresh = operation === FileOperation.Forget ? fm.adminStamp : driveStamp

          if (stampToRefresh) {
            refreshStamp(stampToRefresh.batchID.toString())
          }
        },
      })
    },
    [fm, driveStamp, adminDrive, currentDrive, latestFileInfo, refreshStamp, setErrorMessage, setShowError],
  )

  const showDestroyDrive = useCallback(() => {
    setDestroyDrive(currentDrive || null)
    setShowDestroyDriveModal(true)
  }, [currentDrive])

  const doRename = useCallback(
    async (newName: string) => {
      if (!fm || !driveStamp || !currentDrive) {
        setErrorMessage?.('Invalid FM or Current Drive')
        setShowError(true)

        return
      }

      if (takenNames.has(newName)) throw new Error('name-taken')

      try {
        verifyDriveSpace({
          fm,
          redundancyLevel: currentDrive.redundancyLevel,
          stamp: driveStamp,
          useInfoSize: true,
          driveId: currentDrive.id.toString(),
          cb: err => {
            throw new Error(err)
          },
        })

        await fm.upload(
          currentDrive,
          {
            name: newName,
            topic: latestFileInfo.topic,
            file: {
              reference: latestFileInfo.file.reference,
              historyRef: latestFileInfo.file.historyRef,
            },
            customMetadata: latestFileInfo.customMetadata,
            files: [],
          },
          {
            actHistoryAddress: latestFileInfo.file.historyRef,
          },
        )

        refreshStamp(driveStamp.batchID.toString())
      } catch {
        setErrorMessage?.(`Error renaming file ${latestFileInfo.name}`)
        setShowError(true)
      }
    },

    [fm, driveStamp, currentDrive, latestFileInfo, takenNames, refreshStamp, setErrorMessage, setShowError],
  )

  const renderContextMenuItems = useCallback(() => {
    const isBulk = (bulkSelectedCount ?? 0) > 1

    const viewItem = (
      <MenuItem disabled={isBulk} onClick={() => handleDownload(true)}>
        View / Open
      </MenuItem>
    )

    const downloadItem = <MenuItem onClick={isBulk ? onBulk.download : () => handleDownload(false)}>Download</MenuItem>

    const getInfoItem = (
      <MenuItem
        disabled={isBulk}
        onClick={() => {
          handleCloseContext()
          openGetInfo()
        }}
      >
        Get info
      </MenuItem>
    )

    if (view === ViewType.File) {
      return (
        <>
          {viewItem}
          {downloadItem}
          <MenuItem
            disabled={isBulk}
            onClick={() => {
              handleCloseContext()
              setShowRenameModal(true)
            }}
          >
            Rename
          </MenuItem>
          <div className="fm-context-item-border" />
          <MenuItem
            disabled={isBulk}
            onClick={() => {
              handleCloseContext()
              setShowVersionHistory(true)
            }}
          >
            Version history
          </MenuItem>
          <MenuItem
            danger
            onClick={() => {
              handleCloseContext()

              if (isBulk) onBulk.delete?.()
              else setShowDeleteModal(true)
            }}
          >
            Delete
          </MenuItem>
          <div className="fm-context-item-border" />
          {getInfoItem}
        </>
      )
    }

    return (
      <>
        {viewItem}
        {downloadItem}
        <div className="fm-context-item-border" />
        {isBulk ? (
          <>
            <MenuItem danger onClick={onBulk.restore}>
              Restore
            </MenuItem>
            <MenuItem danger onClick={onBulk.destroy}>
              Destroy
            </MenuItem>
            <MenuItem danger onClick={onBulk.forget}>
              Forget permanently
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              danger
              onClick={() => {
                handleCloseContext()
                setConfirmRestore(true)
              }}
            >
              Restore
            </MenuItem>
            <MenuItem
              danger
              onClick={() => {
                handleCloseContext()
                // TODO: isn't parentDrive === currentDrive?
                const parentDrive = drives.find(d => d.id.toString() === fileInfo.driveId.toString())

                if (parentDrive) {
                  setDestroyDrive(parentDrive)
                  setShowDestroyDriveModal(true)
                } else if (currentDrive) {
                  setDestroyDrive(currentDrive)
                  setShowDestroyDriveModal(true)
                } else {
                  setErrorMessage?.('Unable to resolve drive for this file.')
                  setShowError(true)
                }
              }}
            >
              Destroy
            </MenuItem>

            <MenuItem
              danger
              onClick={() => {
                handleCloseContext()
                setConfirmForget(true)
              }}
            >
              Forget permanently
            </MenuItem>
          </>
        )}
        <div className="fm-context-item-border" />
        {getInfoItem}
      </>
    )
  }, [
    view,
    currentDrive,
    drives,
    bulkSelectedCount,
    onBulk,
    fileInfo.driveId,
    handleDownload,
    handleCloseContext,
    openGetInfo,
    setErrorMessage,
    setShowError,
  ])

  useLayoutEffect(() => {
    if (!showContext) return

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const menu = contextRef.current

      if (!menu) return

      const menuRect = menu.getBoundingClientRect()
      const containerEl = (menu.offsetParent as HTMLElement) ?? null
      const containerRect = containerEl?.getBoundingClientRect() ?? null

      const { safePos: s, dropDir: d } = computeContextMenuPosition({
        clickPos: pos,
        menuRect: menuRect,
        viewport: { w: window.innerWidth, h: window.innerHeight },
        margin: 8,
        containerRect,
      })

      const topLeft = containerRect
        ? { x: Math.round(s.x - containerRect.left), y: Math.round(s.y - containerRect.top) }
        : s
      setSafePos(topLeft)
      setDropDir(d)

      rafIdRef.current = null
    })

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [showContext, pos, contextRef])

  if (!currentDrive || !fm || !beeApi) {
    return <div className="fm-file-item-content">Error</div>
  }

  return (
    <div
      className="fm-file-item-content"
      onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.shiftKey) return
        handleContextMenu(e)
      }}
      onClick={handleCloseContext}
    >
      <div className="fm-file-item-content-item fm-checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onToggleSelected?.(fileInfo, e.target.checked)}
          onClick={e => e.stopPropagation()}
        />
      </div>

      <div className="fm-file-item-content-item fm-name" onDoubleClick={() => handleDownload(true)}>
        <GetIconElement name={fileInfo.name} metadata={fileInfo.customMetadata} />
        {truncateNameMiddle(fileInfo.name)}
      </div>

      {showDriveColumn && (
        <div className="fm-file-item-content-item fm-drive">
          <span className="fm-drive-name">{driveName}</span>
          <span className={`fm-pill ${isTrashedFile ? 'fm-pill--trash' : 'fm-pill--active'}`} title={statusLabel}>
            {statusLabel}
          </span>
        </div>
      )}

      <div className="fm-file-item-content-item fm-size">{size}</div>
      <div className="fm-file-item-content-item fm-date-mod">{dateMod}</div>

      {showContext && (
        <div
          ref={contextRef}
          className="fm-file-item-context-menu"
          style={{ top: safePos.y, left: safePos.x }}
          data-drop={dropDir}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        >
          <ContextMenu>{renderContextMenuItems()}</ContextMenu>
        </div>
      )}

      {showGetInfoModal && infoGroups && (
        <GetInfoModal
          name={fileInfo.name}
          properties={infoGroups}
          onCancelClick={() => {
            setShowGetInfoModal(false)
          }}
        />
      )}

      {showVersionHistory && (
        <VersionHistoryModal
          fileInfo={latestFileInfo}
          onCancelClick={() => {
            setShowVersionHistory(false)
          }}
          onDownload={onDownload}
        />
      )}

      {showDeleteModal && (
        <DeleteFileModal
          name={fileInfo.name}
          currentDriveName={currentDrive.name}
          onCancelClick={() => {
            setShowDeleteModal(false)
          }}
          onProceed={action => {
            setShowDeleteModal(false)

            switch (action) {
              case FileAction.Trash:
                handleFileAction(FileOperation.Trash)
                break
              case FileAction.Forget:
                setConfirmForget(true)
                break
              case FileAction.Destroy:
                showDestroyDrive()
                break
              default:
                break
            }
          }}
        />
      )}

      {showRenameModal && (
        <RenameFileModal
          currentName={fileInfo.name}
          takenNames={(() => {
            const sameDrive = files.filter(fi => fi.driveId.toString() === currentDrive.id.toString())
            const names = sameDrive.map(fi => fi.name).filter(n => n && n !== fileInfo.name)

            return new Set(names)
          })()}
          onCancelClick={() => {
            setShowRenameModal(false)
          }}
          onProceed={async newName => {
            try {
              setShowRenameModal(false)
              await doRename(newName)
            } catch {
              safeSetState(isMountedRef, setShowRenameModal)(true)
            }
          }}
        />
      )}

      {confirmForget && (
        <ConfirmModal
          title={
            <>
              Forget permanently?
              <Tooltip label={TOOLTIPS.FILE_OPERATION_FORGET} />
            </>
          }
          message={
            <>
              This removes <b title={fileInfo.name}>{fileInfo.name}</b> from your view.
              <br />
              The data remains on Swarm until the drive expires.
            </>
          }
          confirmLabel="Forget"
          cancelLabel="Cancel"
          onConfirm={async () => {
            await handleFileAction(FileOperation.Forget)

            safeSetState(isMountedRef, setConfirmForget)(false)
          }}
          onCancel={() => {
            setConfirmForget(false)
          }}
        />
      )}

      {confirmRestore && (
        <ConfirmModal
          title={
            <>
              Restore from trash?
              <Tooltip label={TOOLTIPS.FILE_OPERATION_RESTORE_FROM_TRASH} />
            </>
          }
          message={
            <>
              This will restore <b title={fileInfo.name}>{fileInfo.name}</b> from trash.
            </>
          }
          confirmLabel="Restore"
          cancelLabel="Cancel"
          onConfirm={async () => {
            await handleFileAction(FileOperation.Recover)

            safeSetState(isMountedRef, setConfirmRestore)(false)
          }}
          onCancel={() => {
            setConfirmRestore(false)
          }}
        />
      )}

      {showDestroyDriveModal && destroyDrive && (
        <DestroyDriveModal
          drive={destroyDrive}
          onCancelClick={() => {
            setShowDestroyDriveModal(false)
            setDestroyDrive(null)
          }}
          doDestroy={async () => {
            setShowDestroyDriveModal(false)

            await handleDestroyAndForgetDrive({
              beeApi,
              fm,
              drive: destroyDrive,
              adminDrive,
              isDestroy: true,
              onSuccess: () => {
                setShowDestroyDriveModal(false)
                setDestroyDrive(null)
              },
              onError: e => {
                setShowDestroyDriveModal(false)
                setErrorMessage?.(`Error destroying drive: ${destroyDrive.name}: ${e}`)
                setShowError(true)
              },
            })
          }}
        />
      )}
    </div>
  )
}
