import { Typography } from '@mui/material'
import { ReactElement } from 'react'

import { ROUTES } from '../../routes'

import Balance from './Balance'

export function CryptoTopUpIndex(): ReactElement {
  return (
    <Balance
      header={'Top-up with cryptocurrencies'}
      title={'Send xDAI to the funding wallet below'}
      p={
        <Typography>
          For security reasons it is recommended to send maximum 5 to 10 xDAI. To get xDAI from DAI you may use{' '}
          <a href="https://bridge.gnosischain.com" rel="noreferrer" target="_blank">
            https://bridge.gnosischain.com
          </a>
          .
        </Typography>
      }
      next={ROUTES.TOP_UP_CRYPTO_SWAP}
    />
  )
}
