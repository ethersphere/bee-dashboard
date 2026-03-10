import { PostageBatch } from '@ethersphere/bee-js'
import type { FileInfo } from '@solarpunkltd/file-manager-lib'
import { type RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { Context as FMContext } from '../../../providers/FileManager'
import { Context as SettingsContext } from '../../../providers/Settings'
import { uuidV4 } from '../../../utils'
import { DownloadProgress, TrackDownloadProps } from '../constants/transfers'
import { getUsableStamps } from '../utils/bee'
import { formatBytes, getFileId, safeSetState } from '../utils/common'
import { FileInfoWithUUID, startDownloadingQueue } from '../utils/download'
import { FileOperation, isElementPickerSupported, performBulkFileOperation } from '../utils/fileOperations'

export interface BulkOptions {
  listToRender: FileInfo[]
  trackDownload: (props: TrackDownloadProps) => (dp: DownloadProgress) => void
  setErrorMessage?: (error: string) => void
}

export interface BulkActionsResult {
  selectedIds: Set<string>
  selectedFiles: FileInfo[]
  selectedCount: number
  allChecked: boolean
  someChecked: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  toggleOne: (fi: FileInfo, checked: boolean) => void
  selectAll: () => void
  clearAll: () => void
  uploadFromPicker: () => void
  download: (list: FileInfo[]) => Promise<void>
  trash: (list: FileInfo[]) => Promise<void>
  restore: (list: FileInfo[]) => Promise<void>
  forget: (list: FileInfo[]) => Promise<void>
}

export function useBulkActions({ listToRender, trackDownload, setErrorMessage }: BulkOptions): BulkActionsResult {
  const { fm, adminDrive, currentDrive, drives, refreshStamp, setShowError } = useContext(FMContext)
  const { beeApi } = useContext(SettingsContext)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [driveStamps, setDriveStamps] = useState<PostageBatch[] | undefined>(undefined)
  const allIds = useMemo(() => listToRender.map(getFileId), [listToRender])
  const selectedCount = useMemo(() => allIds.filter(id => selectedIds.has(id)).length, [allIds, selectedIds])
  const allChecked = useMemo(() => allIds.length > 0 && selectedCount === allIds.length, [allIds.length, selectedCount])
  const someChecked = useMemo(() => selectedCount > 0 && !allChecked, [selectedCount, allChecked])
  const isMountedRef = useRef(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const selectedFiles = useMemo(
    () => listToRender.filter(fi => selectedIds.has(getFileId(fi))),
    [listToRender, selectedIds],
  )
  useEffect(() => {
    isMountedRef.current = true

    const getStamps = async () => {
      const stamps = await getUsableStamps(beeApi)
      const stampList = stamps.filter(s => drives.some(d => d.batchId.toString() === s.batchID.toString()))

      safeSetState(isMountedRef, setDriveStamps)(stampList)
    }

    getStamps()

    return () => {
      isMountedRef.current = false
    }
  }, [beeApi, drives])

  const toggleOne = useCallback((fi: FileInfo, checked: boolean) => {
    const id = getFileId(fi)
    setSelectedIds(prev => {
      const next = new Set(prev)

      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }

      return next
    })
  }, [])

  const selectAll = useCallback(() => setSelectedIds(new Set(allIds)), [allIds])
  const clearAll = useCallback(() => setSelectedIds(new Set()), [])

  const uploadFromPicker = useCallback(() => {
    const el = fileInputRef.current

    if (!el) return

    try {
      if (isElementPickerSupported(el)) {
        el.showPicker()
      } else {
        el.click()
      }
    } catch {
      el.click()
    }
  }, [])

  const download = useCallback(
    async (list: FileInfo[]) => {
      if (!fm || !list?.length) return

      const trackers = new Array<(progress: DownloadProgress) => void>(list.length)
      const infoListWitIDs: FileInfoWithUUID[] = new Array<FileInfoWithUUID>(list.length)

      for (let i = 0; i < list.length; i++) {
        const fi = list[i]
        const rawSize = fi.customMetadata?.size as string | number | undefined
        const prettySize = formatBytes(rawSize)
        const expected = rawSize ? Number(rawSize) : undefined
        const driveName = drives.find(d => d.id.toString() === fi.driveId.toString())?.name ?? currentDrive?.name
        const uuid = uuidV4()

        infoListWitIDs[i] = { uuid, info: fi }
        trackers[i] = trackDownload({
          uuid,
          name: fi.name,
          size: prettySize,
          expectedSize: expected,
          driveName: driveName ?? 'unknown',
        })
      }

      await startDownloadingQueue(fm, infoListWitIDs, trackers)
    },
    [fm, currentDrive, trackDownload, drives],
  )

  const trash = useCallback(
    async (list: FileInfo[]) => {
      if (!fm || !list?.length) return

      await performBulkFileOperation({
        fm,
        files: list,
        operation: FileOperation.Trash,
        stamps: driveStamps || [],
        onError: error => {
          setErrorMessage?.(error)
          setShowError(true)
        },
        onFileComplete: file => {
          refreshStamp(file.batchId.toString())
        },
      })

      clearAll()
    },
    [fm, driveStamps, clearAll, refreshStamp, setErrorMessage, setShowError],
  )

  const restore = useCallback(
    async (list: FileInfo[]) => {
      if (!fm || !list?.length) return

      await performBulkFileOperation({
        fm,
        files: list,
        operation: FileOperation.Recover,
        stamps: driveStamps || [],
        onError: error => {
          setErrorMessage?.(error)
          setShowError(true)
        },
        onFileComplete: file => {
          refreshStamp(file.batchId.toString())
        },
      })

      clearAll()
    },
    [fm, driveStamps, refreshStamp, clearAll, setErrorMessage, setShowError],
  )

  const forget = useCallback(
    async (list: FileInfo[]) => {
      if (!fm || !fm.adminStamp || !adminDrive || !list?.length) return

      await performBulkFileOperation({
        fm,
        files: list,
        operation: FileOperation.Forget,
        stamps: driveStamps || [],
        adminStamp: fm.adminStamp,
        adminDrive: adminDrive || undefined,
        onError: error => {
          setErrorMessage?.(error)
          setShowError(true)
        },
        onFileComplete: () => {
          if (fm.adminStamp) {
            refreshStamp(fm.adminStamp.batchID.toString())
          }
        },
      })

      clearAll()
    },
    [fm, adminDrive, driveStamps, clearAll, refreshStamp, setErrorMessage, setShowError],
  )

  return useMemo<BulkActionsResult>(
    () => ({
      selectedIds,
      selectedFiles,
      selectedCount,
      allChecked,
      someChecked,
      fileInputRef,
      toggleOne,
      selectAll,
      clearAll,
      uploadFromPicker,
      download,
      trash,
      restore,
      forget,
    }),
    [
      selectedIds,
      selectedFiles,
      selectedCount,
      allChecked,
      someChecked,
      toggleOne,
      selectAll,
      clearAll,
      uploadFromPicker,
      download,
      trash,
      restore,
      forget,
    ],
  )
}
