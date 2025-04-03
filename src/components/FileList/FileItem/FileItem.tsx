import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext, useState } from 'react'
import FileTypeIcon from '../../icons/FileTypeIcon'
import SharedIcon from '../../icons/SharedIcon'
import DownloadQueueIcon from '../../icons/DownloadQueueIcon'
import FileLabelIcon from '../../icons/FileLabelIcon'
import NotificationSign from '../../NotificationSign'
import FileDescriptionIcon from '../../icons/FileDescriptionIcon'
// This is commented out because these are not part of phase1
// import Preview from './FileItemPreview'
// import FileItemEdit from './FileItemEdit'
import FileModal from './FileModal/FileModal'
import { Context as FileManagerContext } from '../../../providers/FileManager'
import { Reference } from '@ethersphere/bee-js'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

const useStyles = makeStyles(() =>
  createStyles({
    fileItemContainer: {
      position: 'relative',
      backgroundColor: '#ffffff',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
    },
    leftSide: {
      display: 'flex',
      width: '48px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#33333333',
      paddingBottom: '5px',
    },
    folderLeftSide: {
      display: 'flex',
      width: '48px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#333333',
    },
    middleSide: {
      display: 'flex',
      flexDirection: 'column',
      padding: '5px',
      paddingBottom: '20px',
      justifyContent: '',
      flexGrow: 1,
    },
    rightSide: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'end',
    },
    flexDisplay: {
      display: 'flex',
      alignItems: 'center',
    },
    fileNameRow: {
      display: 'flex',
      gap: '15px',
      fontSize: '20px',
      marginLeft: '28px',
      marginRight: '10px',
    },
    fileDataText: {
      fontWeight: 'bold',
      marginLeft: '30px',
    },
    icons: {
      display: 'flex',
      gap: '5px',
      paddingTop: '5px',
      paddingRight: '5px',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fileTypeIcon: {
      marginTop: 'auto',
    },
    downloadIconContainer: {
      display: 'flex',
    },
  }),
)

interface Props {
  batchId: string
  owner: string
  actPublisher: string
  volumeName: string
  volumeValidity: Date
  name: string
  type: string
  size: string
  hash: string | Reference
  historyHash: string | Reference
  expires: string
  preview?: string
  description?: boolean
  label?: string
  details?: string
  shared?: string
  warning?: boolean
  addedToQueue?: boolean
}

const FileItem = ({
  batchId,
  owner,
  actPublisher,
  volumeName,
  volumeValidity,
  name,
  type,
  size,
  hash,
  historyHash,
  expires,
  preview,
  description,
  label,
  details,
  shared,
  warning,
  addedToQueue,
}: Props): ReactElement => {
  const classes2 = useFileManagerGlobalStyles()
  const classes = useStyles()
  const [showFileModal, setShowFileModal] = useState(false)
  const { fileDownLoadQueue, setFileDownLoadQueue } = useContext(FileManagerContext)
  const [added, setAdded] = useState<boolean>(addedToQueue ? addedToQueue : false)

  return (
    <div>
      <div className={classes.fileItemContainer} onClick={() => setShowFileModal(true)}>
        <div className={classes.leftSide}>
          {/* This is commented out because this feature is not part of phase1 */}
          {/* <Preview /> */}
          <div className={classes.fileTypeIcon}>
            <FileTypeIcon type={type} />
          </div>
        </div>
        <div className={classes.middleSide}>
          <div className={classes.fileNameRow}>
            {name}
            <div
              onClick={e => {
                e.stopPropagation()
                setAdded(!added)

                if (!added) {
                  setFileDownLoadQueue([
                    ...fileDownLoadQueue,
                    {
                      batchId,
                      name,
                      owner,
                      actPublisher,
                      file: {
                        reference: hash,
                        historyRef: historyHash,
                      },
                    } as FileInfo,
                  ])
                } else {
                  setFileDownLoadQueue(fileDownLoadQueue.filter(item => item.file.reference.toString() !== hash))
                }
              }}
              className={classes.downloadIconContainer}
            >
              <DownloadQueueIcon added={added} />
            </div>
          </div>
          <div className={classes.fileDataText}>{size}</div>
        </div>
        <div className={classes.rightSide}>
          <div className={classes.icons}>
            {description ? <FileDescriptionIcon /> : null}
            {label ? <FileLabelIcon /> : null}
            {shared ? <SharedIcon sharedBy={shared} /> : null}
            {warning ? <NotificationSign text="!" /> : null}
          </div>
          {/* This is commented out because this feature is not part of phase1 */}
          {/* <FileItemEdit /> */}
        </div>
      </div>
      {showFileModal ? (
        <FileModal
          volumeName={volumeName}
          volumeValidity={volumeValidity}
          fileName={name}
          fileLabels={label}
          fileDetails={details}
          fileRef={hash}
          histroyRef={historyHash}
          owner={owner}
          actPublisher={actPublisher}
          batchId={batchId}
          modalDisplay={value => setShowFileModal(value)}
        />
      ) : null}
    </div>
  )
}

export default FileItem
