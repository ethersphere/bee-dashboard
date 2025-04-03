import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext, useEffect, useState } from 'react'
import { getHumanReadableFileSize, getFileType, formatDate } from '../../../utils/file'
import { Context as FileManagerContext } from '../../../providers/FileManager'
import { PostageBatch } from '@ethersphere/bee-js'
import { SwarmTextInput } from '../../SwarmTextInput'
import { UploadProgress } from '@solarpunkltd/file-manager-lib'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

const useStyles = makeStyles(() =>
  createStyles({
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
  }),
)

interface UploadModalProps {
  modalDisplay: (value: boolean) => void
  fileSize?: number
  files: FileList
  actualPostageBatch: PostageBatch
  onUpload: (value: number, isUploadingInProgress: boolean) => void
}

const UploadModal = ({ modalDisplay, files, actualPostageBatch, onUpload }: UploadModalProps): ReactElement => {
  const classes = useStyles()
  const classesGlobal = useFileManagerGlobalStyles()
  const [label, setLabel] = useState('')
  const [details, setDetails] = useState('')
  const { filemanager } = useContext(FileManagerContext)
  const [filesSize, setFilesSize] = useState(0)
  const [filesCount, setFilesCount] = useState(0)

  const type = files.length > 1 ? 'multiple' : files[0].type

  useEffect(() => {
    let size = 0
    for (const file of Array.from(files)) {
      setFilesCount(filesCount + 1)
      size += file.size
    }
    setFilesSize(size)
  }, [])

  const handleUpload = () => {
    if (filemanager) {
      const filesArray = Array.from(files)

      for (const file of filesArray) {
        filemanager.upload({
          batchId: actualPostageBatch.batchID,
          files: [file],
          name: file.name,
          customMetadata: {
            label,
            details,
            size: file.size.toString(),
            type: getFileType(file.type),
            date: actualPostageBatch.duration.toEndDate().getTime().toString(),
          },
          onUploadProgress: (p: UploadProgress) => {
            onUpload(Math.floor(p.processed / (p.total / 100)), true)
          },
        })
      }

      modalDisplay(false)
    }
  }

  const handleSetLabel = (value: string) => {
    if (value.length <= 500) {
      setLabel(value)
    }
  }
  const handleSetDetails = (value: string) => {
    if (value.length <= 500) {
      setDetails(value)
    }
  }

  return (
    <div className={classesGlobal.modal}>
      <div className={classesGlobal.modalContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
          <div className={classesGlobal.modalHeader}>Upload Confirmation</div>
          <div className={classes.fileInfoContainer}>
            <div className={classes.item}>
              <div>Target Volume:</div>
              <div className={classes.itemValue}>{actualPostageBatch.label}</div>
            </div>
            <div className={classes.item}>
              <div>Selected items count:</div>
              <div className={classes.itemValue}>{filesCount}</div>
            </div>
            <div className={classes.item}>
              <div>Validity:</div>
              <div className={classes.itemValue}>{formatDate(actualPostageBatch.duration.toEndDate())}</div>
            </div>
            <div className={classes.item}>
              <div>Selected item types:</div>
              <div className={classes.itemValue}>{type}</div>
            </div>
            <div className={classes.item}>
              <div>Free space:</div>
              <div className={classes.itemValue}>{getHumanReadableFileSize(actualPostageBatch.size.toBytes())}</div>
            </div>
            <div className={classes.item}>
              <div>Neccessary space:</div>
              <div className={classes.itemValue}>{getHumanReadableFileSize(filesSize)}</div>
            </div>
          </div>
          <SwarmTextInput
            name="addDetails"
            label="Add details"
            multiline={true}
            rows={4}
            required={false}
            defaultValue={details}
            onChange={e => handleSetDetails(e.target.value)}
          />
          <SwarmTextInput
            name="addLabels"
            label="Add labels"
            multiline={true}
            rows={4}
            required={false}
            defaultValue={label}
            onChange={e => handleSetLabel(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '25px', justifyContent: 'right' }}>
          <div
            className={`${classesGlobal.buttonElementBase} ${classesGlobal.generalButtonElement}`}
            style={{ width: '160px' }}
            onClick={() => modalDisplay(false)}
          >
            Cancel
          </div>
          <div
            className={`${classesGlobal.buttonElementBase} ${classesGlobal.updateButtonElement}`}
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
