import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { AlertCircle, Check } from 'react-feather'
import { SwarmButton, SwarmButtonProps } from './SwarmButton'

interface Props {
  icon: ReactElement
  title: string
  subtitle: string
  buttonProps: SwarmButtonProps
  status: 'ok' | 'error'
}

const useStyles = (backgroundColor: string) =>
  makeStyles((theme: Theme) =>
    createStyles({
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
    }),
  )

export default function Card({ buttonProps, icon, title, subtitle, status }: Props): ReactElement {
  const backgroundColor = status === 'error' ? 'white' : '#f3f3f3'
  const { className, ...rest } = buttonProps
  const classes = useStyles(backgroundColor)()

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.iconWrapper}>
          {icon}
          {status === 'ok' ? (
            <Check size="13" stroke="#09ca6c" />
          ) : (
            <AlertCircle size="13" fill="#f44336" stroke="white" />
          )}
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
