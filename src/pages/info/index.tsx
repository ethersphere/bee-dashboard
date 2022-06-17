import { ReactElement, useContext } from 'react'
import { Button } from '@material-ui/core'
import { Globe, Briefcase, Search, Settings, ArrowUp } from 'react-feather'

import { Context as BeeContext } from '../../providers/Bee'
import Card from '../../components/Card'
import Map from '../../components/Map'
import ExpandableListItem from '../../components/ExpandableListItem'

export default function Status(): ReactElement {
  const { status, latestUserVersion, isLatestBeeVersion, latestBeeVersionUrl, topology, nodeInfo, balance } =
    useContext(BeeContext)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {status.all ? (
          <Card
            buttonProps={{ iconType: Search, children: 'Access Content' }}
            icon={<Globe />}
            title="Your node is connected."
            subtitle="You can now access content hosted on Swarm."
            status="ok"
          />
        ) : (
          <Card
            buttonProps={{ iconType: Settings, children: 'Open node setup' }}
            icon={<Globe />}
            title="Your node is not connected…"
            subtitle="You’re not connected to Swarm."
            status="error"
          />
        )}
        <div style={{ width: '8px' }}></div>
        {balance?.bzz !== undefined ? (
          <Card
            buttonProps={{ iconType: Briefcase, children: 'Manage your wallet' }}
            icon={<Briefcase />}
            title={`${balance.bzz.toSignificantDigits(8)} BZZ`}
            subtitle="Current wallet balance."
            status="ok"
          />
        ) : (
          <Card
            buttonProps={{ iconType: Settings, children: 'Setup wallet' }}
            icon={<ArrowUp />}
            title="Your wallet is not setup."
            subtitle="To share content on Swarm, please setup your wallet."
            status="error"
          />
        )}
      </div>
      <div style={{ height: '16px' }} />
      <Map />
      <div style={{ height: '2px' }} />
      <ExpandableListItem label="Connected peers" value={topology?.connected ?? '-'} />
      <ExpandableListItem label="Depth" value={topology?.depth ?? '-'} />
      <div style={{ height: '16px' }} />
      <ExpandableListItem
        label="Bee version"
        value={
          <div>
            <a href="https://github.com/ethersphere/bee" rel="noreferrer" target="_blank">
              Bee
            </a>
            {` ${latestUserVersion ?? '-'} `}
            {latestUserVersion && (
              <Button
                size="small"
                variant="outlined"
                href={latestBeeVersionUrl}
                target="_blank"
                style={{ height: '26px' }}
              >
                {isLatestBeeVersion ? 'latest' : 'update'}
              </Button>
            )}
          </div>
        }
      />
      <ExpandableListItem label="Mode" value={nodeInfo?.beeMode} />
    </div>
  )
}
