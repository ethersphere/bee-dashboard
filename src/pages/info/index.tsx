import { ReactElement, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Chip, Button } from '@material-ui/core'

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
        <ExpandableListItem label="Connected peers" value={topology?.connected} />
        <ExpandableListItem
          label="Agent"
          value={
            <div>
              <a href="https://github.com/ethersphere/bee" rel="noreferrer" target="_blank">
                Bee
              </a>{' '}
              <span>{latestUserVersion || '-'}</span>
              {isLatestBeeVersion ? (
                <Chip style={{ marginLeft: '7px', color: '#2145a0' }} size="small" label="latest" />
              ) : (
                <Button size="small" variant="outlined" href={latestBeeVersionUrl}>
                  update
                </Button>
              )}
            </div>
          }
        />
        <ExpandableListItem label="Public key" />
        <ExpandableListItem label="PSS public key" />
        <ExpandableListItem label="Overlay address (Peer ID)" />

        <ExpandableList level={1} label="Underlay addresses">
          <ExpandableListItem label="0x024208501...5135125" />
          <ExpandableListItem label="0x350151519...5215121" />
        </ExpandableList>
      </ExpandableList>
      <ExpandableList label="Blockchain" defaultOpen>
        <ExpandableListItem label="Ethereum address" />
        <ExpandableListItem label="Chequebook contract address" />
      </ExpandableList>
    </div>
  )
}
