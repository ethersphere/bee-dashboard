import { ReactElement, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import StatusCard from './StatusCard'
import EthereumAddressCard from '../../components/EthereumAddressCard'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'

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

  // if (!status.all) return <TroubleshootConnectionCard />

  return (
    <div className={classes.root}>
      <ExpandableList label="Bee nodes" defaultOpen>
        <ExpandableListItem>Discovered nodes</ExpandableListItem>
        <ExpandableListItem>Connected peers</ExpandableListItem>
        <ExpandableListItem>Agent</ExpandableListItem>
        <ExpandableListItem>Public key</ExpandableListItem>
        <ExpandableListItem>PSS public key</ExpandableListItem>
        <ExpandableListItem>Overlay address (Peer ID)</ExpandableListItem>

        <ExpandableList level={1} label="Underlay addresses">
          <ExpandableListItem>0x024208501...5135125</ExpandableListItem>
          <ExpandableListItem>0x350151519...5215121</ExpandableListItem>
        </ExpandableList>
      </ExpandableList>
      <ExpandableList label="Blockchain" defaultOpen>
        <ExpandableListItem>Ethereum address</ExpandableListItem>
        <ExpandableListItem>Chequebook contract address</ExpandableListItem>
      </ExpandableList>
    </div>
  )
}
