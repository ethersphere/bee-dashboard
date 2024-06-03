import { Button } from '@material-ui/core'
import { ReactElement, useContext } from 'react'
import ExpandableListItem from '../../components/ExpandableListItem'
import Map from '../../components/Map'
import { BEE_DESKTOP_LATEST_RELEASE_PAGE } from '../../constants'
import { useBeeDesktop, useNewBeeDesktopVersion } from '../../hooks/apiHooks'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { chainIdToName } from '../../utils/chain'
import { ChequebookInfoCard } from './ChequebookInfoCard'
import NodeInfoCard from './NodeInfoCard'
import { WalletInfoCard } from './WalletInfoCard'

export default function Status(): ReactElement {
  const { beeVersion, status, topology, nodeInfo, chainId } = useContext(BeeContext)
  const { isDesktop, desktopUrl } = useContext(SettingsContext)
  const { beeDesktopVersion } = useBeeDesktop(isDesktop, desktopUrl)
  const { newBeeDesktopVersion } = useNewBeeDesktopVersion(isDesktop, desktopUrl, false)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', alignContent: 'stretch' }}>
        <NodeInfoCard />
        <div style={{ width: '8px' }}></div>
        <WalletInfoCard />
        <div style={{ width: '8px' }}></div>
        <ChequebookInfoCard />
      </div>
      <div style={{ height: '16px' }} />
      <Map error={status.topology.checkState !== 'OK'} />
      <div style={{ height: '2px' }} />
      <ExpandableListItem label="Connected peers" value={topology?.connected ?? '-'} />
      <ExpandableListItem label="Population" value={topology?.population ?? '-'} />
      <div style={{ height: '16px' }} />
      {isDesktop && (
        <ExpandableListItem
          label="Desktop version"
          value={
            <div>
              {`${beeDesktopVersion} `}
              <Button
                size="small"
                variant="outlined"
                href={BEE_DESKTOP_LATEST_RELEASE_PAGE}
                target="_blank"
                disabled={newBeeDesktopVersion === ''}
                style={{ height: '26px' }}
              >
                {newBeeDesktopVersion === '' ? 'latest' : 'update'}
              </Button>
            </div>
          }
        />
      )}
      <ExpandableListItem label="Bee version" value={beeVersion} />
      <ExpandableListItem label="Mode" value={nodeInfo?.beeMode} />
      {chainId !== null && <ExpandableListItem label="Blockchain network" value={chainIdToName(chainId)} />}
    </div>
  )
}
