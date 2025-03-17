import { createStyles, makeStyles, Tooltip } from '@material-ui/core'
import React from 'react'
import { useState } from 'react'
import type { ReactElement } from 'react'
import NotificationSign from '../NotificationSign'
import SwarmCheckedIcon from '../icons/SwarmCheckedIcon'
import VolumeIcon from '../icons/VolumeIcon'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      backgroundColor: '#ffffff',
      fontSize: '12px',
      display: 'flex',
      width: '65px',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontFamily: '"iAWriterMonoV", monospace',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    },
    flex: {
      display: 'flex',
    },
    absoluteLeft: {
      position: 'absolute',
      left: '15px',
    },
    absoluteRight: {
      position: 'absolute',
      right: '5px',
      top: '2px',
    },
    volumeLabel: {
      textAlign: 'center',
    },
  }),
)

interface Props {
  label: string
  size: string
  validity: number
  notificationText?: string
  onClick: (isActive: boolean) => void
}

const Volume = ({ label, size, validity, notificationText, onClick }: Props): ReactElement => {
  const classes = useStyles()
  const [isChoosed, setIsChoosed] = useState(false)

  return (
    <Tooltip
      title={
        <React.Fragment>
          <div>Expire date: {validity}</div>
          <div>
            Free space: <strong>1.26 of {size}</strong>
          </div>
        </React.Fragment>
      }
      placement="top"
      arrow
    >
      <div
        className={classes.container}
        onClick={() => {
          onClick(!isChoosed)
          setIsChoosed(!isChoosed)
        }}
      >
        <div className={classes.flex}>
          <div className={classes.absoluteLeft}>
            <SwarmCheckedIcon color={isChoosed ? '#DE7700' : '#33333333'} />
          </div>
          <VolumeIcon color={isChoosed ? '#333333' : '#33333333'} />
          {notificationText ? (
            <div className={classes.absoluteRight}>
              {validity < 1000000000000 ? <NotificationSign text={notificationText} /> : null}
            </div>
          ) : null}
        </div>
        <div className={classes.volumeLabel}>{label}</div>
      </div>
    </Tooltip>
  )
}

export default Volume
