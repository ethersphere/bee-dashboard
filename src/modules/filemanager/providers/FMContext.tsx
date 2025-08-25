import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react'
import { BeeDev, PrivateKey, PostageBatch } from '@ethersphere/bee-js'
import type { FileInfo } from '@solarpunkltd/file-manager-lib'
import { FileManagerBase, FileManagerEvents } from '@solarpunkltd/file-manager-lib'
import { Context as SettingsContext } from '../../../providers/Settings'

interface FMContextValue {
  fm: FileManagerBase | null
  files: FileInfo[]
  currentBatch?: PostageBatch
  setCurrentBatch: (b: PostageBatch) => void
  refreshFiles: () => void
}

export const FMContext = createContext<FMContextValue>({
  fm: null,
  files: [],
  setCurrentBatch: () => {
    throw new Error('setCurrentBatch() called outside FMProvider')
  },
  refreshFiles: () => {
    throw new Error('refreshFiles() called outside FMProvider')
  },
})

export function FMProvider({ children }: { children: ReactNode }) {
  const { apiUrl } = useContext(SettingsContext)
  const [fm, setFm] = useState<FileManagerBase | null>(null)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [currentBatch, setCurrentBatch] = useState<PostageBatch | undefined>()

  const refreshFiles = useCallback(() => {
    if (fm) setFiles([...fm.fileInfoList])
  }, [fm])

  useEffect(() => {
    if (!apiUrl) return
    const raw = localStorage.getItem('privateKey')

    if (!raw) return

    let signer: PrivateKey
    try {
      signer = new PrivateKey(raw.startsWith('0x') ? raw.slice(2) : raw)
    } catch {
      return
    }

    const bee = new BeeDev(apiUrl, { signer })

    ;(async () => {
      try {
        // Prefer a usable non-owner drive; otherwise fall back to any usable.
        const all = await bee.getAllPostageBatch()
        const firstDrive =
          all.find(s => s.usable && s.label !== 'owner' && s.label !== 'owner-stamp') ?? all.find(s => s.usable)

        if (firstDrive) setCurrentBatch(firstDrive)
      } catch {
        // ignore
      }

      const manager = new FileManagerBase(bee)
      const sync = () => setFiles([...manager.fileInfoList])

      manager.emitter.on(FileManagerEvents.FILEMANAGER_INITIALIZED, sync)
      manager.emitter.on(FileManagerEvents.FILE_UPLOADED, sync)
      manager.emitter.on(FileManagerEvents.FILE_VERSION_RESTORED, sync)
      manager.emitter.on(FileManagerEvents.FILE_TRASHED, sync)
      manager.emitter.on(FileManagerEvents.FILE_RECOVERED, sync)
      manager.emitter.on(FileManagerEvents.FILE_FORGOTTEN, sync)

      try {
        await manager.initialize()
      } catch {
        // allow initialize to fail silently when no owner stamp exists
      }

      setFm(manager)
    })()
  }, [apiUrl])

  return (
    <FMContext.Provider value={{ fm, files, currentBatch, setCurrentBatch, refreshFiles }}>
      {children}
    </FMContext.Provider>
  )
}

export function useFM(): FMContextValue {
  return useContext(FMContext)
}
