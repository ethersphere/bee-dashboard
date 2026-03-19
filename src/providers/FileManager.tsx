import { Bee, PostageBatch } from '@ethersphere/bee-js'
import type { FileInfo } from '@solarpunkltd/file-manager-lib'
import { DriveInfo, FileManagerBase, FileManagerEvents } from '@solarpunkltd/file-manager-lib'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { FILE_MANAGER_EVENTS } from '../modules/filemanager/constants/common'
import { getUsableStamps } from '../modules/filemanager/utils/bee'
import { getSignerPk } from '../modules/filemanager/utils/common'

import { CheckState, Context as BeeContext } from './Bee'
import { Context as SettingsContext } from './Settings'

interface ContextInterface {
  fm: FileManagerBase | null
  initDone: boolean
  files: FileInfo[]
  currentDrive?: DriveInfo
  currentStamp?: PostageBatch
  drives: DriveInfo[]
  expiredDrives: DriveInfo[]
  adminDrive: DriveInfo | null
  initializationError: boolean
  showError?: boolean
  shallReset: boolean
  setCurrentDrive: (d: DriveInfo | undefined) => void
  setCurrentStamp: (s: PostageBatch | undefined) => void
  resync: () => Promise<void>
  init: () => Promise<FileManagerBase | null>
  notifyPkSaved: () => void
  setShowError: (show: boolean) => void
  syncDrives: () => Promise<void>
  refreshStamp: (batchId: string) => Promise<PostageBatch | undefined>
}

const initialValues: ContextInterface = {
  fm: null,
  initDone: false,
  files: [],
  currentDrive: undefined,
  currentStamp: undefined,
  drives: [],
  expiredDrives: [],
  adminDrive: null,
  initializationError: false,
  showError: false,
  shallReset: false,
  setCurrentDrive: () => {},
  setCurrentStamp: () => {},
  resync: async () => {},
  // eslint-disable-next-line require-await
  init: async () => null,
  notifyPkSaved: () => {},
  setShowError: () => {},
  syncDrives: async () => {},
  // eslint-disable-next-line require-await
  refreshStamp: async () => undefined,
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactNode
}

const findDrives = (
  allDrives: DriveInfo[],
  usableStamps: PostageBatch[],
): { adminDrive: DriveInfo | null; userDrives: DriveInfo[]; expiredDrives: DriveInfo[] } => {
  let adminDrive: DriveInfo | null = null
  const userDrives: DriveInfo[] = []
  const expiredDrives: DriveInfo[] = []

  allDrives.forEach(d => {
    const isNotExpired = usableStamps.some(s => s.batchID.toString() === d.batchId.toString())

    if (isNotExpired) {
      if (d.isAdmin) {
        adminDrive = d
      } else {
        userDrives.push(d)
      }
      // TODO: handle admin drive expiration!
    } else if (!d.isAdmin) {
      expiredDrives.push(d)
    }
  })

  return { adminDrive, userDrives, expiredDrives }
}

