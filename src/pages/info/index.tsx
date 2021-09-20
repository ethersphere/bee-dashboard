import { ReactElement, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import StatusCard from './StatusCard'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      rowGap: theme.spacing(3),
    },
  }),
)

export default function Status(): ReactElement {
  const classes = useStyles()

  const {
    status,
    latestUserVersion,
    isLatestBeeVersion,
    latestBeeVersionUrl,
    topology,
    nodeAddresses,
    chequebookAddress,
  } = useContext(BeeContext)

  if (!status.all) return <TroubleshootConnectionCard />

  return (
    <div className={classes.root}>
      <StatusCard
        userBeeVersion={latestUserVersion}
        isLatestBeeVersion={isLatestBeeVersion}
        isOk={status.all}
        nodeTopology={topology}
        latestUrl={latestBeeVersionUrl}
        nodeAddresses={nodeAddresses}
      />
      {nodeAddresses && chequebookAddress && (
        <EthereumAddressCard nodeAddresses={nodeAddresses} chequebookAddress={chequebookAddress} />
      )}
    </div>
  )
}
