import { ReactElement, useContext } from 'react'
import { Context as SettingsContext } from '../providers/Settings'

import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { BigNumber } from 'bignumber.js'

export default function DepositModal(): ReactElement {
  const { beeDebugApi } = useContext(SettingsContext)

  return (
    <WithdrawDepositModal
      successMessage="Successful deposit."
      errorMessage="Error with depositing"
      dialogMessage="Specify the amount of BZZ you would like to withdraw from your node."
      label="Deposit"
      min={new BigNumber(0)}
      action={(amount: bigint) => {
        if (!beeDebugApi) throw new Error('Bee Debug URL is not valid')

        return beeDebugApi.depositTokens(amount.toString())
      }}
    />
  )
}
