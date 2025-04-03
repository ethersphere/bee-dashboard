import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { PostageBatch } from '@ethersphere/bee-js'
import NotificationSign from '../../NotificationSign'

const useStyles = makeStyles(() =>
  createStyles({
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
  }),
)

export interface ActiveVolume {
  volumeModalDisplay: boolean
  volume: PostageBatch
  validity: number
}

interface VolumeItemProps {
  setActiveVolume: (value: ActiveVolume) => void
  stamp: PostageBatch
  notificationThresholdDate: Date
}

const VolumeItem = ({ setActiveVolume, stamp, notificationThresholdDate }: VolumeItemProps): ReactElement => {
  const classes = useStyles()

  return (
    <div
      className={classes.volumeButtonContainer}
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
  )
}

export default VolumeItem
