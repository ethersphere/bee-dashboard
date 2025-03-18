import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useState } from 'react'
import FileSharingModal from './FileSharingModal'
import FilePropertiesModal from './FilePropertiesModal'
import { Tab } from '../../constants'

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
    buttonElementNotificationSign: {
      position: 'absolute',
      right: '-25px',
      top: '0',
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
  }),
)

interface FileModalProps {
  volumeName: string
  volumeValidity: Date
  fileName: string
  fileDetails?: string
  fileLabels?: string
  modalDisplay: (value: boolean) => void
}

const FileModal = ({
  volumeName,
  volumeValidity,
  fileName,
  fileDetails,
  fileLabels,
  modalDisplay,
}: FileModalProps): ReactElement => {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Properties)

  const alreadyAddedWithACT = [
    '0x9cbDe6569BA1220E46f256371368A05f480bb78C',
    '0x9cbDe6569BA1220E46f256371368A05f480bb78C',
    '0x9cbDe6569BA1220E46f256371368A05f480bb78C',
  ]

  return (
    <div className={classes.modal}>
      <div className={classes.modalContainer}>
        <div className={classes.tabPanel}>
          <div
            className={`${classes.tabPanelItem} ${activeTab === Tab.Properties ? classes.tabPanelItemActive : null}`}
            onClick={() => setActiveTab(Tab.Properties)}
          >
            Properties
          </div>
          <div
            className={`${classes.tabPanelItem} ${activeTab === Tab.Sharing ? classes.tabPanelItemActive : null}`}
            onClick={() => setActiveTab(Tab.Sharing)}
          >
            Sharing
          </div>
        </div>
        {activeTab === Tab.Properties ? (
          <FilePropertiesModal
            volumeName={volumeName}
            volumeValidity={volumeValidity}
            fileName={fileName}
            fileDetails={fileDetails}
            fileLabels={fileLabels}
            modalDisplay={modalDisplay}
          />
        ) : null}
        {activeTab === Tab.Sharing ? (
          <FileSharingModal textToBeDisabled={alreadyAddedWithACT} modalDisplay={value => modalDisplay(value)} />
        ) : null}
      </div>
    </div>
  )
}

export default FileModal
