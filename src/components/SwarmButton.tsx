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
  cancel?: boolean
  variant?: 'text' | 'contained' | 'outlined'
}

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      height: '52px',
      position: 'relative',
      whiteSpace: 'nowrap',
      color: '#242424',
      '&:hover, &:focus': {
        '& svg': {
          stroke: '#fff',
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
}: Props): ReactElement {
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
      className={getButtonClassName()}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick()
        event.currentTarget.blur()
      }}
      variant={variant}
      startIcon={icon}
      disabled={disabled}
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
