import { BigNumber } from 'bignumber.js'
import { ReactElement, useContext } from 'react'
import Download from 'remixicon-react/DownloadLineIcon'
import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'

export default function StakeModal(): ReactElement {
  const { beeDebugApi } = useContext(SettingsContext)
  const { refresh } = useContext(BeeContext)

  return (
    <WithdrawDepositModal
      successMessage="Successfully deposited stake."
      errorMessage="Error with depositing"
      dialogMessage="Specify the amount of xBZZ you would like to stake. Warning: This will lock your tokens."
      label="Stake"
      icon={<Download size="1rem" />}
      min={new BigNumber(0)}
      action={async (amount: bigint) => {
        if (!beeDebugApi) throw new Error('Bee Debug URL is not valid')

        await beeDebugApi.depositStake(amount.toString())
        refresh()

        return 'unknown'
      }}
    />
  )
}
