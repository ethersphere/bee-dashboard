/* eslint-disable no-alert */
import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext, useEffect, useState } from 'react'
import NewVolumeModal from './NewVolumeModal'
import { Context as SettingsContext } from '../../../providers/Settings'
import { Context as FileManagerContext } from '../../../providers/FileManager'
import VolumeModal from './VolumeModal'
import { PostageBatch } from '@ethersphere/bee-js'
import NotificationSign from '../../NotificationSign'
import { getUsableStamps } from '../../../utils/file'

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    modalContainer: {
      display: 'flex',
      gap: '20px',
      flexDirection: 'column',
      justifyContent: 'space-between',
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
      overflowY: 'scroll',
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
    buttonNewVolumeDisabled: {
      backgroundColor: '#878787;',
      color: '#FFFFFF',
      cursor: 'not-allowed',
      '&:hover': {
        backgroundColor: '#878787;',
        color: '#FFFFFF',
      },
    },
    newButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    cancelButtonContainer: {
      display: 'flex',
      justifyContent: 'right',
    },
  }),
)

export interface ActiveVolume {
  volumeModalDisplay: boolean
  volume: PostageBatch
  validity: number
}

interface ManageModalProps {
  modalDisplay: (value: boolean) => void
}

const ManageVolumesModal = ({ modalDisplay }: ManageModalProps): ReactElement => {
  const classes = useStyles()
  const [newVolumeModalDisplay, setNewVolumeModalDisplay] = useState(false)
  const { beeApi } = useContext(SettingsContext)
  const [uStamps, setUStamps] = useState<PostageBatch[]>([])
  const [activeVolume, setActiveVolume] = useState<ActiveVolume>({} as ActiveVolume)
  const { isNewVolumeCreated, setIsNewVolumeCreated } = useContext(FileManagerContext)
  const notificationThresholdDate = new Date()
  notificationThresholdDate.setDate(new Date().getDate() + 7)

  const handlerCreateNewVolume = (value: boolean) => {
    if (uStamps && uStamps.length < 5) {
      setNewVolumeModalDisplay(value)
    }
  }

  useEffect(() => {
    if (isNewVolumeCreated) {
      const getUStamps = async () => {
        const usableStamps = await getUsableStamps(beeApi)
        setUStamps([...usableStamps])
        setActiveVolume({
          volumeModalDisplay: false,
          volume: usableStamps[0],
          validity: 0,
        })
      }
      getUStamps()
      setIsNewVolumeCreated(false)
    }
  }, [beeApi, isNewVolumeCreated])

  return (
    <div className={classes.modal}>
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>Manage volumes</div>
        <div className={classes.modalContent}>
          {
            "Info, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
          }
        </div>
        <div className={classes.flexCenter}>
          {uStamps.map((stamp, index) => (
            <div
              key={index}
              className={classes.volumenButtonContainer}
              onClick={() =>
                setActiveVolume({
                  volumeModalDisplay: true,
                  volume: stamp,
                  validity: stamp.duration.toEndDate(new Date()).getTime(),
                })
              }
            >
              <div className={classes.buttonElement}>{stamp.label}</div>
              <div className={classes.buttonElementNotificationSign}>
                {stamp.duration.toEndDate() < notificationThresholdDate ? <NotificationSign text="!" /> : null}
              </div>
            </div>
          ))}
        </div>

        <div className={classes.newButtonContainer}>
          <div
            className={`${classes.buttonElement} ${
              uStamps.length < 5 ? classes.buttonNewVolume : classes.buttonNewVolumeDisabled
            }`}
            onClick={() => handlerCreateNewVolume(true)}
          >
            New volume
          </div>
        </div>

        <div className={classes.cancelButtonContainer}>
          <div
            className={classes.buttonElement}
            style={{ width: '160px', zIndex: '110' }}
            onClick={() => modalDisplay(false)}
          >
            Cancel
          </div>
        </div>
      </div>
      {newVolumeModalDisplay && <NewVolumeModal modalDisplay={(value: boolean) => setNewVolumeModalDisplay(value)} />}
      {activeVolume.volumeModalDisplay && (
        <VolumeModal
          modalDisplay={(value: boolean) => setActiveVolume(prev => ({ ...prev, volumeModalDisplay: value }))}
          newVolume={false}
          activeVolume={activeVolume}
        />
      )}
    </div>
  )
}

export default ManageVolumesModal
