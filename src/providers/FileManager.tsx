import { createContext, useCallback, useContext, useState, ReactNode, useEffect } from 'react'
import { Bee, PostageBatch } from '@ethersphere/bee-js'
import type { FileInfo } from '@solarpunkltd/file-manager-lib'
import { FileManagerBase, FileManagerEvents } from '@solarpunkltd/file-manager-lib'
import { Context as SettingsContext } from './Settings'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'
import { getSignerPk } from '../modules/filemanager/utils/common'
import { getUsableStamps, validateStampStillExists } from '../../src/modules/filemanager/utils/bee'

interface ContextInterface {
  fm: FileManagerBase | null
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
  setShowError: (show: boolean) => void
  syncDrives: () => Promise<void>
  refreshStamp: (batchId: string) => Promise<PostageBatch | undefined>
}

const initialValues: ContextInterface = {
  fm: null,
  files: [],
  currentDrive: undefined,
  currentStamp: undefined,
  drives: [],
  expiredDrives: [],
  adminDrive: null,
  initializationError: false,
  showError: false,
  shallReset: false,
  setCurrentDrive: () => {}, // eslint-disable-line
  setCurrentStamp: () => {}, // eslint-disable-line
  resync: async () => {}, // eslint-disable-line
  init: async () => null, // eslint-disable-line
  setShowError: () => {}, // eslint-disable-line
  syncDrives: async () => {}, // eslint-disable-line
  refreshStamp: async () => undefined, // eslint-disable-line
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
  const { apiUrl, beeApi } = useContext(SettingsContext)

  const [fm, setFm] = useState<FileManagerBase | null>(null)
  const [shallReset, setShallReset] = useState<boolean>(false)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [drives, setDrives] = useState<DriveInfo[]>([])
  const [expiredDrives, setExpiredDrives] = useState<DriveInfo[]>([])
  const [adminDrive, setAdminDrive] = useState<DriveInfo | null>(null)
  const [currentDrive, setCurrentDrive] = useState<DriveInfo | undefined>()
  const [currentStamp, setCurrentStamp] = useState<PostageBatch | undefined>()

  const [initializationError, setInitializationError] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)

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
      const usableStamps = await getUsableStamps(beeApi)

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
    [beeApi],
  )

  const syncDrivesPublic = useCallback(async () => {
    if (fm) {
      await syncDrives(fm)
    }
  }, [fm, syncDrives])

  // no useCallback is needed because it caches the stamp
  const refreshStamp = async (batchId: string): Promise<PostageBatch | undefined> => {
    const usableStamps = await getUsableStamps(beeApi)
    const refreshedStamp = usableStamps.find(s => s.batchID.toString() === batchId)

    if (currentStamp && currentStamp.batchID.toString() === batchId && refreshedStamp) {
      setCurrentStamp(refreshedStamp)
    }

    return refreshedStamp
  }

  const init = useCallback(async (): Promise<FileManagerBase | null> => {
    const pk = getSignerPk()

    if (!apiUrl || !pk) return null

    setFm(null)
    setFiles([])
    setDrives([])
    setAdminDrive(null)
    setInitializationError(false)
    setCurrentDrive(undefined)
    setCurrentStamp(undefined)

    const bee = new Bee(apiUrl, { signer: pk })
    const manager = new FileManagerBase(bee)

    const handleInitialized = async (success: boolean) => {
      setInitializationError(!success)

      if (success) {
        // need to wait for beeApi to init cause it can set invalid state incorrectly
        if (manager.adminStamp && beeApi) {
          const isAdminStampValid = await validateStampStillExists(beeApi, manager.adminStamp.batchID)

          if (!isAdminStampValid) {
            setShallReset(true)
            setInitializationError(true)

            return
          }
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
    }

    manager.emitter.on(FileManagerEvents.STATE_INVALID, handleResetState)
    manager.emitter.on(FileManagerEvents.INITIALIZED, handleInitialized)
    manager.emitter.on(FileManagerEvents.DRIVE_CREATED, handleDriveCreated)
    manager.emitter.on(FileManagerEvents.DRIVE_DESTROYED, handleDriveDestroyed)
    manager.emitter.on(FileManagerEvents.DRIVE_FORGOTTEN, handleDriveForgotten)
    manager.emitter.on(FileManagerEvents.FILE_UPLOADED, ({ fileInfo }: { fileInfo: FileInfo }) =>
      syncFiles(manager, fileInfo),
    )
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
    } catch (error) {
      return null
    }
  }, [apiUrl, beeApi, syncDrives, syncFiles])

  const resync = useCallback(async (): Promise<void> => {
    const prevDriveId = currentDrive?.id.toString()
    const prevStamp = currentStamp

    const manager = await init()

    if (prevDriveId && manager) {
      const refreshedDrive = manager.driveList.find(d => d.id.toString() === prevDriveId)
      setCurrentDrive(refreshedDrive)

      const isValidCurrentStamp = (await getUsableStamps(beeApi)).find(
        s => s.batchID.toString() === prevStamp?.batchID.toString(),
      )

      setCurrentStamp(isValidCurrentStamp)
    }
  }, [currentDrive?.id, currentStamp, init, setCurrentDrive, setCurrentStamp, beeApi])

  useEffect(() => {
    const pk = getSignerPk()

    if (!pk || fm) return

    const initFromLocalState = async () => {
      await init()
    }

    initFromLocalState()
  }, [fm, init])

  return (
    <Context.Provider
      value={{
        fm,
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
        setShowError,
        syncDrives: syncDrivesPublic,
        refreshStamp,
      }}
    >
      {children}
    </Context.Provider>
  )
}
