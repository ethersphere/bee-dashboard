import { ReactElement } from 'react'
import type { FileInfo, DriveInfo } from '@solarpunkltd/file-manager-lib'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { DeleteFileModal } from '../DeleteFileModal/DeleteFileModal'
import { DestroyDriveModal } from '../DestroyDriveModal/DestroyDriveModal'
import { FileAction } from '../../constants/transfers'

interface FileBrowserModalsProps {
  showDeleteModal: boolean
  selectedFiles: FileInfo[]
  fileCountText: string
  currentDrive: DriveInfo | null
  confirmBulkForget: boolean
  showDestroyDriveModal: boolean
  pendingCancelUpload: string | null
  onDeleteCancel: () => void
  onDeleteProceed: (action: FileAction) => void
  onForgetConfirm: () => Promise<void>
  onForgetCancel: () => void
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
  showDestroyDriveModal,
  pendingCancelUpload,
  onDeleteCancel,
  onDeleteProceed,
  onForgetConfirm,
  onForgetCancel,
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
          title="Forget permanently?"
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
