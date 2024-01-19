import { BigNumber } from 'bignumber.js'
import { ReactElement, useContext } from 'react'
import Upload from 'remixicon-react/UploadLineIcon'
import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'

export default function WithdrawModal(): ReactElement {
  const { beeDebugApi } = useContext(SettingsContext)
  const { refresh } = useContext(BeeContext)

  return (
    <WithdrawDepositModal
      successMessage="Successful withdrawal."
      errorMessage="Error with withdrawing."
      dialogMessage="Amount of xBZZ to withdraw from the checkbook to your node."
      label="Withdraw"
      icon={<Upload size="1rem" />}
      min={new BigNumber(0)}
      action={async (amount: bigint) => {
        if (!beeDebugApi) throw new Error('Bee Debug URL is not valid')

        const transactionHash = await beeDebugApi.withdrawTokens(amount.toString())
        refresh()

        return transactionHash
      }}
    />
  )
}
