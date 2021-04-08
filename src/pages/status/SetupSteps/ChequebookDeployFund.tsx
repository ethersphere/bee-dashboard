import { Typography } from '@material-ui/core/'
import EthereumAddress from '../../../components/EthereumAddress'
import DepositModal from '../../../components/DepositModal'
import CodeBlockTabs from '../../../components/CodeBlockTabs'
import type { ReactElement } from 'react'

type Props = StatusChequebookHook

const ChequebookDeployFund = ({ isLoading, chequebookAddress, chequebookBalance }: Props): ReactElement | null => {
  if (isLoading) return null

  return (
    <div>
      <p style={{ marginBottom: '20px', display: 'flex' }}>
        {chequebookAddress?.chequebookaddress && <DepositModal />}
      </p>
      <div style={{ marginBottom: '10px' }}>
        {!(chequebookAddress?.chequebookaddress && chequebookBalance && chequebookBalance?.totalBalance > 0) && (
          <div>
            <span>
              Your chequebook is either not deployed or funded. Run the below commands to get your address and deposit
              ETH. Then visit the BZZaar here{' '}
              <Typography variant="button">
                https://bzz.ethswarm.org/?transaction=buy&amount=10&slippage=30&receiver=[ENTER_ADDRESS_HERE]
              </Typography>{' '}
              to get BZZ
            </span>
            <CodeBlockTabs showLineNumbers linux={`bee-get-addr`} mac={`bee-get-addr`} />
          </div>
        )}
      </div>
      <Typography variant="subtitle1" gutterBottom>
        Chequebook Address
      </Typography>
      <EthereumAddress address={chequebookAddress?.chequebookaddress} network={'goerli'} />
    </div>
  )
}

export default ChequebookDeployFund
