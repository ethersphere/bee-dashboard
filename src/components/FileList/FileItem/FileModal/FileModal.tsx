import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useState } from 'react'
// This is commented out because this feature is not part of phase1
// import FileSharingModal from './FileSharingModal'
import FilePropertiesModal from './FilePropertiesModal'
import { Tab } from '../../../../constants'
import { Reference } from '@ethersphere/bee-js'
import { useFileManagerGlobalStyles } from '../../../../styles/globalFileManagerStyles'

const useStyles = makeStyles(() => createStyles({}))

interface FileModalProps {
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

const FileModal = ({
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
}: FileModalProps): ReactElement => {
  const classes = useFileManagerGlobalStyles()
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Properties)

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
          {/* This is commented out because this feature is not part of phase1 */}
          {/* <div
            className={`${classes.tabPanelItem} ${activeTab === Tab.Sharing ? classes.tabPanelItemActive : null}`}
            onClick={() => setActiveTab(Tab.Sharing)}
          >
            Sharing
          </div> */}
        </div>
        {activeTab === Tab.Properties ? (
          <FilePropertiesModal
            volumeName={volumeName}
            volumeValidity={volumeValidity}
            fileName={fileName}
            fileDetails={fileDetails}
            fileLabels={fileLabels}
            fileRef={fileRef}
            modalDisplay={modalDisplay}
            batchId={batchId}
            owner={owner}
            actPublisher={actPublisher}
            histroyRef={histroyRef}
          />
        ) : null}
        {/* This is commented out because this feature is not part of phase1 */}
        {/* {activeTab === Tab.Sharing ? (
          <FileSharingModal textToBeDisabled={alreadyAddedWithACT} modalDisplay={value => modalDisplay(value)} />
        ) : null} */}
      </div>
    </div>
  )
}

export default FileModal
