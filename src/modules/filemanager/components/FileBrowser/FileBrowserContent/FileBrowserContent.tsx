import { DriveInfo, FileInfo } from '@solarpunkltd/file-manager-lib'
import { memo, ReactElement, useCallback } from 'react'

import { DownloadProgress, TrackDownloadProps, ViewType } from '../../../constants/transfers'
import { getFileId } from '../../../utils/common'
import { FileItem } from '../FileItem/FileItem'

interface FileBrowserContentProps {
  listToRender: FileInfo[]
  drives: DriveInfo[]
  currentDrive: DriveInfo | null
  view: ViewType
  isSearchMode: boolean
  trackDownload: (props: TrackDownloadProps) => (dp: DownloadProgress) => void
  selectedIds?: Set<string>
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

function FileBrowserContentInner({
  listToRender,
  drives,
  currentDrive,
  view,
  isSearchMode,
  trackDownload,
  selectedIds,
  onToggleSelected,
  bulkSelectedCount,
  onBulk,
  setErrorMessage,
}: FileBrowserContentProps): ReactElement {
  const renderEmptyState = useCallback((): ReactElement => {
    if (drives.length === 0) {
      return <div className="fm-drop-hint">Create a drive to start using the file manager</div>
    }

    if (!currentDrive) {
      return <div className="fm-drop-hint">Select a drive to upload or view its files</div>
    }

    if (view === ViewType.Trash) {
      return (
        <div className="fm-drop-hint">
          Files from &quot;{currentDrive?.name}&quot; that are trashed can be viewed here
        </div>
      )
    }

    return <div className="fm-drop-hint">Drag &amp; drop files here into &quot;{currentDrive?.name}&quot;</div>
  }, [drives, currentDrive, view])

  const renderFileList = useCallback(
    (filesToRender: FileInfo[], showDriveColumn = false): ReactElement[] => {
      return filesToRender
        .map(fi => {
          const drive = drives.find(d => d.id.toString() === fi.driveId.toString())

          return drive ? { fi, driveName: drive.name } : null
        })
        .filter((item): item is { fi: FileInfo; driveName: string } => item !== null)
        .map(({ fi, driveName }) => {
          const key = `${getFileId(fi)}::${fi.version ?? ''}::${showDriveColumn ? 'search' : 'normal'}`

          return (
            <FileItem
              key={key}
              fileInfo={fi}
              onDownload={trackDownload}
              showDriveColumn={showDriveColumn}
              driveName={driveName}
              selected={Boolean(selectedIds?.has(getFileId(fi)))}
              onToggleSelected={onToggleSelected}
              bulkSelectedCount={bulkSelectedCount}
              onBulk={onBulk}
              setErrorMessage={setErrorMessage}
            />
          )
        })
    },
    [trackDownload, drives, selectedIds, onToggleSelected, bulkSelectedCount, onBulk, setErrorMessage],
  )

  if (drives.length === 0) {
    return renderEmptyState()
  }

  if (!isSearchMode) {
    if (!currentDrive) {
      return <div className="fm-drop-hint">Select a drive to upload or view its files</div>
    }

    if (view === ViewType.Expired) {
      return (
        <div className="fm-drop-hint">
          The stamp for drive &quot;{currentDrive?.name}&quot; is expired, no files can be found
        </div>
      )
    }

    if (listToRender.length === 0) {
      if (view === ViewType.Trash) {
        return (
          <div className="fm-drop-hint">
            Files from &quot;{currentDrive?.name}&quot; that are trashed can be viewed here
          </div>
        )
      }

      return <div className="fm-drop-hint">Drag &amp; drop files here into &quot;{currentDrive?.name}&quot;</div>
    }

    return <>{renderFileList(listToRender)}</>
  }

  if (listToRender.length === 0) {
    return <div className="fm-drop-hint">No results found.</div>
  }

  return <>{renderFileList(listToRender, true)}</>
}

// Memoize to prevent rerenders when parent FileBrowser rerenders due to upload/download progress
export const FileBrowserContent = memo(FileBrowserContentInner)
