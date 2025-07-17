import { ReactElement, useState } from 'react'
import './FileItem.scss'
import { GetIconElement } from '../../../utils/GetIconElement'
import { ContextMenu } from '../../ContextMenu/ContextMenu'
import { useContextMenu } from '../../../hooks/useContextMenu'
import { GetInfoModal } from '../../GetInfoModal/GetInfoModal'
import GeneralIcon from 'remixicon-react/FileTextLineIcon'
import CalendarIcon from 'remixicon-react/CalendarLineIcon'
import AccessIcon from 'remixicon-react/ShieldKeyholeLineIcon'
import HardDriveIcon from 'remixicon-react/HardDrive2LineIcon'

interface FileItemProps {
  icon: string
  name: string
  size: string
  dateMod: string
}

export const FILE_PROPERTIES_MOCK = [
  {
    title: 'General',
    icon: <GeneralIcon size="14px" color="rgb(237, 129, 49)" />,
    properties: [
      { key: 'type', label: 'Type', value: 'image' },
      { key: 'size', label: 'Size:', value: '3.1MB' },
      { key: 'location', label: 'Location:', value: '/MyDiskX/Documents' },
      { key: 'hash', label: 'Swarm hash:', value: 'bafy...bzdi' },
    ],
  },
  {
    title: 'Dates',
    icon: <CalendarIcon size="14px" color="rgb(237, 129, 49)" />,
    properties: [
      { key: 'created', label: 'Created:', value: '2025-05-15 10:30' },
      { key: 'modified', label: 'Modified:', value: '2025-05-17 11:20' },
      { key: 'lastAccessed', label: 'Last Accessed:', value: '2025-06-11 12:15' },
      { key: 'expires', label: 'Expires:', value: '2025-12-31 23:59' },
    ],
  },
  {
    title: 'Access & Permissions',
    icon: <AccessIcon size="14px" color="rgb(237, 129, 49)" />,
    properties: [
      { key: 'owner', label: 'Owner:', value: 'John Doe' },
      { key: 'permissions', label: 'Permissions:', value: 'Read, Write' },
      { key: 'sharing', label: 'Sharing:', value: 'Private' },
    ],
  },
  {
    title: 'Storage',
    icon: <HardDriveIcon size="14px" color="rgb(237, 129, 49)" />,
    properties: [
      { key: 'diskName', label: 'Disk name:', value: 'MyDiskX' },
      { key: 'diskUsage', label: 'Disk Usage:', value: '1.2MB of 10GB' },
    ],
  },
]

export function FileItem({ icon, name, size, dateMod }: FileItemProps): ReactElement {
  const { showContext, pos, contextRef, handleContextMenu, handleCloseContext } = useContextMenu<HTMLDivElement>()
  const [showGetInfoModal, setShowGetInfoModal] = useState(false)

  return (
    <div className="fm-file-item-content" onContextMenu={handleContextMenu} onClick={handleCloseContext}>
      <div className="fm-file-item-content-item fm-checkbox">
        <input type="checkbox" />
      </div>
      <div className="fm-file-item-content-item fm-name">
        <GetIconElement icon={icon} />
        {name}
      </div>
      <div className="fm-file-item-content-item fm-size">{size}</div>
      <div className="fm-file-item-content-item fm-date-mod">{dateMod}</div>
      {showContext && (
        <div
          ref={contextRef}
          className="fm-file-item-context-menu"
          style={{
            top: pos.y,
            left: pos.x,
          }}
        >
          <ContextMenu>
            <div className="fm-context-item">View / Open</div>
            <div className="fm-context-item">Download</div>
            <div className="fm-context-item">Rename</div>
            <div className="fm-context-item-border"></div>
            <div className="fm-context-item">Version history</div>
            <div className="fm-context-item red">Delete</div>
            <div className="fm-context-item-border"></div>
            <div className="fm-context-item" onClick={() => setShowGetInfoModal(true)}>
              Get info
            </div>
          </ContextMenu>
        </div>
      )}
      {showGetInfoModal && (
        <GetInfoModal onCancelClick={() => setShowGetInfoModal(false)} name={name} properties={FILE_PROPERTIES_MOCK} />
      )}
    </div>
  )
}
