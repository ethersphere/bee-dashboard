import { Button, createStyles, makeStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { IconProps } from 'react-feather'

interface Props {
  onClick: () => void
  iconType: React.ComponentType<IconProps>
  children: string
  className?: string
}

const useStyles = makeStyles(() =>
  createStyles({
    button: {
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
  }),
)

export function SwarmButton({ children, onClick, iconType, className }: Props): ReactElement {
  const classes = useStyles()

  const icon = React.createElement(iconType, {
    size: '1.25rem',
    color: '#dd7700',
  })

  const classNames = className ? [className, classes.button].join(' ') : classes.button

  return (
    <Button className={classNames} onClick={() => onClick()} variant="contained" startIcon={icon}>
      {children}
    </Button>
  )
}
