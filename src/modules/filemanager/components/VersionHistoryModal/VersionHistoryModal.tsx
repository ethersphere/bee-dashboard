import { ReactElement, useEffect, useMemo, useState, useCallback, useContext } from 'react'
import './VersionHistoryModal.scss'
import '../../styles/global.scss'

import { Button } from '../Button/Button'
import { createPortal } from 'react-dom'
import HistoryIcon from 'remixicon-react/HistoryLineIcon'

import { Context as FMContext } from '../../../../providers/FileManager'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { FeedIndex } from '@ethersphere/bee-js'
import { ConflictAction, useUploadConflictDialog } from '../../hooks/useUploadConflictDialog'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'

import { verifyDriveSpace } from '../../utils/bee'
import { indexStrToBigint, truncateNameMiddle } from '../../utils/common'
import { VersionsList } from './VersionList/VersionList'
import { ActionTag, DownloadProgress, TrackDownloadProps } from '../../constants/transfers'
import { useTransfers } from '../../hooks/useTransfers'

const VERSION_HISTORY_PAGE_SIZE = 5

type RenameConfirmState = {
  version: FileInfo
  headName: string
  targetName: string
}

interface VersionHistoryModalProps {
  fileInfo: FileInfo
  onCancelClick: () => void
  onDownload?: (props: TrackDownloadProps) => (dp: DownloadProgress) => void
}

