import { BigNumber } from 'bignumber.js'
import { ReactElement, useContext } from 'react'
import Upload from 'remixicon-react/UploadLineIcon'
import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'

export default function WithdrawModal(): ReactElement {
  const { beeApi } = useContext(SettingsContext)
  const { refresh } = useContext(BeeContext)

  return (
    <WithdrawDepositModal
      successMessage="Successful withdrawal."
      errorMessage="Error with withdrawing."
      dialogMessage="Specify the amount of xBZZ you would like to withdraw from your node."
      label="Withdraw"
      icon={<Upload size="1rem" />}
      min={new BigNumber(0)}
      action={async (amount: bigint) => {
        if (!beeApi) {
          throw new Error('Bee URL is not valid')
        }

        const transactionHash = await beeApi.withdrawTokens(amount.toString())
        refresh()

        return transactionHash
      }}
    />
  )
}
