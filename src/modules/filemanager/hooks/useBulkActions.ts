import { useCallback, useMemo, useRef, useState, useContext, useEffect } from 'react'
import type { FileInfo } from '@solarpunkltd/file-manager-lib'
import { PostageBatch } from '@ethersphere/bee-js'
import { Context as FMContext } from '../../../providers/FileManager'
import { Context as SettingsContext } from '../../../providers/Settings'
import { startDownloadingQueue } from '../utils/download'
import { formatBytes, getFileId, safeSetState } from '../utils/common'
import { DownloadProgress, TrackDownloadProps } from '../constants/transfers'
import { getUsableStamps } from '../utils/bee'
import { performBulkFileOperation, FileOperation } from '../utils/fileOperations'
import { uuidV4 } from '../../../utils'

interface BulkOptions {
  listToRender: FileInfo[]
  trackDownload: (props: TrackDownloadProps) => (dp: DownloadProgress) => void
  setErrorMessage?: (error: string) => void
}

export function useBulkActions({ listToRender, setErrorMessage, trackDownload }: BulkOptions) {
  const { fm, adminDrive, drives, refreshStamp, setShowError } = useContext(FMContext)
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

  const bulkUploadFromPicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const bulkDownload = useCallback(
    async (list: FileInfo[]) => {
      if (!fm || !list?.length) return

      const trackers: Array<(progress: DownloadProgress) => void> = []
      for (const fi of list) {
        const rawSize = fi.customMetadata?.size as string | number | undefined
        const prettySize = formatBytes(rawSize)
        const expected = rawSize ? Number(rawSize) : undefined
        const driveName = drives.find(d => d.id.toString() === fi.driveId.toString())?.name
        const tracker = trackDownload({
          uuid: uuidV4(),
          name: fi.name,
          size: prettySize,
          expectedSize: expected,
          driveName,
        })
        trackers.push(tracker)
      }

      await startDownloadingQueue(fm, list, trackers)
    },
    [fm, trackDownload, drives],
  )

  const bulkTrash = useCallback(
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

  const bulkRestore = useCallback(
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

  const bulkForget = useCallback(
    async (list: FileInfo[]) => {
      if (!fm || !fm.adminStamp || !adminDrive || !list?.length) return

      await performBulkFileOperation({
        fm,
        files: list,
        operation: FileOperation.Forget,
        stamps: driveStamps || [],
        adminStamp: fm.adminStamp,
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

  return useMemo(
    () => ({
      // selection
      selectedIds,
      setSelectedIds,
      selectedFiles,
      selectedCount,
      allChecked,
      someChecked,
      toggleOne,
      selectAll,
      clearAll,
      // file input (for bulk upload)
      fileInputRef,
      bulkUploadFromPicker,
      // actions
      bulkDownload,
      bulkTrash,
      bulkRestore,
      bulkForget,
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
      bulkUploadFromPicker,
      bulkDownload,
      bulkTrash,
      bulkRestore,
      bulkForget,
    ],
  )
}
