import { ReactElement, useContext } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItemKey from '../../../components/ExpandableListItemKey'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
import StatusIcon from '../../../components/StatusIcon'
import { Context } from '../../../providers/Bee'

export default function EthereumConnectionCheck(): ReactElement | null {
  const { status, isLoading, nodeAddresses } = useContext(Context)
  const { isOk, isEnabled } = status.blockchainConnection

  if (!isEnabled) return null

  return (
    <ExpandableList
      label={
        <>
          <StatusIcon isOk={isOk} isLoading={isLoading} /> Connection to Blockchain
        </>
      }
    >
      <ExpandableListItemNote>
        {isOk ? (
          'Your node is connected to the xDai blockchain'
        ) : (
          <>
            Your Bee node must have access to the xDai blockchain, so that it can interact and deploy your chequebook
            contract. You can run{' '}
            <a href="https://www.xdaichain.com/" rel="noreferrer" target="_blank">
              your own xDai node
            </a>
            , or use a provider instead - we recommend{' '}
            <a href="https://getblock.io/" rel="noreferrer" target="_blank">
              Getblock
            </a>
            . By default, Bee expects a local node at http://localhost:8545. To use a provider instead, simply change
            the <strong>swap-endpoint</strong> in your configuration file.
          </>
        )}
      </ExpandableListItemNote>
      {nodeAddresses?.ethereum && <ExpandableListItemKey label="Ethereum Address" value={nodeAddresses?.ethereum} />}
    </ExpandableList>
  )
}
