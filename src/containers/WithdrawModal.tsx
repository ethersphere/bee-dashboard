import type { ReactElement } from 'react'
import { beeDebugApi } from '../services/bee'

import WDModal from '../components/WDModal'
import { BigNumber } from 'bignumber.js'

export default function WithdrawModal(): ReactElement {
  return (
    <WDModal
      successMessage="Successful withdrawl."
      errorMessage="Error with withdrawing."
      dialogMessage="Specify the amount of BZZ you would like to withdraw from your node."
      label="Withdraw"
      min={new BigNumber(0)}
      action={beeDebugApi.chequebook.withdraw}
    />
  )
}
