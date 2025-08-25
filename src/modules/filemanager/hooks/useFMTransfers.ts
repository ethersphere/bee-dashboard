import { useCallback, useRef, useState } from 'react'
import { useFM } from '../providers/FMContext'

export type TransferItem = {
  name: string
  size?: string
  percent: number
  status: 'uploading' | 'finalizing' | 'done' | 'error'
}

function buildUploadMeta(files: File[] | FileList) {
  const arr = Array.from(files as File[])
  const totalSize = arr.reduce((acc, f) => acc + (f.size || 0), 0)
  const primary = arr[0]

  return {
    size: String(totalSize),
    fileCount: String(arr.length),
    mime: primary?.type || 'application/octet-stream',
  }
}

export function useFMTransfers() {
  const { fm, currentBatch, refreshFiles } = useFM()
  const [uploadItems, setUploadItems] = useState<TransferItem[]>([])
  const rampTimer = useRef<number | null>(null)

  const isUploading = uploadItems.some(i => i.status !== 'done' && i.status !== 'error')
  const uploadCount = uploadItems.length

  const startLinearRamp = useCallback((name: string) => {
    setUploadItems(prev =>
      prev.find(p => p.name === name) ? prev : [...prev, { name, percent: 0, status: 'uploading' }],
    )
    const begin = Date.now()
    const DURATION = 1500
    const tick = () => {
      const t = Math.min(1, (Date.now() - begin) / DURATION)
      const p = Math.floor(t * 75)
      setUploadItems(prev =>
        prev.map(it =>
          it.name === name && it.status === 'uploading' ? { ...it, percent: Math.max(it.percent, p) } : it,
        ),
      )

      if (t < 1) rampTimer.current = window.setTimeout(tick, 60)
    }
    tick()
  }, [])

  const finishLastQuarter = useCallback((name: string) => {
    if (rampTimer.current) {
      clearTimeout(rampTimer.current)
      rampTimer.current = null
    }
    setUploadItems(prev =>
      prev.map(it => (it.name === name ? { ...it, percent: Math.max(it.percent, 75), status: 'finalizing' } : it)),
    )
    const begin = Date.now()
    const DURATION = 700
    const tick = () => {
      const t = Math.min(1, (Date.now() - begin) / DURATION)
      const p = 75 + Math.floor(t * 25)
      setUploadItems(prev => prev.map(it => (it.name === name ? { ...it, percent: Math.max(it.percent, p) } : it)))

      if (t < 1) {
        window.setTimeout(tick, 60)
      } else {
        setUploadItems(prev => prev.map(it => (it.name === name ? { ...it, percent: 100, status: 'done' } : it)))
      }
    }
    tick()
  }, [])

  /** Upload using current drive (batch). Shows progress in the mini window. */
  const uploadFiles = useCallback(
    async (picked: FileList | File[]) => {
      if (!fm || !currentBatch) return
      const arr = Array.from(picked)

      if (arr.length === 0) return

      const name = arr[0].name
      startLinearRamp(name)

      const info = {
        info: {
          batchId: currentBatch.batchID.toString(),
          name,
          customMetadata: buildUploadMeta(arr),
        },
        files: arr,
      }

      try {
        await fm.upload(info as any)
        finishLastQuarter(name)
        refreshFiles()
      } catch {
        setUploadItems(prev => prev.map(it => (it.name === name ? { ...it, status: 'error' } : it)))
      }
    },
    [fm, currentBatch, refreshFiles, startLinearRamp, finishLastQuarter],
  )

  return {
    uploadFiles,
    isUploading,
    uploadCount,
    uploadItems,
  }
}
