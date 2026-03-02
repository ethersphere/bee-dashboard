import type { DriveInfo, FileInfo } from '@solarpunkltd/file-manager-lib'
import { ReactElement } from 'react'

import { TOOLTIPS } from '../../constants/tooltips'
import { FileAction } from '../../constants/transfers'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { DeleteFileModal } from '../DeleteFileModal/DeleteFileModal'
import { DestroyDriveModal } from '../DestroyDriveModal/DestroyDriveModal'
import { Tooltip } from '../Tooltip/Tooltip'

interface FileBrowserModalsProps {
  showDeleteModal: boolean
  selectedFiles: FileInfo[]
  fileCountText: string
  currentDrive: DriveInfo | null
  confirmBulkForget: boolean
  confirmBulkRestore: boolean
  showDestroyDriveModal: boolean
  pendingCancelUpload: string | null
  onDeleteCancel: () => void
  onDeleteProceed: (action: FileAction) => void
  onForgetConfirm: () => Promise<void>
  onForgetCancel: () => void
  onRestoreConfirm: () => Promise<void>
  onRestoreCancel: () => void
  onDestroyCancel: () => void
  onDestroyConfirm: () => Promise<void>
  onCancelUploadConfirm: () => void
  onCancelUploadCancel: () => void
}

export function FileBrowserModals({
  showDeleteModal,
  selectedFiles,
  fileCountText,
  currentDrive,
  confirmBulkForget,
  confirmBulkRestore,
  showDestroyDriveModal,
  pendingCancelUpload,
  onDeleteCancel,
  onDeleteProceed,
  onForgetConfirm,
  onForgetCancel,
  onRestoreConfirm,
  onRestoreCancel,
  onDestroyCancel,
  onDestroyConfirm,
  onCancelUploadConfirm,
  onCancelUploadCancel,
}: FileBrowserModalsProps): ReactElement {
  return (
    <>
      {showDeleteModal && (
        <DeleteFileModal
          names={selectedFiles.map(f => f.name)}
          currentDriveName={currentDrive?.name}
          onCancelClick={onDeleteCancel}
          onProceed={onDeleteProceed}
        />
      )}

      {confirmBulkForget && (
        <ConfirmModal
          title={
            <>
              Forget permanently?
              <Tooltip label={TOOLTIPS.FILE_OPERATION_FORGET} />
            </>
          }
          message={
            <>
              This removes <b>{selectedFiles.length}</b> {fileCountText} from your view.
              <br />
              The data remains on Swarm until the drive expires.
            </>
          }
          confirmLabel="Forget"
          cancelLabel="Cancel"
          onConfirm={onForgetConfirm}
          onCancel={onForgetCancel}
        />
      )}

      {confirmBulkRestore && (
        <ConfirmModal
          title={
            <>
              Restore from trash?
              <Tooltip label={TOOLTIPS.FILE_OPERATION_RESTORE_FROM_TRASH} />
            </>
          }
          message={
            <>
              This will restore <b>{selectedFiles.length}</b> {fileCountText} from trash.
            </>
          }
          confirmLabel="Restore"
          cancelLabel="Cancel"
          onConfirm={onRestoreConfirm}
          onCancel={onRestoreCancel}
        />
      )}

      {showDestroyDriveModal && currentDrive && (
        <DestroyDriveModal drive={currentDrive} onCancelClick={onDestroyCancel} doDestroy={onDestroyConfirm} />
      )}

      {pendingCancelUpload && (
        <ConfirmModal
          title="Cancel upload?"
          message={
            <>
              Stopping now will cancel the network request. Data already transmitted cannot be reverted.{' '}
              <b>We will try our best to clean up the transmitted data.</b>
              <br />
              To remove any (remaining) cancelled items from your browser view later, use{' '}
              <i>Right-click → Delete → Forget</i>.
            </>
          }
          confirmLabel="Cancel upload"
          cancelLabel="Keep uploading"
          onConfirm={onCancelUploadConfirm}
          onCancel={onCancelUploadCancel}
        />
      )}
    </>
  )
}
