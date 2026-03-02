import { Typography } from '@mui/material'
import { ReactElement } from 'react'
import Check from 'remixicon-react/CheckLineIcon'
import AlertCircle from 'remixicon-react/ErrorWarningFillIcon'
import Connecting from 'remixicon-react/LinksLineIcon'
import RefreshLine from 'remixicon-react/RefreshLineIcon'
import { makeStyles } from 'tss-react/mui'

import { CheckState } from '../providers/Bee'

import { SwarmButton, SwarmButtonProps } from './SwarmButton'

interface Props {
  icon: ReactElement
  title: string
  subtitle: string
  buttonProps: SwarmButtonProps
  status: CheckState
}

const useStyles = (backgroundColor: string) =>
  makeStyles()(theme => ({
    root: {
      flexGrow: 1,
      flexBasis: '100px',
    },
    wrapper: {
      backgroundColor,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      height: '130px',
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '18px',
    },
    button: {
      width: '100%',
      marginTop: '2px',
      backgroundColor,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        boxShadow: 'none',
        // https://github.com/mui-org/material-ui/issues/22543
        '@media (hover: none)': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          boxShadow: 'none',
        },
      },
    },
  }))

export default function Card({ buttonProps, icon, title, subtitle, status }: Props): ReactElement {
  const backgroundColor = status === CheckState.ERROR ? 'white' : '#f3f3f3'
  const { className, ...rest } = buttonProps
  const { classes } = useStyles(backgroundColor)()

  let statusIcon = null

  if (status === CheckState.OK) {
    statusIcon = <Check size="13" color="#09ca6c" />
  } else if (CheckState.STARTING) {
    statusIcon = <RefreshLine size="13" color="#d99400d5" />
  } else if (CheckState.CONNECTING) {
    statusIcon = <Connecting size="13" color="#0074D9" />
  } else if (CheckState.WARNING) {
    statusIcon = <Connecting size="13" color="#cbd900" />
  } else {
    statusIcon = <AlertCircle size="13" color="#f44336" />
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.iconWrapper}>
          {icon}
          {statusIcon}
        </div>
        <Typography variant="h2" style={{ marginBottom: '8px' }}>
          {title}
        </Typography>
        <Typography variant="caption">{subtitle}</Typography>
      </div>
      <SwarmButton className={[classes.button, className].join(' ')} {...rest} />
    </div>
  )
}
