import { ReactElement, useContext, useEffect, useState } from 'react'

import './Sidebar.scss'
import Add from 'remixicon-react/AddLineIcon'
import Folder from 'remixicon-react/Folder3LineIcon'
import FolderFill from 'remixicon-react/Folder3FillIcon'
import ArrowRight from 'remixicon-react/ArrowRightSLineIcon'
import ArrowDown from 'remixicon-react/ArrowDownSLineIcon'
import Delete from 'remixicon-react/DeleteBin6LineIcon'
import DeleteFill from 'remixicon-react/DeleteBin6FillIcon'
import History from 'remixicon-react/HistoryLineIcon'
import HistoryFill from 'remixicon-react/HistoryFillIcon'
import { DriveItem } from './DriveItem/DriveItem'
import { ExpiredDriveItem } from './DriveItem/ExpiredDriveItem'
import { CreateDriveModal } from '../CreateDriveModal/CreateDriveModal'
import { ViewType } from '../../constants/transfers'
import { PostageBatch } from '@ethersphere/bee-js'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { useView } from '../../../../pages/filemanager/ViewContext'
import { Context as FMContext } from '../../../../providers/FileManager'
import { getUsableStamps } from '../../utils/bee'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'

interface SidebarProps {
  loading: boolean
  errorMessage?: string
  setErrorMessage?: (error: string) => void
}

