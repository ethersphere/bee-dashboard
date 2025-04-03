import { createStyles, makeStyles, Tooltip } from '@material-ui/core'
import React from 'react'
import { useState } from 'react'
import type { ReactElement } from 'react'
import SwarmCheckedIcon from '../../icons/SwarmCheckedIcon'
import VolumeIcon from '../../icons/VolumeIcon'
import NotificationSign from '../../NotificationSign'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

const useStyles = makeStyles(() =>
  createStyles({
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
  const classesGlobal = useFileManagerGlobalStyles()
  const [isSelected, setIsSelected] = useState(false)

  return (
    <div
      className={classesGlobal.filesHandlerItemContainer}
      onClick={() => {
        onClick(!isSelected)
        setIsSelected(!isSelected)
      }}
    >
      <div className={classes.flex}>
        <div className={classes.absoluteLeft}>
          <SwarmCheckedIcon color={isSelected ? '#DE7700' : '#33333333'} />
        </div>
        <VolumeIcon color={isSelected ? '#333333' : '#33333333'} />
        {notificationText ? (
          <div className={classes.absoluteRight}>
            {validity < 1000000000000 ? <NotificationSign text={notificationText} /> : null}
          </div>
        ) : null}
      </div>
      <div className={classes.volumeLabel}>{label}</div>
    </div>
  )
}

export default Volume
