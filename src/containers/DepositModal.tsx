import { BZZ } from '@ethersphere/bee-js'
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
      dialogMessage="Amount of xBZZ to deposit to the checkbook, from your node."
      label="Deposit"
      icon={<Download size="1rem" />}
      min={BZZ.fromPLUR('1')}
      action={async (amount: BZZ) => {
        if (!beeApi) {
          throw new Error('Bee URL is not valid')
        }

        const transactionHash = await beeApi.depositBZZToChequebook(amount)
        refresh()

        return transactionHash
      }}
    />
  )
}
