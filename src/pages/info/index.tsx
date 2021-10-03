import { ReactElement, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Chip, Button } from '@material-ui/core'

import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import TopologyStats from '../../components/TopologyStats'

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
      <ExpandableList label="Bee Node" defaultOpen>
        <ExpandableListItem
          label="Agent"
          value={
            <div>
              <a href="https://github.com/ethersphere/bee" rel="noreferrer" target="_blank">
                Bee
              </a>{' '}
              <span>{latestUserVersion || '-'}</span>{' '}
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
        <ExpandableListItemKey label="Public key" value={nodeAddresses?.publicKey || ''} />
        <ExpandableListItemKey label="PSS public key" value={nodeAddresses?.pssPublicKey || ''} />
        <ExpandableListItemKey label="Overlay address (Peer ID)" value={nodeAddresses?.overlay || ''} />

        <ExpandableList level={1} label="Underlay addresses">
          {nodeAddresses?.underlay.map(addr => (
            <ExpandableListItem key={addr} value={addr} />
          ))}
        </ExpandableList>
      </ExpandableList>
      <ExpandableList label="Blockchain" defaultOpen>
        <ExpandableListItemKey label="Ethereum address" value={nodeAddresses?.ethereum || ''} />
        <ExpandableListItemKey label="Chequebook contract address" value={chequebookAddress?.chequebookAddress || ''} />
      </ExpandableList>
      <TopologyStats topology={topology} />
    </div>
  )
}
