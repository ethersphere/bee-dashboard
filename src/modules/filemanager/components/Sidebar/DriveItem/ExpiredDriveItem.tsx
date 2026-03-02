import { DriveInfo } from '@solarpunkltd/file-manager-lib'
import React, { ReactElement, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import DriveFill from 'remixicon-react/HardDrive2FillIcon'
import Drive from 'remixicon-react/HardDrive2LineIcon'
import MoreFill from 'remixicon-react/MoreFillIcon'

import { Context as FMContext } from '../../../../../providers/FileManager'
import { useContextMenu } from '../../../hooks/useContextMenu'
import { handleDestroyAndForgetDrive } from '../../../utils/bee'
import { truncateNameMiddle } from '../../../utils/common'
import { ConfirmModal } from '../../ConfirmModal/ConfirmModal'
import { ContextMenu } from '../../ContextMenu/ContextMenu'

import './DriveItem.scss'

interface Props {
  drive: DriveInfo
  onForgot?: () => Promise<void> | void
  setErrorMessage?: (error: string) => void
}

export function ExpiredDriveItem({ drive, onForgot, setErrorMessage }: Props): ReactElement {
  const { fm, adminDrive, setShowError } = useContext(FMContext)
  const [isHovered, setIsHovered] = useState(false)
  const [showForgetConfirm, setShowForgetConfirm] = useState(false)
  const { showContext, pos, contextRef, setPos, setShowContext } = useContextMenu<HTMLDivElement>()

  function handleMenuClick(e: React.MouseEvent) {
    setShowContext(true)
    setPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className="fm-drive-item-container fm-expired"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="fm-drive-item-info">
        <div className="fm-drive-item-header">
          <div className="fm-drive-item-icon">{isHovered ? <DriveFill size="16px" /> : <Drive size="16px" />}</div>
          <div>{truncateNameMiddle(drive.name, 35, 8, 8)}</div>
        </div>
        <div className="fm-drive-item-content">
          <div className="fm-drive-item-capacity">Stamp expired — files unavailable</div>
        </div>
      </div>

      <div className="fm-drive-item-actions">
        <MoreFill
          size="13"
          className="fm-pointer"
          onClick={handleMenuClick}
          aria-label={`More actions for ${drive.name}`}
        />

        {showContext &&
          createPortal(
            <div
              ref={contextRef}
              className="fm-drive-item-context-menu"
              style={{ top: pos.y, left: pos.x }}
              onClick={e => e.stopPropagation()}
            >
              <ContextMenu>
                <div
                  className="fm-context-item red"
                  onClick={() => {
                    setShowContext(false)
                    setShowForgetConfirm(true)
                  }}
                >
                  Forget drive
                </div>
              </ContextMenu>
            </div>,
            document.body,
          )}
      </div>

      {showForgetConfirm && (
        <ConfirmModal
          title="Forget drive?"
          message={
            <>
              This will remove metadata for the drive with expired stamp <b>Drive Name: {drive.name}</b>{' '}
              <b>Batch Id: {`${drive.batchId.toString().slice(0, 4)}...${drive.batchId.toString().slice(-4)}`}</b>
            </>
          }
          confirmLabel="Forget drive"
          cancelLabel="Keep"
          onCancel={() => setShowForgetConfirm(false)}
          onConfirm={async () => {
            await handleDestroyAndForgetDrive({
              fm,
              drive,
              isDestroy: false,
              adminDrive,
              onSuccess: async () => {
                setShowForgetConfirm(false)
                await onForgot?.()
              },
              onError: () => {
                setShowForgetConfirm(false)
                setErrorMessage?.(`Failed to forget drive ${drive.name}`)
                setShowError(true)
              },
            })
          }}
        />
      )}
    </div>
  )
}
