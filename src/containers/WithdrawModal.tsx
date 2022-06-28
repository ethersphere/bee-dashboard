import { BigNumber } from 'bignumber.js'
import { ReactElement, useContext } from 'react'
import Upload from 'remixicon-react/UploadLineIcon'
import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { Context as SettingsContext } from '../providers/Settings'

export default function WithdrawModal(): ReactElement {
  const { beeDebugApi } = useContext(SettingsContext)

  return (
    <WithdrawDepositModal
      successMessage="Successful withdrawal."
      errorMessage="Error with withdrawing."
      dialogMessage="Specify the amount of xBZZ you would like to withdraw from your node."
      label="Withdraw"
      icon={<Upload size="1rem" />}
      min={new BigNumber(0)}
      action={(amount: bigint) => {
        if (!beeDebugApi) throw new Error('Bee Debug URL is not valid')

        return beeDebugApi.withdrawTokens(amount.toString())
      }}
    />
  )
}
