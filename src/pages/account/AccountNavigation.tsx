import { createStyles, makeStyles, Tab, Tabs, Theme } from '@material-ui/core'
import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACCOUNT_TABS } from '../../routes'

const tabMap = {
  WALLET: 0,
  CHEQUEBOOK: 1,
  STAMPS: 2,
  FEEDS: 3,
}

interface Props {
  active: 'WALLET' | 'CHEQUEBOOK' | 'STAMPS' | 'FEEDS'
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(4),
      textTransform: 'none',
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
    navigate(ACCOUNT_TABS[newValue])
  }

  return (
    <div className={classes.root}>
      <Tabs value={tabMap[active]} onChange={onChange} variant="fullWidth">
        <Tab className={classes.leftTab} key="WALLET" label="Wallet" />
        <Tab className={classes.centerTab} key="CHEQUEBOOK" label="Chequebook" />
        <Tab className={classes.centerTab} key="STAMPS" label="Stamps" />
        <Tab className={classes.rightTab} key="FEEDS" label="Feeds" />
      </Tabs>
    </div>
  )
}
