import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useState } from 'react'
// These are commented out because these features are not part of phase1
// import VolumeSharingModal from './VolumeSharingModal'
// import { PostageBatch } from '@ethersphere/bee-js'
import NewVolumePropertiesModal from './NewVolumePropertiesModal'
import { Tab } from '../../../constants'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

interface VolumeModalProps {
  modalDisplay: (value: boolean) => void
  newVolume?: boolean
}

const VolumeModal = ({ modalDisplay, newVolume }: VolumeModalProps): ReactElement => {
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
          <NewVolumePropertiesModal modalDisplay={modalDisplay} newVolume={newVolume ? newVolume : false} />
        ) : null}
        {/* This is commented out because this feature is not part of phase1 */}
        {/* {activeTab === Tab.Sharing ? (
          <VolumeSharingModal textToBeDisabled={alreadyAddedWithACT} modalDisplay={value => modalDisplay(value)} />
        ) : null} */}
      </div>
    </div>
  )
}

export default VolumeModal
