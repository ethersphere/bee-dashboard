import { Button, CircularProgress, createStyles, makeStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { IconProps } from 'react-feather'

interface Props {
  onClick: () => void
  iconType: React.ComponentType<IconProps>
  children: string
  className?: string
  disabled?: boolean
  loading?: boolean
}

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      position: 'relative',
      '&:hover': {
        '& svg': {
          stroke: '#fff',
          transition: '0.1s',
        },
      },
      '&:focus': {
        '& svg': {
          stroke: '#fff',
          transition: '0.1s',
        },
      },
    },
    spinnerWrapper: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '40px',
      height: '40px',
      transform: 'translate(-50%, -50%)',
    },
  }),
)

export function SwarmButton({ children, onClick, iconType, className, disabled, loading }: Props): ReactElement {
  const classes = useStyles()

  const icon = React.createElement(iconType, {
    size: '1.25rem',
    color: disabled ? 'rgba(0, 0, 0, 0.26)' : '#dd7700',
  })

  const classNames = className ? [className, classes.button].join(' ') : classes.button

  return (
    <Button className={classNames} onClick={onClick} variant="contained" startIcon={icon} disabled={disabled}>
      {children}
      {loading && (
        <div className={classes.spinnerWrapper}>
          <CircularProgress />
        </div>
      )}
    </Button>
  )
}
