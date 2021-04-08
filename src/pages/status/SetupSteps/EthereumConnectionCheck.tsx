import type { ReactElement } from 'react'
import { Typography } from '@material-ui/core/'
import EthereumAddress from '../../../components/EthereumAddress'
import { useStatusEthereumConnection } from '../../../hooks/status'

export default function EthereumConnectionCheck(): ReactElement | null {
  const { isLoading, isOk, nodeAddresses } = useStatusEthereumConnection()

  if (isLoading) return null

  if (isOk) {
    return (
      <div>
        <Typography variant="subtitle1" gutterBottom>
          Node Address
        </Typography>
        <EthereumAddress address={nodeAddresses?.ethereum} network={'goerli'} />
      </div>
    )
  }

  return (
    <p>
      Your Bee node must have access to the Ethereum blockchain, so that it can interact and deploy your chequebook
      contract. You can run{' '}
      <a href="https://github.com/goerli/testnet" rel="noreferrer" target="_blank">
        your own Goerli node
      </a>
      , or use a provider such as{' '}
      <a href="https://rpc.slock.it/goerli" rel="noreferrer" target="_blank">
        rpc.slock.it/goerli
      </a>{' '}
      or{' '}
      <a href="https://infura.io/" rel="noreferrer" target="_blank">
        Infura
      </a>
      . By default, Bee expects a local Goerli node at http://localhost:8545. To use a provider instead, simply change
      your <strong>--swap-endpoint</strong> in your configuration file.
    </p>
  )
}
