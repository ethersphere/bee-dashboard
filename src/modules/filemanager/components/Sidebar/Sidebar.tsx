import { ReactElement, useContext, useEffect, useState } from 'react'

import './Sidebar.scss'
import Add from 'remixicon-react/AddLineIcon'
import Folder from 'remixicon-react/Folder3LineIcon'
import FolderFill from 'remixicon-react/Folder3FillIcon'
import ArrowRight from 'remixicon-react/ArrowRightSLineIcon'
import ArrowDown from 'remixicon-react/ArrowDownSLineIcon'
import Delete from 'remixicon-react/DeleteBin6LineIcon'
import DeleteFill from 'remixicon-react/DeleteBin6FillIcon'
import { DriveItem } from './DriveItem/DriveItem'
import { CreateDriveModal } from '../CreateDriveModal/CreateDriveModal'
import { ViewType } from '../../constants/constants'
import { Duration, PostageBatch, RedundancyLevel, Size } from '@ethersphere/bee-js'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { getUsableStamps } from '../../utils/utils'
import { useView } from '../../providers/FMFileViewContext'
import { useFM } from '../../providers/FMContext'

export function Sidebar(): ReactElement {
  const [hovered, setHovered] = useState<string | null>(null)
  const [isMyDrivesOpen, setIsMyDriveOpen] = useState(false)
  const [isTrashOpen, setIsTrashOpen] = useState(false)
  const [isCreateDriveOpen, setIsCreateDriveOpen] = useState(false)
  const [usableStamps, setUsableStamps] = useState<PostageBatch[]>([])
  const [isStampCreationInProgress, setIsStampCreationInProgress] = useState(false)

  const { beeApi } = useContext(SettingsContext)
  const { setView } = useView()
  const { currentBatch, setCurrentBatch } = useFM()

  async function handleCreateDrive(
    size: Size,
    duration: Duration,
    label: string,
    encryption: boolean,
    erasureCodeLevel: RedundancyLevel,
  ) {
    try {
      setIsStampCreationInProgress(true)
      await beeApi?.buyStorage(size, duration, { label }, undefined, encryption, erasureCodeLevel)
    } finally {
      setIsStampCreationInProgress(false)
    }
  }

  useEffect(() => {
    const getStamps = async () => {
      const stamps = await getUsableStamps(beeApi)
      setUsableStamps([...stamps])
    }
    getStamps()
  }, [beeApi, isStampCreationInProgress])

  const drives = usableStamps.filter(s => s.label !== 'owner' && s.label !== 'owner-stamp')

  return (
    <div className="fm-sidebar">
      <div className="fm-sidebar-content">
        <div className="fm-sidebar-item" onClick={() => setIsCreateDriveOpen(true)}>
          <div className="fm-sidebar-item-icon">
            <Add size="16px" />
          </div>
          <div>Create new drive</div>
        </div>

        {isCreateDriveOpen && (
          <CreateDriveModal
            onCancelClick={() => setIsCreateDriveOpen(false)}
            handleCreateDrive={(size, duration, label, encryption, erasureCodeLevel) =>
              handleCreateDrive(size, duration, label, encryption, erasureCodeLevel)
            }
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

        {isMyDrivesOpen && (
          <div className="fm-drive-items-container fm-drive-items-container-open">
            {drives.map(stamp => {
              const isSelected = currentBatch?.batchID.toString() === stamp.batchID.toString()

              return (
                <div
                  key={stamp.batchID.toString()}
                  className={`fm-sidebar-item fm-drive-item${isSelected ? ' selected' : ''}`}
                  onClick={() => {
                    setCurrentBatch(stamp)
                    setView(ViewType.File)
                  }}
                >
                  <DriveItem stamp={stamp} />
                </div>
              )
            })}
          </div>
        )}

        <div
          className="fm-sidebar-item"
          onMouseEnter={() => setHovered('trash')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setIsTrashOpen(!isTrashOpen)}
        >
          <div className="fm-sidebar-item-icon">
            {isTrashOpen ? <ArrowDown size="16px" /> : <ArrowRight size="16px" />}
          </div>
          <div className="fm-sidebar-item-icon">
            {hovered === 'trash' ? <DeleteFill size="16px" /> : <Delete size="16px" />}
          </div>
          <div>Trash</div>
        </div>

        {isTrashOpen && (
          <div className="fm-drive-items-container fm-drive-items-container-open">
            <div className="fm-sidebar-item fm-trash-item" onClick={() => setView(ViewType.Trash)}>
              Drive A Trash
            </div>
            <div className="fm-sidebar-item fm-trash-item" onClick={() => setView(ViewType.Trash)}>
              Drive B Trash
            </div>
          </div>
        )}
      </div>

      {isStampCreationInProgress && <div className="fm-sidebar-drive-creation">Creating drive…</div>}
    </div>
  )
}
