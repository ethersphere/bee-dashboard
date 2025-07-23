import { ReactElement, useState } from 'react'
import { createPortal } from 'react-dom'
import Drive from 'remixicon-react/HardDrive2LineIcon'
import DriveFill from 'remixicon-react/HardDrive2FillIcon'
import MoreFill from 'remixicon-react/MoreFillIcon'
import './DriveItem.scss'
import { ProgressBar } from '../../ProgressBar/ProgressBar'
import { ContextMenu } from '../../ContextMenu/ContextMenu'
import { useContextMenu } from '../../../hooks/useContextMenu'
import { FMButton } from '../../FMButton/FMButton'
import { DestroyDriveModal } from '../../DestroyDriveModal/DestroyDriveModal'
import { UpgradeDriveModal } from '../../UpgradeDriveModal/UpgradeDriveModal'
import { useView } from '../../../providers/FileViewContext'
import { ViewType } from '../../../constants/constants'

interface DriveItemProps {
  name: string
}

export function DriveItem({ name }: DriveItemProps): ReactElement {
  const [isHovered, setIsHovered] = useState(false)
  const [isDestroyDriveModalOpen, setIsDestroyDriveModalOpen] = useState(false)
  const [isUpgradeDriveModalOpen, setIsUpgradeDriveModalOpen] = useState(false)

  const { showContext, pos, contextRef, setPos, handleCloseContext, setShowContext } = useContextMenu<HTMLDivElement>()

  const { setView, setActualItemView } = useView()

  function handleMenuClick(e: React.MouseEvent) {
    setShowContext(true)
    setPos({ x: e.clientX, y: e.clientY })
  }

  function handleDestroyDriveClick() {
    setShowContext(false)
  }

  return (
    <div
      className="fm-drive-item-container"
      onClick={() => {
        setView(ViewType.File)
        setActualItemView?.(name)
      }}
    >
      <div
        className="fm-drive-item-info"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="fm-drive-item-header">
          <div className="fm-drive-item-icon">{isHovered ? <DriveFill size="16px" /> : <Drive size="16px" />}</div>
          <div>{name}</div>
        </div>
        <div className="fm-drive-item-content">
          <div className="fm-drive-item-capacity">
            Capacity <ProgressBar value={20} width="64px" /> 8.7 GB/10 GB
          </div>
          <div className="fm-drive-item-capacity">Expiry date 2025-08-20</div>
        </div>
      </div>
      <div className="fm-drive-item-actions">
        <MoreFill size="13" className="fm-pointer" onClick={handleMenuClick} />
        {showContext &&
          createPortal(
            <div
              ref={contextRef}
              className="fm-drive-item-context-menu"
              style={{
                top: pos.y,
                left: pos.x,
              }}
            >
              <ContextMenu>
                <div className="fm-context-item" onClick={handleCloseContext}>
                  Rename
                </div>
                <div
                  className="fm-context-item red"
                  onClick={() => {
                    handleDestroyDriveClick()
                    setIsDestroyDriveModalOpen(true)
                  }}
                >
                  Destroy entire drive
                </div>
              </ContextMenu>
            </div>,

            document.body,
          )}

        <FMButton label="Upgrade" variant="primary" size="small" onClick={() => setIsUpgradeDriveModalOpen(true)} />
      </div>
      {isUpgradeDriveModalOpen && (
        <UpgradeDriveModal driveName="Drive A" onCancelClick={() => setIsUpgradeDriveModalOpen(false)} />
      )}
      {isDestroyDriveModalOpen && (
        <DestroyDriveModal driveName="Drive A" onCancelClick={() => setIsDestroyDriveModalOpen(false)} />
      )}
    </div>
  )
}
