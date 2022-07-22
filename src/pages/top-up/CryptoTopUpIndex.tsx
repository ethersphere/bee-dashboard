import { Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import Balance from './Balance'
import { ROUTES } from '../../routes'

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
