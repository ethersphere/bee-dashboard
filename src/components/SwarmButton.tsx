import { Button, ButtonProps, CircularProgress, createStyles, makeStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import type { RemixiconReactIconProps } from 'remixicon-react'

export interface SwarmButtonProps extends ButtonProps {
  iconType: React.ComponentType<RemixiconReactIconProps>
  loading?: boolean
  cancel?: boolean
  variant?: 'text' | 'contained' | 'outlined'
}

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      height: '42px',
      position: 'relative',
      whiteSpace: 'nowrap',
      color: '#242424',
      '&:hover, &:focus': {
        '& svg': {
          fill: '#fff',
          transition: '0.1s',
        },
      },
    },
    cancelButton: {
      background: '#f7f7f7',
      color: '#606060',
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

export function SwarmButton({
  children,
  onClick,
  iconType,
  className,
  disabled,
  loading,
  cancel,
  variant = 'contained',
  style,
  ...other
}: SwarmButtonProps): ReactElement {
  const classes = useStyles()

  function getIconColor() {
    if (loading || disabled) {
      return 'rgba(0, 0, 0, 0.26)'
    }

    return cancel ? '#606060' : '#dd7700'
  }

  function getButtonClassName() {
    return [className, classes.button, cancel && classes.cancelButton].filter(x => x).join(' ')
  }

  const icon = React.createElement(iconType, {
    size: '1.25rem',
    color: getIconColor(),
  })

  return (
    <Button
      style={style}
      className={getButtonClassName()}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
          onClick(event)
          event.currentTarget.blur()
        }
      }}
      variant={variant}
      startIcon={icon}
      disabled={disabled}
      {...other}
    >
      {children}
      {loading && (
        <div className={classes.spinnerWrapper}>
          <CircularProgress />
        </div>
      )}
    </Button>
  )
}
