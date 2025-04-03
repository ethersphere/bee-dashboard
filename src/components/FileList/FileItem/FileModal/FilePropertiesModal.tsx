import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext, useState } from 'react'
import DownloadIcon from '../../../icons/DownloadIcon'
import { SwarmTextInput } from '../../../SwarmTextInput'
import { startDownloadingQueue } from '../../../../utils/file'
import { Context as FileManagerContext } from '../../../../providers/FileManager'
import { Reference } from '@ethersphere/bee-js'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { useFileManagerGlobalStyles } from '../../../../styles/globalFileManagerStyles'

const useStyles = makeStyles(() => createStyles({}))

interface FilePropertiesModalProps {
  volumeName: string
  volumeValidity: Date
  fileName: string
  fileDetails?: string
  fileLabels?: string
  fileRef: string | Reference
  histroyRef: string | Reference
  owner: string
  actPublisher: string
  batchId: string
  modalDisplay: (value: boolean) => void
}

const FilePropertiesModal = ({
  volumeName,
  volumeValidity,
  fileName,
  fileDetails,
  fileLabels,
  fileRef,
  histroyRef,
  owner,
  actPublisher,
  batchId,
  modalDisplay,
}: FilePropertiesModalProps): ReactElement => {
  const classes = useFileManagerGlobalStyles()
  const classes2 = useStyles()
  const { filemanager } = useContext(FileManagerContext)
  const [isHovered, setIsHovered] = useState(false)
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(false)
  const [updatedFileName, setUpdatedFileName] = useState(fileName)
  const [updatedFileDetails, setUpdatedFileDetails] = useState(fileDetails)
  const [updatedFileLabels, setUpdatedFileLabels] = useState(fileLabels)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handlerTextChanges = (type: 'name' | 'details' | 'labels', value: string) => {
    switch (type) {
      case 'name':
        if (value !== '') {
          setIsUpdateButtonDisabled(false)
        } else {
          setIsUpdateButtonDisabled(true)
        }
        setUpdatedFileName(value)
        break
      case 'details':
        setUpdatedFileDetails(value)
        break
      case 'labels':
        setUpdatedFileLabels(value)
        break
      default:
        break
    }
  }

  const handlerUpdate = () => {
    if (!isUpdateButtonDisabled) {
      modalDisplay(false)
    }
  }

  return (
    <div className={classes.propertiesContainer}>
      <div
        id="PropertiesContainer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className={classes.infoContainer}>
              <div style={{ fontSize: '10px' }}>Volume</div>
              <div>{volumeName}</div>
            </div>
            <div className={classes.infoContainer}>
              <div style={{ fontSize: '10px' }}>Validity</div>
              <div>
                {volumeValidity.toLocaleDateString('en-US', {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </div>
            </div>
          </div>
          <div className={classes.actionButtonContainer}>
            <div
              className={classes.actionButton}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                if (filemanager) {
                  startDownloadingQueue(filemanager, [
                    {
                      batchId,
                      name: fileName,
                      owner,
                      actPublisher,
                      file: {
                        reference: fileRef,
                        historyRef: histroyRef,
                      },
                    } as FileInfo,
                  ])
                }
              }}
            >
              <DownloadIcon color={isHovered ? '#FFFFFF' : '#333333'} />
              <div style={{ textAlign: 'center' }}>Download now</div>
            </div>
          </div>
        </div>
        <SwarmTextInput
          name="Name"
          label="Name"
          required={true}
          disabled={true}
          value={updatedFileName}
          // onChange={event => handlerTextChanges('name', event.target.value)}
        />
        <SwarmTextInput
          name="Name"
          label="Details"
          value={updatedFileDetails}
          required={false}
          disabled={true}
          multiline={true}
          rows={6}
          placeholder="Lorem ipsum"
          // onChange={event => handlerTextChanges('name', event.target.value)}
        />

        <SwarmTextInput
          name="Name"
          label="Labels"
          value={updatedFileLabels}
          required={false}
          disabled={true}
          multiline={true}
          rows={6}
          placeholder="Lorem ipsum"
          // onChange={event => handlerTextChanges('name', event.target.value)}
        />
        <div className={classes.bottomButtonContainer}>
          <div
            className={`${classes.buttonElementBase} ${classes.generalButtonElement}`}
            style={{ width: '160px' }}
            onClick={() => modalDisplay(false)}
          >
            Cancel
          </div>
          {/* This is commented out because this feature is not part of phase1 */}
          {/* <div
            className={`${classes.buttonElementBase} ${
              isUpdateButtonDisabled ? classes.disabledUpdateButtonElement : classes.updateButtonElement
            }`}
            style={{ width: '160px' }}
            onClick={() => handlerUpdate()}
          >
            Update
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default FilePropertiesModal
