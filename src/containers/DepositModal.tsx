import type { ReactElement } from 'react'
import { beeDebugApi } from '../services/bee'

import WDModal from '../components/WDModal'
import { BigNumber } from 'bignumber.js'

export default function DepositModal(): ReactElement {
  return (
    <WDModal
      successMessage="Successful deposit."
      errorMessage="Error with depositing"
      dialogMessage="Specify the amount of BZZ you would like to withdraw from your node."
      label="Deposit"
      min={new BigNumber(0)}
      action={beeDebugApi.chequebook.deposit}
    />
  )
}
