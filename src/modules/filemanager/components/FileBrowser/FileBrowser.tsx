import { ReactElement, useEffect, useLayoutEffect, useRef, useState, useContext } from 'react'
import './FileBrowser.scss'
import { FileBrowserHeader } from './FileBrowserHeader/FileBrowserHeader'
import { FileBrowserContent } from './FileBrowserContent/FileBrowserContent'
import { useContextMenu } from '../../hooks/useContextMenu'
import { NotificationBar } from '../NotificationBar/NotificationBar'
import { FileAction, FileTransferType, TransferStatus, ViewType } from '../../constants/transfers'
import { FileProgressNotification } from '../FileProgressNotification/FileProgressNotification'
import { useView } from '../../../../pages/filemanager/ViewContext'
import { Context as FMContext } from '../../../../providers/FileManager'
import { useTransfers } from '../../hooks/useTransfers'
import { useSearch } from '../../../../pages/filemanager/SearchContext'
import { useFileFiltering } from '../../hooks/useFileFiltering'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useBulkActions } from '../../hooks/useBulkActions'
import { SortKey, SortDir, useSorting } from '../../hooks/useSorting'

import { Point, Dir, safeSetState } from '../../utils/common'
import { computeContextMenuPosition } from '../../utils/ui'
import { FileBrowserTopBar } from './FileBrowserTopBar/FileBrowserTopBar'
import { handleDestroyDrive } from '../../utils/bee'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { ErrorModal } from '../ErrorModal/ErrorModal'
import { FileBrowserModals } from './FileBrowserModals'
import { FileBrowserContextMenu } from './FileBrowserMenu/FileBrowserContextMenu'
import { FileInfo } from '@solarpunkltd/file-manager-lib'

const extractFilesFromClipboardEvent = (e: React.ClipboardEvent): File[] => {
  const out: File[] = []
  const items = e.clipboardData?.items ?? []
  for (let i = 0; i < items.length; i++) {
    const it = items[i]

    if (it.kind === 'file') {
      const f = it.getAsFile()

      if (f) out.push(f)
    }
  }

  return out
}

interface FileBrowserProps {
  errorMessage?: string
  setErrorMessage?: (error: string) => void
}