export function VersionHistoryModal({ fileInfo, onCancelClick, onDownload }: VersionHistoryModalProps): ReactElement {
  const { fm, files, currentDrive, currentStamp, refreshStamp } = useContext(FMContext)

  const localTransfers = useTransfers({})
  const trackDownload = onDownload ?? localTransfers.trackDownload

  const [openConflict, conflictPortal] = useUploadConflictDialog()
  const modalRoot = document.querySelector('.fm-main') || document.body

  const [allVersions, setAllVersions] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conflictWarning, setConflictWarning] = useState<string | null>(null)
  const [totalVersionsCount, setTotalVersionsCount] = useState<number>(0)

  const [renameConfirm, setRenameConfirm] = useState<RenameConfirmState | null>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const currentVersion = useMemo(() => {
    return indexStrToBigint(fileInfo.version) ?? BigInt(0)
  }, [fileInfo])

  const totalPages = Math.max(1, Math.ceil(totalVersionsCount / VERSION_HISTORY_PAGE_SIZE))
  const pageVersions = useMemo(() => {
    const startIndex = currentPage * VERSION_HISTORY_PAGE_SIZE
    const endIndex = startIndex + VERSION_HISTORY_PAGE_SIZE

    return allVersions.slice(startIndex, endIndex)
  }, [allVersions, currentPage])

  const loadVersionsForPage = useCallback(
    async (page: number) => {
      if (!fm) return

      const startIndex = page * VERSION_HISTORY_PAGE_SIZE
      const endIndex = startIndex + VERSION_HISTORY_PAGE_SIZE

      let hasVersionsForPage = false
      setAllVersions(prevVersions => {
        const currentTotal = Number(currentVersion + BigInt(1))
        hasVersionsForPage =
          prevVersions.slice(startIndex, endIndex).length === VERSION_HISTORY_PAGE_SIZE ||
          (page === Math.floor(currentTotal / VERSION_HISTORY_PAGE_SIZE) &&
            currentTotal % VERSION_HISTORY_PAGE_SIZE > 0)

        return prevVersions
      })

      if (hasVersionsForPage) {
        return
      }

      setLoading(true)
      setError(null)

      const startVersion = currentVersion - BigInt(page * VERSION_HISTORY_PAGE_SIZE)
      const endVersion = startVersion - BigInt(VERSION_HISTORY_PAGE_SIZE - 1)
      const versions: FileInfo[] = []

      for (let i = startVersion; i >= BigInt(0) && i >= endVersion; i--) {
        try {
          const version = await fm.getVersion(fileInfo, FeedIndex.fromBigInt(i).toString())
          versions.push(version)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`Failed to get version: ${i}, err: ${e}`)
        }
      }

      setAllVersions(prev => {
        const updated = [...prev]
        const insertIndex = page * VERSION_HISTORY_PAGE_SIZE

        for (let idx = 0; idx < versions.length; idx++) {
          updated[insertIndex + idx] = versions[idx]
        }

        return updated
      })

      setLoading(false)
    },
    [fm, currentVersion, fileInfo],
  )

  useEffect(() => {
    setCurrentPage(0)
    setError(null)
    setAllVersions([])

    const totalCount = Number(currentVersion + BigInt(1))
    setTotalVersionsCount(totalCount)

    if (!fm) {
      return
    }

    loadVersionsForPage(0)
  }, [fm, fileInfo, currentVersion, loadVersionsForPage])

  useEffect(() => {
    if (fm && currentPage > 0) {
      loadVersionsForPage(currentPage)
    }
  }, [currentPage, fm, loadVersionsForPage])

  // TODO: why max not infinite?
  const promptUniqueName = useCallback(
    async (
      initial: string,
      taken: Set<string>,
      forbidReplaceMsg: string,
      maxAttempts = 6,
    ): Promise<{ cancelled: boolean; name?: string }> => {
      let proposed = initial
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const choice = await openConflict({
          originalName: proposed,
          existingNames: taken,
        })

        if (!choice || choice.action === ConflictAction.Cancel) return { cancelled: true }

        if (choice.action === ConflictAction.KeepBoth) {
          if (!choice.newName || choice.newName.length === 0) {
            setConflictWarning('Empty new name. Please enter one.')

            return { cancelled: false }
          }

          const candidate = choice.newName.trim()

          if (candidate && !taken.has(candidate)) {
            return { cancelled: false, name: candidate }
          }
          setConflictWarning('That name is already taken. Please enter a different one.')
          proposed = candidate || proposed
        } else {
          setConflictWarning(forbidReplaceMsg)
        }
      }

      return { cancelled: true }
    },
    [openConflict],
  )

  const doRestore = useCallback(
    async (versionFi: FileInfo): Promise<void> => {
      if (!fm || !currentDrive || !currentStamp) return

      try {
        const restoredFrom = indexStrToBigint(versionFi.version)

        const srcLifecycleRaw = (versionFi.customMetadata?.lifecycle || '').trim().toLowerCase()
        const srcLifecycle: ActionTag | undefined =
          srcLifecycleRaw === ActionTag.Trashed || srcLifecycleRaw === ActionTag.Recovered
            ? (srcLifecycleRaw as ActionTag)
            : undefined

        const srcLifecycleAt =
          versionFi.customMetadata?.lifecycleAt ||
          (versionFi.timestamp ? new Date(versionFi.timestamp).toISOString() : undefined)

        const withMeta: FileInfo = {
          ...versionFi,
          customMetadata: {
            ...(versionFi.customMetadata ?? {}),
            lifecycle: ActionTag.Restored,
            lifecycleFrom: restoredFrom !== undefined ? `v${restoredFrom}` : '',
            lifecycleAt: new Date().toISOString(),
            restoredFromLifecycle: srcLifecycle ?? '',
            restoredFromLifecycleAt: srcLifecycleAt ?? '',
          },
        }

        verifyDriveSpace({
          fm,
          redundancyLevel: currentDrive.redundancyLevel,
          stamp: currentStamp,
          useInfoSize: true,
          driveId: versionFi.driveId,
          cb: err => {
            throw new Error(err)
          },
        })

        await fm.restoreVersion(withMeta)

        refreshStamp(versionFi.batchId.toString())
        onCancelClick()
      } catch (e) {
        const msg = (e as Error)?.message || JSON.stringify(e)
        setError(msg)
      }
    },
    [fm, currentStamp, currentDrive, refreshStamp, onCancelClick],
  )

  const restoreVersion = useCallback(
    async (versionFi: FileInfo): Promise<void> => {
      if (!fm) return

      const targetName = versionFi.name
      const headName = fileInfo.name

      const sameDrive = files.filter(fi => {
        return fi.driveId === versionFi.driveId.toString()
      })

      const nameConflicts = sameDrive.filter(fi => fi.name === targetName)
      const otherHistoryConflicts = nameConflicts.filter(fi => fi.topic.toString() !== fileInfo.topic.toString())

      if (targetName !== headName && otherHistoryConflicts.length === 0) {
        setRenameConfirm({ version: versionFi, headName, targetName })

        return
      }

      if (otherHistoryConflicts.length > 0) {
        const taken = new Set<string>(sameDrive.map(fi => fi.name))
        const forbidMsg =
          'Replace is not available because another file with that name belongs to a different history. Please choose “Keep both” and enter a different name.'
        const res = await promptUniqueName(targetName, taken, forbidMsg, 8)

        if (res.cancelled || !res.name) return

        versionFi.name = res.name
      }

      await doRestore(versionFi)
    },
    [fm, fileInfo, files, promptUniqueName, doRestore],
  )

  return createPortal(
    <div className="fm-modal-container">
      {conflictPortal}
      <div className="fm-modal-window fm-upgrade-drive-modal">
        <div className="fm-modal-window-header">
          <HistoryIcon size="21px" />
          <span className="fm-main-font-color">
            <>
              Version history –{' '}
              <span className="vh-title" title={fileInfo.name}>
                {truncateNameMiddle(fileInfo.name)}
              </span>
              {fileInfo && (
                <span
                  className="vh-title-sub"
                  title={`Version v${(indexStrToBigint(fileInfo.version) ?? 0).toString()}`}
                >
                  {' '}
                  (version v{(indexStrToBigint(fileInfo.version) ?? 0).toString()})
                </span>
              )}
            </>
          </span>
        </div>

        <div className="fm-modal-window-body fm-expiring-notification-modal-body">
          {error && <div className="fm-modal-white-section fm-soft-text">{error}</div>}

          {loading && <div className="fm-loading">Loading…</div>}
          {!error && !loading && pageVersions.length === 0 && (
            <div className="fm-empty">No versions found for this file.</div>
          )}
          {conflictWarning && (
            <div
              className="fm-modal-white-section fm-soft-text"
              style={{ borderLeft: '3px solid var(--fm-accent, #6aa7ff)' }}
            >
              {conflictWarning}
            </div>
          )}

          {renameConfirm && (
            <ConfirmModal
              title="Restore this version?"
              message={
                <>
                  Restoring will rename:&nbsp;
                  <b className="vh-name" title={renameConfirm.headName}>
                    {truncateNameMiddle(renameConfirm.headName)}
                  </b>{' '}
                  →{' '}
                  <b className="vh-name" title={renameConfirm.targetName}>
                    {truncateNameMiddle(renameConfirm.targetName)}
                  </b>
                  .
                </>
              }
              confirmLabel="Restore"
              cancelLabel="Cancel"
              onConfirm={async () => {
                await doRestore(renameConfirm.version)
                setRenameConfirm(null)
              }}
              onCancel={() => setRenameConfirm(null)}
            />
          )}

          <VersionsList
            versions={!error && !loading ? pageVersions : []}
            headFi={fileInfo}
            restoreVersion={restoreVersion}
            onDownload={trackDownload}
          />
        </div>

        <div className="fm-modal-window-footer vh-footer">
          <div className="vh-footer-left">
            <Button label="Close" variant="secondary" onClick={onCancelClick} />
          </div>
          <div className="vh-footer-right">
            <span className="vh-page">
              Page {Math.min(currentPage + 1, totalPages)} / {totalPages} · total {totalVersionsCount}
            </span>
            {currentPage > 0 && (
              <Button label="Previous" variant="secondary" onClick={() => setCurrentPage(p => p - 1)} />
            )}
            {currentPage + 1 < totalPages && (
              <Button label="Next" variant="primary" onClick={() => setCurrentPage(p => p + 1)} />
            )}
          </div>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
