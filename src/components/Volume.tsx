import { createStyles, makeStyles, Tooltip } from '@material-ui/core'
import React from 'react'
import { useState } from 'react'
import type { ReactElement } from 'react'
import NotificationSign from './NotificationSign'
import VolumeIcon from './icons/VolumeIcon'
import SwarmCheckedIcon from './icons/SwarmCheckedIcon'

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
  }),
)

interface Props {
  label: string
  expire: string
  size: string
  notificationText?: string
}

const Volume = ({ label, expire, size, notificationText }: Props): ReactElement => {
  const classes = useStyles()
  const [clicked, setClicked] = useState(false)

  return (
    <Tooltip
      title={
        <React.Fragment>
          <div>Expire date: {expire}</div>
          <div>
            Free space: <strong>1.26 of {size}</strong>
          </div>
        </React.Fragment>
      }
      placement="top"
      arrow
    >
      <div className={classes.container} onClick={() => setClicked(!clicked)}>
        <div className={classes.flex}>
          <div className={classes.absoluteLeft}>
            <SwarmCheckedIcon color={clicked ? '#DE7700' : '#33333333'} />
          </div>
          <VolumeIcon color={clicked ? '#333333' : '#33333333'} />
          {notificationText ? (
            <div className={classes.absoluteRight}>
              <NotificationSign text={notificationText} />
            </div>
          ) : null}
        </div>
        <div>{label}</div>
      </div>
    </Tooltip>
  )
}

export default Volume
