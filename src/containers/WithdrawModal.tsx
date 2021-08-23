import { ReactElement, useContext } from 'react'
import { Context as SettingsContext } from '../providers/Settings'

import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { BigNumber } from 'bignumber.js'

export default function WithdrawModal(): ReactElement {
  const { beeDebugApi } = useContext(SettingsContext)

  return (
    <WithdrawDepositModal
      successMessage="Successful withdrawl."
      errorMessage="Error with withdrawing."
      dialogMessage="Specify the amount of BZZ you would like to withdraw from your node."
      label="Withdraw"
      min={new BigNumber(0)}
      action={(amount: bigint) => {
        if (!beeDebugApi) throw new Error('Bee Debug URL is not valid')

        return beeDebugApi.withdrawTokens(amount.toString())
      }}
    />
  )
}
