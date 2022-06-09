import { createStyles, makeStyles, Tab, Tabs, Theme } from '@material-ui/core'
import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

const tabMap = {
  WALLET: 0,
  NETWORK: 1,
  STAMPS: 2,
  FEEDS: 3,
}

const tabMapReverse = ['/account/wallet', '/account/network', '/account/stamps', '/account/feeds']

interface Props {
  active: 'WALLET' | 'NETWORK' | 'STAMPS' | 'FEEDS'
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(4),
    },
    leftTab: {
      marginRight: theme.spacing(0.125),
    },
    centerTab: {
      marginLeft: theme.spacing(0.125),
      marginRight: theme.spacing(0.125),
    },
    rightTab: {
      marginLeft: theme.spacing(0.125),
    },
  }),
)

export function AccountNavigation({ active }: Props): ReactElement {
  const classes = useStyles()
  const navigate = useNavigate()

  function onChange(event: React.ChangeEvent<Record<string, never>>, newValue: number) {
    navigate(tabMapReverse[newValue])
  }

  return (
    <div className={classes.root}>
      <Tabs value={tabMap[active]} onChange={onChange} variant="fullWidth">
        <Tab className={classes.leftTab} key="WALLET" label="Wallet" />
        <Tab className={classes.centerTab} key="NETWORK" label="Network" />
        <Tab className={classes.centerTab} key="STAMPS" label="Stamps" />
        <Tab className={classes.rightTab} key="FEEDS" label="Feeds" />
      </Tabs>
    </div>
  )
}