export function Sidebar({ setErrorMessage, loading }: SidebarProps): ReactElement {
  const [hovered, setHovered] = useState<string | null>(null)
  const [isMyDrivesOpen, setIsMyDriveOpen] = useState(true)
  const [isTrashOpen, setIsTrashOpen] = useState(false)
  const [isCreateDriveOpen, setIsCreateDriveOpen] = useState(false)
  const [usableStamps, setUsableStamps] = useState<PostageBatch[]>([])
  const [isDriveCreationInProgress, setIsDriveCreationInProgress] = useState(false)
  const [isExpiredOpen, setIsExpiredOpen] = useState(false)

  const { beeApi } = useContext(SettingsContext)
  const { setView, view } = useView()
  const {
    fm,
    currentDrive,
    currentStamp,
    drives,
    expiredDrives,
    setCurrentDrive,
    setCurrentStamp,
    setShowError,
    syncDrives,
  } = useContext(FMContext)

  useEffect(() => {
    let isMounted = true

    const getStamps = async () => {
      const stamps = await getUsableStamps(beeApi)

      if (isMounted) {
        setUsableStamps([...stamps])
      }
    }

    if (beeApi) {
      getStamps()
    }

    return () => {
      isMounted = false
    }
  }, [beeApi, drives])

  useEffect(() => {
    if (!fm || drives.length === 0) {
      return
    }

    if (!currentDrive) {
      const firstDrive = drives[0]
      setCurrentDrive(firstDrive)
      setView(ViewType.File)
    }

    if (currentDrive && !currentStamp && usableStamps.length > 0) {
      const correspondingStamp = usableStamps.find(s => s.batchID.toString() === currentDrive.batchId.toString())

      if (correspondingStamp) {
        setCurrentStamp(correspondingStamp)
      }
    }
  }, [fm, drives, currentDrive, currentStamp, usableStamps, setCurrentDrive, setCurrentStamp, setView])

  const isCurrent = (di: DriveInfo) => currentDrive?.id.toString() === di.id.toString()

  return (
    <div className="fm-sidebar">
      <div className="fm-sidebar-content">
        {!loading && (
          <div className="fm-sidebar-item" onClick={() => setIsCreateDriveOpen(true)}>
            <div className="fm-sidebar-item-icon">
              <Add size="16px" />
            </div>
            <div>Create new drive</div>
          </div>
        )}

        {isCreateDriveOpen && (
          <CreateDriveModal
            onCancelClick={() => setIsCreateDriveOpen(false)}
            onDriveCreated={() => {
              setIsCreateDriveOpen(false)
              setIsDriveCreationInProgress(false)
            }}
            onCreationStarted={() => setIsDriveCreationInProgress(true)}
            onCreationError={(name: string) => {
              setIsDriveCreationInProgress(false)
              setErrorMessage?.(`Error creating drive: ${name}`)
              setShowError(true)

              return
            }}
          />
        )}

        <div
          className="fm-sidebar-item"
          onMouseEnter={() => setHovered('my-drives')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setIsMyDriveOpen(!isMyDrivesOpen)}
        >
          <div className="fm-sidebar-item-icon">
            {isMyDrivesOpen ? <ArrowDown size="16px" /> : <ArrowRight size="16px" />}
          </div>
          <div className="fm-sidebar-item-icon" style={{ opacity: hovered === 'my-drives' ? 1 : 1 }}>
            {hovered === 'my-drives' ? <FolderFill size="16px" /> : <Folder size="16px" />}
          </div>
          <div>My Drives</div>
        </div>

        {isMyDrivesOpen && isDriveCreationInProgress && (
          <div className="fm-drive-item-container fm-drive-item-creating" aria-live="polite">
            <div className="fm-drive-item-info">
              <div className="fm-drive-item-header">
                <div className="fm-drive-item-icon">
                  <Folder size="16px" />
                </div>
              </div>
              <div className="fm-drive-item-content">
                <div className="fm-drive-item-capacity">Initializing drive metadata</div>
              </div>
            </div>
            <div className="fm-drive-item-actions" />
            <div className="fm-drive-item-creating-overlay">
              <div className="fm-mini-spinner" />
              <span>Please wait…</span>
            </div>
          </div>
        )}
        {isMyDrivesOpen &&
          drives.map(d => {
            const isSelected = isCurrent(d) && view === ViewType.File
            const localStamp = usableStamps.find(s => s.batchID.toString() === d.batchId.toString() && !d.isAdmin)
            const stamp = isSelected && currentStamp ? currentStamp : localStamp

            return (
              stamp && (
                <div
                  key={d.id.toString()}
                  onClick={() => {
                    setCurrentDrive(d)
                    setCurrentStamp(stamp)
                    setView(ViewType.File)
                  }}
                >
                  <DriveItem drive={d} stamp={stamp} isSelected={isSelected} setErrorMessage={setErrorMessage} />
                </div>
              )
            )
          })}

        {expiredDrives.length > 0 && (
          <>
            <div
              className="fm-sidebar-item"
              onMouseEnter={() => setHovered('expired')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setIsExpiredOpen(prev => !prev)}
            >
              <div className="fm-sidebar-item-icon">
                {isExpiredOpen ? <ArrowDown size="16px" /> : <ArrowRight size="16px" />}
              </div>
              <div className="fm-sidebar-item-icon">
                {hovered === 'expired' ? <HistoryFill size="16px" /> : <History size="16px" />}
              </div>
              <div>Expired drives</div>
            </div>

            {isExpiredOpen && (
              <div className="fm-drive-items-container fm-drive-items-container-open">
                {expiredDrives.map(d => (
                  <div
                    key={`${d.id.toString()}-expired`}
                    onClick={() => {
                      setCurrentDrive(d)
                      setView(ViewType.Expired)
                    }}
                  >
                    <ExpiredDriveItem
                      drive={d}
                      onForgot={async () => {
                        await syncDrives()
                        setCurrentDrive(drives.length > 0 ? drives[0] : undefined)
                        setView(ViewType.File)
                      }}
                      setErrorMessage={setErrorMessage}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div
          className="fm-sidebar-item"
          onMouseEnter={() => setHovered(ViewType.Trash)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setIsTrashOpen(!isTrashOpen)}
        >
          <div className="fm-sidebar-item-icon">
            {isTrashOpen ? <ArrowDown size="16px" /> : <ArrowRight size="16px" />}
          </div>
          <div className="fm-sidebar-item-icon">
            {hovered === ViewType.Trash ? <DeleteFill size="16px" /> : <Delete size="16px" />}
          </div>
          <div>Trash</div>
        </div>

        {isTrashOpen && (
          <div className="fm-drive-items-container fm-drive-items-container-open">
            {drives.map(d => {
              const selected = isCurrent(d) && view === ViewType.Trash
              const stamp = usableStamps.find(s => s.batchID.toString() === d.batchId.toString() && !d.isAdmin)

              return (
                <div
                  key={`${d.id.toString()}-trash`}
                  className={`fm-sidebar-item fm-trash-item${selected ? ' is-selected' : ''}`}
                  onClick={() => {
                    setCurrentDrive(d)
                    setCurrentStamp(stamp)
                    setView(ViewType.Trash)
                  }}
                  title={`${d.name} Trash`}
                >
                  {d.name} Trash
                </div>
              )
            })}
          </div>
        )}
      </div>

      {isDriveCreationInProgress && (
        <div className="fm-sidebar-drive-creation">Creating drive, please do not reload</div>
      )}
    </div>
  )
}
