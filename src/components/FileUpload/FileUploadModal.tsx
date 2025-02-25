import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext, useEffect, useState, useRef } from 'react'
import { SwarmTextInput } from '../SwarmTextInput'
// import { getHumanReadableFileSize, getFileType } from '../../utils/file'
import { Context as FileManagerContext } from '../../providers/FileManager'
import { BatchId } from '@upcoming/bee-js'

//TODO-Filemanager: volume management
const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#EDEDED',
      padding: '20px',
      width: '552px',
      height: '696px',
      fontFamily: '"iAWriterMonoV", monospace',
      color: '#333333',
    },
    modalHeader: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '24px',
      fontWeight: 400,
      lineHeight: '32px',
    },
    fileInfoContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: '50px',
      backgroundColor: '#CFCDCD',
    },
    item: {
      backgroundColor: '#CFCDCD',
      padding: '20px',
      fontFamily: "'iAWriterMonoV', monospace",
      color: '#333333',
    },
    itemValue: {
      fontWeight: 700,
    },
    buttonElement: {
      backgroundColor: '#FFFFFF',
      width: '256px',
      height: '42px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: '#DE7700',
        color: '#FFFFFF',
      },
    },
  }),
)

interface UploadModalProps {
  modalDisplay: (value: boolean) => void
  fileSize?: number
  file: File
}

const UploadModal = ({ modalDisplay, file }: UploadModalProps): ReactElement => {
  const classes = useStyles()
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('')
  const [batchIds, setBatchIds] = useState<BatchId[]>([])
  const { filemanager } = useContext(FileManagerContext)

  const getBatchIDs = async () => {
    if (!filemanager || !filemanager.getIsInitialized()) {
      return
    }

    const batchIds = (await filemanager.getStamps()).map(s => s.batchID)
    batchIds.forEach(b => {})
    setBatchIds(batchIds)
  }

  useEffect(() => {
    getBatchIDs()
  }, [filemanager])

  const handleUpload = async () => {
    if (filemanager) {
      // TODO: actually upload the file
      const firstFile = new File(['Shh!'], 'secret.txt', { type: 'text/plain' })
      await filemanager.upload(batchIds[0], [firstFile], {
        description,
        label,
      })
      modalDisplay(false)
    }
  }

  return (
    <div className={classes.modal}>
      <div className={classes.modalContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
          <div className={classes.modalHeader}>Upload Confirmation</div>
          <div className={classes.fileInfoContainer}>
            <div className={classes.item}>
              <div>Target Volume:</div>
              <div className={classes.itemValue}>MYVID</div>
            </div>
            <div className={classes.item}>
              <div>Selected items count:</div>
              <div className={classes.itemValue}>1</div>
            </div>
            <div className={classes.item}>
              <div>Validity:</div>
              <div className={classes.itemValue}>2025/12/31</div>
            </div>
            <div className={classes.item}>
              <div>Selected item types:</div>
              <div className={classes.itemValue}>{file.type}</div>
            </div>
            <div className={classes.item}>
              <div>Free space:</div>
              <div className={classes.itemValue}>3.64GB</div>
            </div>
            <div className={classes.item}>
              <div>Neccessary space:</div>
              <div className={classes.itemValue}>{file.size}</div>
            </div>
          </div>
          <SwarmTextInput
            name="addDetails"
            label="Add details"
            multiline={true}
            rows={4}
            required={false}
            onChange={e => setDescription(e.target.value)}
          />
          <SwarmTextInput
            name="addLabels"
            label="Add labels"
            multiline={true}
            rows={4}
            required={false}
            onChange={e => setLabel(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '25px', justifyContent: 'right' }}>
          <div className={classes.buttonElement} style={{ width: '160px' }} onClick={() => modalDisplay(false)}>
            Cancel
          </div>
          <div
            className={classes.buttonElement}
            style={{ width: '160px', backgroundColor: '#DE7700', color: '#FFFFFF' }}
            onClick={handleUpload}
          >
            Upload
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
