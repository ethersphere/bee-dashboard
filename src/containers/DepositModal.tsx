import { BigNumber } from 'bignumber.js'
import { ReactElement, useContext } from 'react'
import Download from 'remixicon-react/DownloadLineIcon'
import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'

export default function DepositModal(): ReactElement {
  const { beeDebugApi } = useContext(SettingsContext)
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
        if (!beeDebugApi) throw new Error('Bee Debug URL is not valid')

        const transactionHash = await beeDebugApi.depositTokens(amount.toString()).catch((error: Error) => {
          throw error
        })
        refresh()

        return transactionHash
      }}
    />
  )
}
