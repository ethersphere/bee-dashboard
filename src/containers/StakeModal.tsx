import { BZZ } from '@ethersphere/bee-js'
import { ReactElement, useContext } from 'react'
import Download from 'remixicon-react/DownloadLineIcon'
import WithdrawDepositModal from '../components/WithdrawDepositModal'
import { Context as BeeContext } from '../providers/Bee'
import { Context as SettingsContext } from '../providers/Settings'

interface Props {
  onStarted: () => void
  onFinished: () => void
}

export default function StakeModal({ onStarted, onFinished }: Props): ReactElement {
  const { beeApi } = useContext(SettingsContext)
  const { refresh } = useContext(BeeContext)

  return (
    <WithdrawDepositModal
      successMessage="Successfully deposited stake."
      errorMessage="Error with depositing"
      dialogMessage="Specify the amount of xBZZ you would like to stake. Your first stake must be at least 10 xBZZ. This will lock your tokens."
      label="Stake"
      icon={<Download size="1rem" />}
      min={BZZ.fromPLUR('1')}
      action={async (amount: BZZ) => {
        if (!beeApi) {
          throw new Error('Bee URL is not valid')
        }

        onStarted()

        try {
          const transactionHash = await beeApi.depositStake(amount)

          return transactionHash
        } finally {
          refresh()
          onFinished()
        }
      }}
    />
  )
}
