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
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'
import VolumeItem from './VolumeItem'

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
    volumeButtonContainer: {
      position: 'relative',
      cursor: 'pointer',
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
      cursor: 'pointer',
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
  const classesGlobal = useFileManagerGlobalStyles()
  const [newVolumeModalDisplay, setNewVolumeModalDisplay] = useState(false)
  const { beeApi } = useContext(SettingsContext)
  const [usableStamps, setUsableStamps] = useState<PostageBatch[]>([])
  const [activeVolume, setActiveVolume] = useState<ActiveVolume>({} as ActiveVolume)
  const [volumeCreation, setVolumeCreation] = useState(false)
  const { isNewVolumeCreated, setIsNewVolumeCreated } = useContext(FileManagerContext)
  const notificationThresholdDate = new Date()
  notificationThresholdDate.setDate(new Date().getDate() + 7)
  const handlerCreateNewVolume = (value: boolean) => {
    if (usableStamps && usableStamps.length < 5) {
      setNewVolumeModalDisplay(value)
    }
  }

  useEffect(() => {
    const getStamps = async () => {
      const stamps = await getUsableStamps(beeApi)
      setUsableStamps([...stamps])
    }
    getStamps()
  }, [beeApi])

  useEffect(() => {
    if (isNewVolumeCreated) {
      setVolumeCreation(true)
      const getStamps = async () => {
        const stamps = await getUsableStamps(beeApi)
        setUsableStamps([...stamps])
        setActiveVolume({
          volumeModalDisplay: false,
          volume: stamps[0],
          validity: 0,
        })
      }
      getStamps()
      setIsNewVolumeCreated(false)
    }
  }, [beeApi, isNewVolumeCreated, setIsNewVolumeCreated])

  return (
    <div className={classesGlobal.modal}>
      <div className={classesGlobal.modalContainer}>
        <div className={classesGlobal.modalHeader}>Manage volumes</div>
        <div className={classes.modalContent}>
          {
            "Info, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
          }
        </div>
        <div className={classes.flexCenter}>
          {usableStamps.map((stamp, index) => (
            <div key={index}>
              <VolumeItem
                setActiveVolume={setActiveVolume}
                stamp={stamp}
                notificationThresholdDate={notificationThresholdDate}
              />
            </div>
          ))}
        </div>

        <div className={classes.newButtonContainer}>
          <div
            className={`${classes.buttonElement} ${
              usableStamps.length < 5 ? classes.buttonNewVolume : classes.buttonNewVolumeDisabled
            }`}
            onClick={() => handlerCreateNewVolume(true)}
          >
            New volume
          </div>
        </div>

        <div className={classesGlobal.bottomButtonContainer}>
          <div
            className={`${classesGlobal.buttonElementBase} ${classesGlobal.generalButtonElement}`}
            style={{ width: '160px', zIndex: '110' }}
            onClick={() => modalDisplay(false)}
          >
            {volumeCreation ? 'Ok' : 'Cancel'}
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
