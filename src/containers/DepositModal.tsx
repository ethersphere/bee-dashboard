import { BigNumber } from 'bignumber.js'
import { ReactElement, useContext } from 'react'
import Download from 'remixicon-react/DownloadLineIcon'
import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'

export default function DepositModal(): ReactElement {
  const { beeApi } = useContext(SettingsContext)
  const { refresh } = useContext(BeeContext)

  return (
    <WithdrawDepositModal
      successMessage="Successful deposit."
      errorMessage="Error with depositing"
      dialogMessage="Specify the amount of xBZZ you would like to deposit to your node."
      label="Deposit"
      icon={<Download size="1rem" />}
      min={new BigNumber(0)}
      action={async (amount: bigint) => {
        if (!beeApi) {
          throw new Error('Bee URL is not valid')
        }

        const transactionHash = await beeApi.depositTokens(amount.toString())
        refresh()

        return transactionHash
      }}
    />
  )
}
