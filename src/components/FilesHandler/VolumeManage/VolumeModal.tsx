import type { ReactElement } from 'react'
import { useState } from 'react'
import VolumePropertiesModal from './VolumePropertiesModal'
// This is commented out because these are not part of phase1
// import VolumeSharingModal from './VolumeSharingModal'
// import { PostageBatch } from '@ethersphere/bee-js'
import { ActiveVolume } from './ManageVolumesModal'
import { Tab } from '../../../constants'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

interface VolumeModalProps {
  modalDisplay: (value: boolean) => void
  newVolume?: boolean
  activeVolume: ActiveVolume
}

const VolumeModal = ({ modalDisplay, newVolume, activeVolume }: VolumeModalProps): ReactElement => {
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
          <VolumePropertiesModal
            modalDisplay={modalDisplay}
            newVolume={newVolume ? newVolume : false}
            activeVolume={activeVolume}
          />
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