export function Provider({ children }: Props) {
  const initInProgressRef = useRef<boolean>(false)
  const isBeeApiInitialized = useRef<boolean>(false)

  const { status } = useContext(BeeContext)
  const { apiUrl } = useContext(SettingsContext)

  const apiUrlRef = useRef<string>(apiUrl)

  const [pkSaved, setPkSaved] = useState<boolean>(false)
  const [beeInstance, setBeeInstance] = useState<Bee | null>(null)
  const [fm, setFm] = useState<FileManagerBase | null>(null)
  const [initDone, setInitDone] = useState<boolean>(false)
  const [shallReset, setShallReset] = useState<boolean>(false)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [drives, setDrives] = useState<DriveInfo[]>([])
  const [expiredDrives, setExpiredDrives] = useState<DriveInfo[]>([])
  const [adminDrive, setAdminDrive] = useState<DriveInfo | null>(null)
  const [currentDrive, setCurrentDrive] = useState<DriveInfo | undefined>()
  const [currentStamp, setCurrentStamp] = useState<PostageBatch | undefined>()

  const [initializationError, setInitializationError] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)

  const notifyPkSaved = useCallback(() => setPkSaved(v => !v), [])

  const syncFiles = useCallback((manager: FileManagerBase, fi?: FileInfo, remove?: boolean): void => {
    if (fi) {
      if (remove) {
        setFiles(prev => prev.filter(f => f.topic.toString() !== fi.topic.toString()))

        return
      }

      setFiles(prev => {
        const existingIndex = prev.findIndex(f => f.topic.toString() === fi.topic.toString())

        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = fi

          return updated
        }

        return [...prev, fi]
      })

      return
    }

    setFiles([...manager.fileInfoList])
  }, [])

  const syncDrives = useCallback(
    async (manager: FileManagerBase, di?: DriveInfo, remove?: boolean): Promise<void> => {
      if (!beeInstance) {
        return
      }

      const usableStamps = await getUsableStamps(beeInstance)

      if (di) {
        const isNotExpired = usableStamps.some(s => s.batchID.toString() === di.batchId.toString())

        if (isNotExpired) {
          if (remove) {
            setDrives(prev => prev.filter(d => d.id.toString() !== di.id.toString()))

            return
          }

          if (di.isAdmin) {
            setAdminDrive(di)

            return
          }

          setDrives(prev => {
            const existingIndex = prev.findIndex(d => d.id.toString() === di.id.toString())

            if (existingIndex >= 0) {
              const updated = [...prev]
              updated[existingIndex] = di

              return updated
            }

            return [...prev, di]
          })

          return
        }

        if (remove) {
          setExpiredDrives(prev => prev.filter(d => d.id.toString() !== di.id.toString()))

          return
        }

        if (!di.isAdmin) {
          setExpiredDrives(prev => {
            const exists = prev.some(d => d.id.toString() === di.id.toString())

            return exists ? prev : [...prev, di]
          })

          return
        }

        // TODO: handle admin drive expiration!
        return
      }

      const { adminDrive: tmpAdminDrive, userDrives, expiredDrives } = findDrives(manager.driveList, usableStamps)
      setAdminDrive(tmpAdminDrive)
      setDrives(userDrives)
      setExpiredDrives(expiredDrives)
    },
    [beeInstance],
  )

  const syncDrivesPublic = useCallback(async () => {
    if (fm) {
      await syncDrives(fm)
    }
  }, [fm, syncDrives])

  const refreshStamp = useCallback(
    async (batchId: string): Promise<PostageBatch | undefined> => {
      if (!beeInstance) {
        return
      }

      const usableStamps = await getUsableStamps(beeInstance)
      const refreshedStamp = usableStamps.find(s => s.batchID.toString() === batchId)

      setCurrentStamp(prev => {
        if (prev && prev.batchID.toString() === batchId && refreshedStamp) {
          return refreshedStamp
        }

        return prev
      })

      return refreshedStamp
    },
    [beeInstance],
  )

  const init = useCallback(async (): Promise<FileManagerBase | null> => {
    const pk = getSignerPk()

    if (!beeInstance || !pk || initInProgressRef.current) return null

    initInProgressRef.current = true

    setFm(null)
    setInitDone(false)
    setFiles([])
    setDrives([])
    setAdminDrive(null)
    setInitializationError(false)
    setCurrentDrive(undefined)
    setCurrentStamp(undefined)
    setShallReset(false)

    const manager = new FileManagerBase(beeInstance)

    const handleInitialized = (success: boolean) => {
      setInitializationError(!success)
      setInitDone(true)

      if (success) {
        if (manager.adminStamp && !manager.adminStamp.usable) {
          // eslint-disable-next-line no-console
          console.warn('Admin stamp exists but is not usable')
          setShallReset(true)

          return
        }

        setFm(manager)
        syncDrives(manager)
        syncFiles(manager)
      }
    }

    const handleDriveCreated = ({ driveInfo }: { driveInfo: DriveInfo }) => {
      syncDrives(manager, driveInfo)
    }

    const handleDriveDestroyed = ({ driveInfo }: { driveInfo: DriveInfo }) => {
      syncDrives(manager, driveInfo, true)
      syncFiles(manager)
    }

    const handleDriveForgotten = ({ driveInfo }: { driveInfo: DriveInfo }) => {
      syncDrives(manager, driveInfo, true)
      syncFiles(manager)
    }

    const handleResetState = (isInvalid: boolean) => {
      setShallReset(isInvalid)
      setFiles([])
      setDrives([])
      setExpiredDrives([])
      setAdminDrive(null)
      setCurrentDrive(undefined)
      setCurrentStamp(undefined)
    }

    manager.emitter.on(FileManagerEvents.STATE_INVALID, handleResetState)
    manager.emitter.on(FileManagerEvents.INITIALIZED, handleInitialized)
    manager.emitter.on(FileManagerEvents.DRIVE_CREATED, handleDriveCreated)
    manager.emitter.on(FileManagerEvents.DRIVE_DESTROYED, handleDriveDestroyed)
    manager.emitter.on(FileManagerEvents.DRIVE_FORGOTTEN, handleDriveForgotten)
    manager.emitter.on(FileManagerEvents.FILE_UPLOADED, ({ fileInfo }: { fileInfo: FileInfo }) => {
      syncFiles(manager, fileInfo)
      window.dispatchEvent(new CustomEvent(FILE_MANAGER_EVENTS.FILE_UPLOADED, { detail: { fileInfo } }))
    })
    manager.emitter.on(FileManagerEvents.FILE_VERSION_RESTORED, ({ restored }: { restored: FileInfo }) =>
      syncFiles(manager, restored),
    )
    manager.emitter.on(FileManagerEvents.FILE_TRASHED, ({ fileInfo }: { fileInfo: FileInfo }) =>
      syncFiles(manager, fileInfo),
    )
    manager.emitter.on(FileManagerEvents.FILE_RECOVERED, ({ fileInfo }: { fileInfo: FileInfo }) =>
      syncFiles(manager, fileInfo),
    )
    manager.emitter.on(FileManagerEvents.FILE_FORGOTTEN, ({ fileInfo }: { fileInfo: FileInfo }) =>
      syncFiles(manager, fileInfo, true),
    )

    try {
      await manager.initialize()

      return manager
    } catch {
      setInitDone(true)

      return null
    } finally {
      initInProgressRef.current = false
    }
  }, [beeInstance, syncDrives, syncFiles])

  const resync = useCallback(async (): Promise<void> => {
    const prevDriveId = currentDrive?.id.toString()
    const prevStamp = currentStamp

    const manager = await init()

    if (prevDriveId && manager && beeInstance) {
      const refreshedDrive = manager.driveList.find(d => d.id.toString() === prevDriveId)
      setCurrentDrive(refreshedDrive)

      const uStamps: PostageBatch[] = await getUsableStamps(beeInstance)
      const isValidCurrentStamp = uStamps.find(s => s.batchID.toString() === prevStamp?.batchID.toString())

      setCurrentStamp(isValidCurrentStamp)
    }
  }, [beeInstance, currentDrive?.id, currentStamp, init])

  useEffect(() => {
    apiUrlRef.current = apiUrl
  }, [apiUrl])

  useEffect(() => {
    const isConnecting = status.all === CheckState.CONNECTING
    const isApiOk = status.apiConnection.isEnabled && status.apiConnection.checkState === CheckState.OK
    const currentApiUrl = apiUrlRef.current
    const pk = getSignerPk()

    if (!currentApiUrl || !pk) {
      isBeeApiInitialized.current = false
      setBeeInstance(null)

      return
    }

    if (isConnecting) {
      return
    }

    if (isBeeApiInitialized.current) {
      return
    }

    if (!isApiOk) {
      return
    }

    isBeeApiInitialized.current = true
    setBeeInstance(new Bee(currentApiUrl, { signer: pk }))
  }, [status.all, status.apiConnection, pkSaved])

  useEffect(() => {
    isBeeApiInitialized.current = false
    setBeeInstance(null)
    setInitDone(false)
    initInProgressRef.current = false
  }, [apiUrl])

  useEffect(() => {
    if (!beeInstance || initInProgressRef.current) {
      return
    }

    const initFromLocalState = async () => {
      await init()
    }

    initFromLocalState()
  }, [beeInstance, init])

  useEffect(() => {
    if (fm && drives.length === 0 && !adminDrive) {
      syncDrives(fm)
    }
  }, [fm, drives.length, adminDrive, syncDrives])

  const contextValue = useMemo(
    () => ({
      fm,
      initDone,
      files,
      currentDrive,
      currentStamp,
      drives,
      expiredDrives,
      adminDrive,
      initializationError,
      showError,
      shallReset,
      setCurrentDrive,
      setCurrentStamp,
      resync,
      init,
      notifyPkSaved,
      setShowError,
      syncDrives: syncDrivesPublic,
      refreshStamp,
    }),
    [
      fm,
      initDone,
      files,
      currentDrive,
      currentStamp,
      drives,
      expiredDrives,
      adminDrive,
      initializationError,
      showError,
      shallReset,
      setCurrentDrive,
      setCurrentStamp,
      resync,
      init,
      notifyPkSaved,
      setShowError,
      syncDrivesPublic,
      refreshStamp,
    ],
  )

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
