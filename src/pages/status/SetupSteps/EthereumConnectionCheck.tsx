import type { ReactElement } from 'react'
import { Typography } from '@material-ui/core/'
import EthereumAddress from '../../../components/EthereumAddress'

type Props = StatusEthereumConnectionHook

export default function EthereumConnectionCheck({ isOk, nodeAddresses }: Props): ReactElement | null {
  if (isOk) {
    return (
      <div>
        <Typography variant="subtitle1" gutterBottom>
          Node Address
        </Typography>
        <EthereumAddress address={nodeAddresses?.ethereum} />
      </div>
    )
  }

  return (
    <p>
      Your Bee node must have access to the xDai blockchain, so that it can interact and deploy your chequebook
      contract. You can run{' '}
      <a href="https://www.xdaichain.com/" rel="noreferrer" target="_blank">
        your own xDai node
      </a>
      , or use a provider instead - we recommend{' '}
      <a href="https://getblock.io/" rel="noreferrer" target="_blank">
        Getblock
      </a>
      . By default, Bee expects a local node at http://localhost:8545. To use a provider instead, simply change the{' '}
      <strong>swap-endpoint</strong> in your configuration file.
    </p>
  )
}
