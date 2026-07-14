import { Typography } from '@mui/material'
import { ReactElement } from 'react'

import { ROUTES } from '../../routes'

import Balance from './Balance'

export function BankCardTopUpIndex(): ReactElement {
  return (
    <Balance
      header={'Top-up with bank card'}
      title={'Use a bank card to buy xDAI to the funding wallet address below'}
      p={
        <Typography>
          It is recommended to buy an amount equivalent to 10 EUR maximum. If you&apos;re not familiar with
          cryptocurrencies, you may use{' '}
          <a
            href="https://docs.ethswarm.org/docs/desktop/configuration/#upgrading-from-an-ultra-light-to-a-light-node"
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
