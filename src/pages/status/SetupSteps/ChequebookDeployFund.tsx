import { Typography } from '@material-ui/core/'
import EthereumAddress from '../../../components/EthereumAddress'
import DepositModal from '../../../containers/DepositModal'
import type { ReactElement } from 'react'
import type { StatusChequebookHook } from '../../../hooks/status'

interface Props extends StatusChequebookHook {
  ethereumAddress?: string
}

const ChequebookDeployFund = ({
  isLoading,
  chequebookAddress,
  chequebookBalance,
  ethereumAddress,
}: Props): ReactElement | null => {
  if (isLoading) return null

  return (
    <div>
      <p style={{ marginBottom: '20px', display: 'flex' }}>
        {chequebookAddress?.chequebookAddress && <DepositModal />}
      </p>
      <div style={{ marginBottom: '10px' }}>
        {!(chequebookAddress?.chequebookAddress && chequebookBalance?.totalBalance.toBigNumber.isGreaterThan(0)) && (
          <div>
            <span>
              Your chequebook is either not deployed or funded. Join{' '}
              <a href="https://discord.gg/ykCupZMuww">our discord channel</a>, get verified and send a message{' '}
              <pre>sprinkle {ethereumAddress || '<YOUR BEE NODE ETH ADDRESS>'}</pre> in the <pre>#faucet-request</pre>{' '}
              channel to get Goerli ETH and Goerli BZZ token.
            </span>
          </div>
        )}
      </div>
      <Typography variant="subtitle1" gutterBottom>
        Chequebook Address
      </Typography>
      <EthereumAddress address={chequebookAddress?.chequebookAddress} network={'goerli'} />
    </div>
  )
}

export default ChequebookDeployFund
