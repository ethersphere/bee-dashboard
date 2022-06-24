import { Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import Index from '.'
import { ROUTES } from '../../routes'

export function BankCardTopUpIndex(): ReactElement {
  return (
    <Index
      header={'Top-up with bank card'}
      title={'Use a bank card to buy xDAI to the funding wallet address below'}
      p={
        <Typography>
          It is recommended to buy an amount equivalent to 10 EUR maximum. If you&apos;re not familiar with
          cryptocurrencies, you may use{' '}
          <a
            href="https://medium.com/ethereum-swarm/upgrading-swarm-deskotp-app-beta-from-an-ultra-light-to-a-light-node-65d52cab7f2c"
            rel="noreferrer"
            target="_blank"
          >
            this guide
          </a>
          .
        </Typography>
      }
      next={ROUTES.TOP_UP_BANK_CARD_SWAP}
    />
  )
}
