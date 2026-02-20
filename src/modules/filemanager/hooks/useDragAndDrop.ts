import { DriveInfo } from '@solarpunkltd/file-manager-lib'
import React, { useCallback, useRef, useState } from 'react'

interface UseDragAndDropProps {
  onFilesDropped: (files: FileList) => void
  currentDrive: DriveInfo | null
}

interface UseDragAndDropReturn {
  isDragging: boolean
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  handleOverlayDrop: (e: React.DragEvent<HTMLDivElement>) => void
}

export function useDragAndDrop({ onFilesDropped }: UseDragAndDropProps): UseDragAndDropReturn {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  const hasFilesDT = (dt: DataTransfer | null): boolean => {
    if (!dt) return false

    if (dt.types && Array.from(dt.types).includes('Files')) return true

    if (dt.items && Array.from(dt.items).some(i => i.kind === 'file')) return true

    return false
  }

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!hasFilesDT(e.dataTransfer)) return
    e.preventDefault()

    if (dragCounter.current++ === 0) setIsDragging(true)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!hasFilesDT(e.dataTransfer)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!hasFilesDT(e.dataTransfer)) return
    e.preventDefault()
    dragCounter.current = Math.max(0, dragCounter.current - 1)

    if (dragCounter.current === 0) setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!hasFilesDT(e.dataTransfer)) return
      e.preventDefault()
      const droppedFiles = e.dataTransfer?.files ?? null
      dragCounter.current = 0
      setIsDragging(false)

      if (droppedFiles && droppedFiles.length) {
        onFilesDropped(droppedFiles)
      }
    },
    [onFilesDropped],
  )

  const handleOverlayDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      dragCounter.current = 0
      const dropped = e.dataTransfer?.files

      if (dropped && dropped.length) {
        onFilesDropped(dropped)
      }
    },
    [onFilesDropped],
  )

  return {
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleOverlayDrop,
  }
}
