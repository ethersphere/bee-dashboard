import { ReactElement, useState } from 'react'

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
import { useView } from '../../providers/FileViewContext'
import { ViewType } from '../../constants/constants'

export function Sidebar(): ReactElement {
  const [hovered, setHovered] = useState<string | null>(null)
  const [isMyDrivesOpen, setIsMyDriveOpen] = useState(false)
  const [isTrashOpen, setIsTrashOpen] = useState(false)
  const [isCreateDriveOpen, setIsCreateDriveOpen] = useState(false)

  const { setActualItemView, setView } = useView()

  return (
    <div className="fm-sidebar">
      <div className="fm-sidebar-content">
        <div className="fm-sidebar-item" onClick={() => setIsCreateDriveOpen(true)}>
          <div className="fm-sidebar-item-icon">
            <Add size="16px" />
          </div>
          <div>Create new drive</div>
        </div>
        {isCreateDriveOpen && <CreateDriveModal onCancelClick={() => setIsCreateDriveOpen(false)} />}
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
          <div className={`fm-drive-items-container fm-drive-items-container-open`}>
            <DriveItem name="Drive A" />
            <DriveItem name="Drive B" />
          </div>
        )}
        <div
          className="fm-sidebar-item"
          onMouseEnter={() => setHovered('trash')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setIsTrashOpen(!isTrashOpen)}
        >
          <div className="fm-sidebar-item-icon">
            <ArrowRight size="16px" />
          </div>
          <div className="fm-sidebar-item-icon">
            {hovered === 'trash' ? <DeleteFill size="16px" /> : <Delete size="16px" />}
          </div>
          <div>Trash</div>
        </div>
        {isTrashOpen && (
          <div className={`fm-drive-items-container fm-drive-items-container-open`}>
            <div
              className="fm-sidebar-item fm-trash-item"
              onClick={() => {
                setView(ViewType.Trash)
                setActualItemView?.('Drive A Trash')
              }}
            >
              Drive A Trash
            </div>
            <div
              className="fm-sidebar-item fm-trash-item"
              onClick={() => {
                setView(ViewType.Trash)
                setActualItemView?.('Drive B Trash')
              }}
            >
              Drive B Trash
            </div>
          </div>
        )}
      </div>
      <div className="fm-sidebar-drive-creation">Creating drive A...</div>
    </div>
  )
}