export function FileBrowser({ errorMessage, setErrorMessage }: FileBrowserProps): ReactElement {
  const { showContext, pos, contextRef, handleContextMenu, handleCloseContext } = useContextMenu<HTMLDivElement>()
  const { view, setActualItemView } = useView()
  const { beeApi } = useContext(SettingsContext)
  const { files, currentDrive, resync, drives, fm, showError, setShowError } = useContext(FMContext)
  const {
    uploadFiles,
    isUploading,
    uploadItems,
    isDownloading,
    downloadItems,
    trackDownload,
    conflictPortal,
    cancelOrDismissUpload,
    cancelOrDismissDownload,
    dismissAllUploads,
    dismissAllDownloads,
  } = useTransfers({ setErrorMessage })

  const { query, scope, includeActive, includeTrashed } = useSearch()

  const [safePos, setSafePos] = useState<Point>(pos)
  const [dropDir, setDropDir] = useState<Dir>(Dir.Down)

  const legacyUploadRef = useRef<HTMLInputElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const isMountedRef = useRef(true)
  const rafIdRef = useRef<number | null>(null)

  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [showDestroyDriveModal, setShowDestroyDriveModal] = useState(false)
  const [confirmBulkForget, setConfirmBulkForget] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pendingCancelUpload, setPendingCancelUpload] = useState<string | null>(null)

  const q = query.trim().toLowerCase()
  const isSearchMode = q.length > 0

  const getDriveName = (fi: FileInfo): string => {
    const match = drives.find(d => d.id.toString() === fi.driveId.toString())

    return match?.name ?? ''
  }

  const openTopbarMenu = (anchorEl: HTMLElement) => {
    const r = anchorEl.getBoundingClientRect()
    const bodyRect = bodyRef.current?.getBoundingClientRect()
    const clickX = Math.round(r.right - 6)
    const minY = (bodyRect?.top ?? 0) + 8
    const clickY = Math.max(Math.round(r.bottom + 6), minY)
    const fakeEvt = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      preventDefault: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation: () => {},
      clientX: clickX,
      clientY: clickY,
    } as React.MouseEvent<HTMLDivElement>
    handleContextMenu(fakeEvt)
  }

  const { listToRender } = useFileFiltering({
    files,
    currentDrive: currentDrive || null,
    view,
    isSearchMode,
    query: q,
    scope,
    includeActive,
    includeTrashed,
  })

  const { sorted, sort, toggle, reset } = useSorting(listToRender, {
    persist: false,
    defaultState: { key: SortKey.Timestamp, dir: SortDir.Desc },
    getDriveName,
  })

  const bulk = useBulkActions({
    listToRender,
    trackDownload,
  })

  const { isDragging, handleDragEnter, handleDragOver, handleDragLeave, handleDrop, handleOverlayDrop } =
    useDragAndDrop({
      onFilesDropped: uploadFiles,
      currentDrive: currentDrive || null,
    })

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files && files.length > 0) {
      uploadFiles(files)
    }
    e.target.value = ''
  }

  const onContextUploadFile = () => {
    const el = legacyUploadRef.current

    if (!el) return

    try {
      if (typeof (el as HTMLInputElement).showPicker === 'function') {
        ;(el as HTMLInputElement).showPicker()
      } else {
        el.click()
      }
    } catch {
      el.click()
    }

    requestAnimationFrame(() => handleCloseContext())
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const files = extractFilesFromClipboardEvent(e)

    if (files.length === 0) return

    e.preventDefault()
    uploadFiles(files)
  }

  const handleFileBrowserContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement

    if (t.closest('.fm-file-item-context-menu, .fm-file-browser-context-menu')) return

    if (!e.shiftKey && t.closest('.fm-file-item-content')) return

    e.preventDefault()
    e.stopPropagation()
    handleContextMenu(e)
  }

  const handleDeleteModalProceed = async (action: FileAction) => {
    setShowBulkDeleteModal(false)

    if (action === FileAction.Trash) {
      return await bulk.bulkTrash(bulk.selectedFiles)
    }

    if (action === FileAction.Forget) {
      return setConfirmBulkForget(true)
    }

    if (action === FileAction.Destroy) {
      return setShowDestroyDriveModal(true)
    }
  }

  const handleDestroyDriveConfirm = async () => {
    if (!currentDrive) return

    setShowDestroyDriveModal(false)

    await handleDestroyDrive(
      beeApi,
      fm,
      currentDrive,
      () => {
        setShowDestroyDriveModal(false)
      },
      e => {
        setErrorMessage?.(`Error destroying drive: ${currentDrive.name}: ${e}`)
        setShowError(true)
      },
    )
  }

  const handleUploadClose = (name: string) => {
    const row = uploadItems.find(i => i.name === name)

    if (row?.status === TransferStatus.Uploading) {
      setPendingCancelUpload(name)
    } else {
      cancelOrDismissUpload(name)
    }
  }

  const updateContextMenuPosition = () => {
    const menu = contextRef.current
    const body = bodyRef.current

    if (!menu) return

    const rect = menu.getBoundingClientRect()
    const containerRect = body?.getBoundingClientRect() ?? null

    const { safePos: sp, dropDir: dd } = computeContextMenuPosition({
      clickPos: pos,
      menuRect: rect,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      margin: 8,
      containerRect,
    })

    const topLeft = containerRect
      ? { x: Math.round(sp.x - containerRect.left), y: Math.round(sp.y - containerRect.top + 2) }
      : sp

    setSafePos(topLeft)
    setDropDir(dd)
    rafIdRef.current = null
  }

  useLayoutEffect(() => {
    if (!showContext) return

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }

    rafIdRef.current = requestAnimationFrame(updateContextMenuPosition)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showContext, pos, contextRef])

  useEffect(() => {
    let title = currentDrive?.name || ''

    if (isSearchMode) {
      title = 'Search results'

      if (scope === 'selected' && currentDrive?.name) {
        title += ` — ${currentDrive.name}`
      }
    }

    setActualItemView?.(title)
  }, [isSearchMode, scope, currentDrive, setActualItemView])

  useEffect(() => {
    if (!isSearchMode) {
      bulk.clearAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchMode])

  useEffect(() => {
    return () => {
      isMountedRef.current = false

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const doRefresh = async () => {
    handleCloseContext()

    if (isRefreshing) return

    setIsRefreshing(true)

    try {
      await resync()
    } finally {
      safeSetState(isMountedRef, setIsRefreshing)(false)
    }
  }

  const showDeleteModal = showBulkDeleteModal && bulk.selectedFiles.length > 0 && view === ViewType.File
  const showDragOverlay = isDragging && Boolean(currentDrive)
  const fileCountText = bulk.selectedFiles.length === 1 ? 'file' : 'files'

  return (
    <>
      {conflictPortal}

      <input type="file" ref={legacyUploadRef} style={{ display: 'none' }} onChange={onFileSelected} multiple />
      <input type="file" ref={bulk.fileInputRef} style={{ display: 'none' }} onChange={onFileSelected} multiple />

      <div className="fm-file-browser-container" data-search-mode={isSearchMode ? 'true' : 'false'}>
        <FileBrowserTopBar onOpenMenu={openTopbarMenu} canOpen={!isSearchMode && Boolean(currentDrive)} />
        <div
          className="fm-file-browser-content"
          data-search-mode={isSearchMode ? 'true' : 'false'}
          ref={contentRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          onContextMenu={handleFileBrowserContextMenu}
        >
          <FileBrowserHeader
            key={isSearchMode ? 'hdr-search' : 'hdr-normal'}
            isSearchMode={isSearchMode}
            bulk={bulk}
            sortKey={sort.key}
            sortDir={sort.dir}
            onSortName={() => toggle(SortKey.Name)}
            onSortSize={() => toggle(SortKey.Size)}
            onSortDate={() => toggle(SortKey.Timestamp)}
            onSortDrive={() => toggle(SortKey.Drive)}
            onClearSort={reset}
          />
          <div
            className="fm-file-browser-content-body"
            ref={bodyRef}
            onMouseDown={e => {
              if (e.button !== 0) return
              handleCloseContext()
            }}
          >
            <FileBrowserContent
              key={isSearchMode ? `content-search` : `content-${currentDrive?.id.toString() ?? 'none'}`}
              listToRender={sorted}
              drives={drives}
              currentDrive={currentDrive || null}
              view={view}
              isSearchMode={isSearchMode}
              trackDownload={trackDownload}
              selectedIds={bulk.selectedIds}
              onToggleSelected={bulk.toggleOne}
              bulkSelectedCount={bulk.selectedCount}
              onBulk={{
                download: () => bulk.bulkDownload(bulk.selectedFiles),
                restore: () => bulk.bulkRestore(bulk.selectedFiles),
                forget: () => bulk.bulkForget(bulk.selectedFiles),
                destroy: () => setShowDestroyDriveModal(true),
                delete: () => setShowBulkDeleteModal(true),
              }}
              setErrorMessage={setErrorMessage}
            />
            {showError && (
              <ErrorModal
                label={errorMessage || 'An error occurred'}
                onClick={() => {
                  setShowError(false)
                  setErrorMessage?.('')

                  return
                }}
              />
            )}

            {showContext && (
              <div
                ref={contextRef}
                className="fm-file-browser-context-menu fm-context-menu"
                style={{ top: safePos.y, left: safePos.x }}
                data-drop={dropDir}
                onMouseDown={e => e.stopPropagation()}
                onClick={e => e.stopPropagation()}
              >
                <FileBrowserContextMenu
                  drives={drives}
                  view={view}
                  selectedFilesCount={bulk.selectedFiles.length}
                  onRefresh={doRefresh}
                  enableRefresh={Boolean(fm?.adminStamp)}
                  onUploadFile={onContextUploadFile}
                  onBulkDownload={() => bulk.bulkDownload(bulk.selectedFiles)}
                  onBulkRestore={() => bulk.bulkRestore(bulk.selectedFiles)}
                  onBulkDelete={() => setShowBulkDeleteModal(true)}
                  onBulkDestroy={() => setShowDestroyDriveModal(true)}
                  onBulkForget={() => bulk.bulkForget(bulk.selectedFiles)}
                />
              </div>
            )}
          </div>

          {showDragOverlay && (
            <div
              className="fm-drag-overlay"
              onDragOver={e => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
              }}
              onDrop={handleOverlayDrop}
            >
              <div className="fm-drag-text">Drop file(s) to upload</div>
            </div>
          )}

          <FileBrowserModals
            showDeleteModal={showDeleteModal}
            selectedFiles={bulk.selectedFiles}
            fileCountText={fileCountText}
            currentDrive={currentDrive || null}
            confirmBulkForget={confirmBulkForget}
            showDestroyDriveModal={showDestroyDriveModal}
            pendingCancelUpload={pendingCancelUpload}
            onDeleteCancel={() => setShowBulkDeleteModal(false)}
            onDeleteProceed={handleDeleteModalProceed}
            onForgetConfirm={async () => {
              await bulk.bulkForget(bulk.selectedFiles)
              setConfirmBulkForget(false)
            }}
            onForgetCancel={() => setConfirmBulkForget(false)}
            onDestroyCancel={() => setShowDestroyDriveModal(false)}
            onDestroyConfirm={handleDestroyDriveConfirm}
            onCancelUploadConfirm={() => {
              if (pendingCancelUpload) {
                cancelOrDismissUpload(pendingCancelUpload)
                setPendingCancelUpload(null)
              }
            }}
            onCancelUploadCancel={() => setPendingCancelUpload(null)}
          />

          {isRefreshing && (
            <div className="fm-refresh-overlay" aria-busy="true" aria-live="polite">
              <div className="fm-refresh-content">
                <div className="fm-mini-spinner" role="status" aria-label="Syncing…" />
                <span className="fm-refresh-text">Syncing latest files…</span>
              </div>
            </div>
          )}
        </div>

        <div className="fm-file-browser-footer">
          <FileProgressNotification
            label="Uploading files"
            type={FileTransferType.Upload}
            open={isUploading}
            count={uploadItems.length}
            items={uploadItems}
            onRowClose={handleUploadClose}
            onCloseAll={() => dismissAllUploads()}
          />
          <FileProgressNotification
            label="Downloading files"
            type={FileTransferType.Download}
            open={isDownloading}
            count={downloadItems.length}
            items={downloadItems}
            onRowClose={name => cancelOrDismissDownload(name)}
            onCloseAll={() => dismissAllDownloads()}
          />
          <NotificationBar setErrorMessage={setErrorMessage} />
        </div>
      </div>
    </>
  )
}
