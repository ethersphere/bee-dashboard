import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext, useState } from 'react'
import DownloadIcon from '../../../icons/DownloadIcon'
import { SwarmTextInput } from '../../../SwarmTextInput'
import { startDownloadingQueue } from '../../../../utils/file'
import { Context as FileManagerContext } from '../../../../providers/FileManager'
import { Reference } from '@ethersphere/bee-js'
import { FileInfo } from '@solarpunkltd/file-manager-lib'

const useStyles = makeStyles(() =>
  createStyles({
    modalContainer: {
      display: 'flex',
      gap: '20px',
      flexDirection: 'column',
      backgroundColor: '#EDEDED',
      padding: '20px',
      width: '552px',
      height: '696px',
    },
    buttonElementBase: {
      width: '256px',
      height: '42px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelButtonElement: {
      backgroundColor: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#DE7700',
        color: '#FFFFFF',
      },
    },
    updateButtonElement: {
      backgroundColor: '#DE7700',
      color: '#FFFFFF',
    },
    disabledUpdateButtonElement: {
      backgroundColor: 'gray',
      color: '#FFFFFF',
      cursor: 'not-allowed',
    },
    tabPanel: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: '#F7F7F7',
      height: '42px',
      fontFamily: '"iAWriterMonoV", monospace',
    },
    tabPanelItem: {
      cursor: 'pointer',
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomButtonContainer: {
      display: 'flex',
      justifyContent: 'right',
      gap: '20px',
    },
    infoContainer: {
      width: '129px',
      height: '42px',
      backgroundColor: '#F7F7F7',
      color: '#878787',
      padding: '5px 15px',
      fontSize: '14x',
    },
    downloadButtonContainer: {
      display: 'flex',
      padding: '40px 60px',
      flexDirection: 'column',
      width: '113px !important',
      height: '64px',
      justifyContent: 'center',
      alignItems: 'center',
      border: '20px solid #CFCDCD',
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#DE7700',
        color: '#FFFFFF',
      },
    },
  }),
)

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
  const classes = useStyles()
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

  const alreadyAddedWithACT = [
    '0x9cbDe6569BA1220E46f256371368A05f480bb78C',
    '0x9cbDe6569BA1220E46f256371368A05f480bb78C',
    '0x9cbDe6569BA1220E46f256371368A05f480bb78C',
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: '1' }}>
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
          <div
            className={classes.downloadButtonContainer}
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
        <SwarmTextInput
          name="Name"
          label="Name"
          required={true}
          value={updatedFileName}
          onChange={event => handlerTextChanges('name', event.target.value)}
        />
        <SwarmTextInput
          name="Name"
          label="Details"
          value={updatedFileDetails}
          required={false}
          multiline={true}
          rows={6}
          placeholder="Lorem ipsum"
          onChange={event => handlerTextChanges('name', event.target.value)}
        />

        <SwarmTextInput
          name="Name"
          label="Labels"
          value={updatedFileLabels}
          required={false}
          multiline={true}
          rows={6}
          placeholder="Lorem ipsum"
          onChange={event => handlerTextChanges('name', event.target.value)}
        />
        <div className={classes.bottomButtonContainer}>
          <div
            className={`${classes.buttonElementBase} ${classes.cancelButtonElement}`}
            style={{ width: '160px' }}
            onClick={() => modalDisplay(false)}
          >
            Cancel
          </div>

          <div
            className={`${classes.buttonElementBase} ${
              isUpdateButtonDisabled ? classes.disabledUpdateButtonElement : classes.updateButtonElement
            }`}
            style={{ width: '160px' }}
            onClick={() => handlerUpdate()}
          >
            Update
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilePropertiesModal
