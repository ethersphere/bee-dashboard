import { BeeModes } from '@ethersphere/bee-js'
import { Tab, Tabs } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

import { Context } from '../../providers/Bee'
import { ACCOUNT_TABS } from '../../routes'

const tabMap = {
  WALLET: 0,
  CHEQUEBOOK: 1,
  STAMPS: 2,
  FEEDS: 3,
  STAKING: 4,
}

interface Props {
  active: 'WALLET' | 'CHEQUEBOOK' | 'STAMPS' | 'FEEDS' | 'STAKING'
}

const useStyles = makeStyles()(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
    textTransform: 'none',
    marginLeft: theme.spacing(-0.25),
    marginRight: theme.spacing(-0.25),
  },
  tab: {
    marginLeft: theme.spacing(0.25),
    marginRight: theme.spacing(0.25),
  },
}))

export function AccountNavigation({ active }: Props): ReactElement {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { nodeInfo } = useContext(Context)

  function onChange(_event: React.SyntheticEvent, newValue: number) {
    navigate(ACCOUNT_TABS[newValue])
  }

  return (
    <div className={classes.root}>
      <Tabs value={tabMap[active]} onChange={onChange} variant="fullWidth">
        <Tab className={classes.tab} key="WALLET" label="Wallet" />
        <Tab className={classes.tab} key="CHEQUEBOOK" label="Chequebook" />
        <Tab className={classes.tab} key="STAMPS" label="Stamps" />
        <Tab className={classes.tab} key="FEEDS" label="Feeds" />
        {nodeInfo?.beeMode === BeeModes.FULL ? <Tab className={classes.tab} key="STAKING" label="Staking" /> : null}
      </Tabs>
    </div>
  )
}
