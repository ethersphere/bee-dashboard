import { BZZ } from '@ethersphere/bee-js'
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
      dialogMessage="Amount of xBZZ to withdraw from the checkbook to your node."
      label="Withdraw"
      icon={<Upload size="1rem" />}
      min={BZZ.fromPLUR('1')}
      action={async (amount: BZZ) => {
        if (!beeApi) {
          throw new Error('Bee URL is not valid')
        }

        const transactionHash = await beeApi.withdrawTokens(amount)
        refresh()

        return transactionHash
      }}
    />
  )
}
