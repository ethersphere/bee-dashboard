import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useState } from 'react'
import DownloadIcon from '../icons/DownloadIcon'
import { SwarmTextInput } from '../SwarmTextInput'

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
      gap: '20px',
      flexDirection: 'column',
      // justifyContent: 'space-between',
      backgroundColor: '#EDEDED',
      padding: '20px',
      width: '552px',
      height: '696px',
    },
    modalHeader: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: '26px',
    },
    modalContent: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '28px',
    },
    flexCenter: {
      display: 'flex',
      gap: '20px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    volumenButtonContainer: {
      position: 'relative',
    },
    buttonElement: {
      backgroundColor: '#FFFFFF',
      width: '256px',
      height: '42px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: '#DE7700',
        color: '#FFFFFF',
      },
    },
    buttonElementNotificationSign: {
      position: 'absolute',
      right: '-25px',
      top: '0',
    },
    buttonNewVolume: {
      backgroundColor: '#DE7700',
      color: '#FFFFFF',
    },
    cancelButtonContainer: {
      display: 'flex',
      justifyContent: 'right',
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
    tabPanelItemActive: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      color: 'black',
    },
    flex: {
      display: 'flex',
      gap: '20px',
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '168px',
      backgroundColor: '#ffffff',
      justifyContent: 'left',
      alignItems: 'top',
      padding: '5px 15px',
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '10px',
    },
    inputContainerName: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '42px',
      backgroundColor: '#ffffff',
      justifyContent: 'left',
      alignItems: 'top',
      padding: '5px 15px',
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '10px',
    },
    textarea: {
      paddingLeft: '0px',
      height: '100%',
      resize: 'none',
      border: 'none',
      width: '100%',
      '&:focus': {
        outline: 'none',
      },
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '14px',
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
    copyIconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: '#FFFFFF',
      height: '53px',
      width: '53px',
    },
  }),
)

interface FilePropertiesModalProps {
  volumeName: string
  volumeValidity: Date
  fileName: string
  fileDetails?: string
  fileLabels?: string
  modalDisplay: (value: boolean) => void
}

const FilePropertiesModal = ({
  volumeName,
  volumeValidity,
  fileName,
  fileDetails,
  fileLabels,
  modalDisplay,
}: FilePropertiesModalProps): ReactElement => {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState('Properties')
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
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
          >
            <DownloadIcon color={isHovered ? '#FFFFFF' : '#333333'} />
            <div style={{ textAlign: 'center' }}>Download now</div>
          </div>
        </div>
        <SwarmTextInput name="Name" label="Name" required={false} defaultValue={fileName} />
        <SwarmTextInput
          name="Name"
          label="Details"
          defaultValue={fileDetails}
          required={false}
          multiline={true}
          rows={6}
          placeholder="Lorem ipsum"
        />
        {/* <div className={classes.inputContainer}>
              <label htmlFor="find-input">Details</label>
              <textarea className={classes.textarea} id="find-input" placeholder="Lorem ipsum" />
              </div> */}
        <SwarmTextInput
          name="Name"
          label="Labels"
          defaultValue={fileLabels}
          required={false}
          multiline={true}
          rows={6}
          placeholder="Lorem ipsum"
        />
        {/* <div className={classes.inputContainer}>
              <label htmlFor="find-input">Labels</label>
              <textarea className={classes.textarea} id="find-input" placeholder="Lorem ipsum" />
              </div> */}
        <div className={classes.cancelButtonContainer}>
          <div className={classes.buttonElement} style={{ width: '160px' }} onClick={() => modalDisplay(false)}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilePropertiesModal
