import React from 'react'
import { Typography } from '@material-ui/core/'
import { CheckCircle, Warning } from '@material-ui/icons/'
import EthereumAddress from '../../../components/EthereumAddress'

export default function EthereumConnectionCheck(props: any) {
  return (
    <div>
      <p>Connect to the ethereum blockchain.</p>
      <div style={{ marginBottom: '10px' }}>
        {props.nodeAddresses?.ethereum ? (
          <div>
            <CheckCircle style={{ color: '#32c48d', marginRight: '7px', height: '18px' }} />
            <span>Your connected to the Ethereum network</span>
          </div>
        ) : props.loadingNodeAddresses ? null : (
          <div>
            <Warning style={{ color: '#ff9800', marginRight: '7px', height: '18px' }} />
            <span>Your not connected to the Ethereum network. </span>
            <p>
              Your Bee node must have access to the Ethereum blockchain, so that it can interact and deploy your
              chequebook contract. You can run{' '}
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
              . By default, Bee expects a local Goerli node at http://localhost:8545. To use a provider instead, simply
              change your <strong>--swap-endpoint</strong> in your configuration file.
            </p>
          </div>
        )}
      </div>
      <Typography variant="subtitle1" gutterBottom>
        Node Address
      </Typography>
      <EthereumAddress address={props.nodeAddresses?.ethereum} network={'goerli'} />
    </div>
  )
}
