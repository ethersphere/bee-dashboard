import { ReactElement, useContext } from 'react'
import { Button } from '@material-ui/core'
import { Globe, Briefcase, Search, Settings, ArrowUp, RefreshCcw } from 'react-feather'

import { Context as BeeContext } from '../../providers/Bee'
import Card from '../../components/Card'
import Map from '../../components/Map'
import ExpandableListItem from '../../components/ExpandableListItem'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../routes'

export default function Status(): ReactElement {
  const {
    status,
    latestUserVersion,
    isLatestBeeVersion,
    latestBeeVersionUrl,
    topology,
    nodeInfo,
    balance,
    chequebookBalance,
  } = useContext(BeeContext)
  const navigate = useNavigate()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', alignContent: 'stretch' }}>
        {status.all ? (
          <Card
            buttonProps={{ iconType: Search, children: 'Access Content', onClick: () => navigate(ROUTES.DOWNLOAD) }}
            icon={<Globe />}
            title="Your node is connected."
            subtitle="You are connected to Swarm."
            status="ok"
          />
        ) : (
          <Card
            buttonProps={{ iconType: Settings, children: 'Open node setup', onClick: () => navigate(ROUTES.STATUS) }}
            icon={<Globe />}
            title="Your node is not connected…"
            subtitle="You are not connected to Swarm."
            status="error"
          />
        )}
        <div style={{ width: '8px' }}></div>
        {nodeInfo?.beeMode && ['light', 'full', 'dev'].includes(nodeInfo.beeMode) ? (
          <Card
            buttonProps={{
              iconType: Briefcase,
              children: 'Manage your wallet.',
              onClick: () => navigate(ROUTES.ACCOUNT_WALLET),
            }}
            icon={<Briefcase />}
            title={`${balance?.bzz.toSignificantDigits(4)} xBZZ | ${balance?.dai.toSignificantDigits(4)} xDAI`}
            subtitle="Current wallet balance."
            status="ok"
          />
        ) : (
          <Card
            buttonProps={{
              iconType: Settings,
              children: 'Setup wallet',
              onClick: () => navigate(ROUTES.WALLET),
            }}
            icon={<ArrowUp />}
            title="Your wallet is not setup."
            subtitle="To share content on Swarm, please setup your wallet."
            status="error"
          />
        )}
        {nodeInfo?.beeMode && ['light', 'full', 'dev'].includes(nodeInfo.beeMode) && (
          <>
            <div style={{ width: '8px' }} />
            {chequebookBalance?.availableBalance !== undefined &&
            chequebookBalance?.availableBalance.toBigNumber.isGreaterThan(0) ? (
              <Card
                buttonProps={{
                  iconType: RefreshCcw,
                  children: 'View chequebook',
                  onClick: () => navigate(ROUTES.ACCOUNT_CHEQUEBOOK),
                }}
                icon={<RefreshCcw />}
                title={`${chequebookBalance?.availableBalance.toSignificantDigits(4)} xBZZ`}
                subtitle="Current chequebook balance."
                status="ok"
              />
            ) : (
              <Card
                buttonProps={{
                  iconType: RefreshCcw,
                  children: 'View chequebook',
                  onClick: () => navigate(ROUTES.ACCOUNT_CHEQUEBOOK),
                }}
                icon={<RefreshCcw />}
                title={
                  chequebookBalance?.availableBalance
                    ? `${chequebookBalance.availableBalance.toFixedDecimal(4)} xBZZ`
                    : 'No available balance.'
                }
                subtitle="Chequebook not setup."
                status="error"
              />
            )}
          </>
        )}
      </div>
      <div style={{ height: '16px' }} />
      <Map />
      <div style={{ height: '2px' }} />
      <ExpandableListItem label="Connected peers" value={topology?.connected ?? '-'} />
      <ExpandableListItem label="Population" value={topology?.population ?? '-'} />
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
