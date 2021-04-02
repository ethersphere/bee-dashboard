import { Typography } from '@material-ui/core/'
import { CheckCircle, Warning } from '@material-ui/icons/'
import EthereumAddress from '../../../components/EthereumAddress'
import DepositModal from '../../../components/DepositModal'
import CodeBlockTabs from '../../../components/CodeBlockTabs'
import type { ChequebookAddressResponse, ChequebookBalanceResponse } from '@ethersphere/bee-js'
import type { ReactElement } from 'react'

interface Props {
  chequebookAddress: ChequebookAddressResponse | null
  chequebookBalance: ChequebookBalanceResponse | null
  isLoadingChequebookAddress: boolean
  isLoadingChequebookBalance: boolean
}

const ChequebookDeployFund = (props: Props): ReactElement => (
  <div>
    <p style={{ marginBottom: '20px', display: 'flex' }}>
      <span style={{ marginRight: '40px' }}>Deploy chequebook and fund with BZZ</span>
      {props.chequebookAddress?.chequebookaddress ? <DepositModal /> : null}
    </p>
    <div style={{ marginBottom: '10px' }}>
      {
        // FIXME: this should be broken up
        /* eslint-disable no-nested-ternary */
        props.chequebookAddress?.chequebookaddress &&
        props.chequebookBalance &&
        props.chequebookBalance?.totalBalance > 0 ? (
          <div>
            <CheckCircle style={{ color: '#32c48d', marginRight: '7px', height: '18px' }} />
            <span>Your chequebook is deployed and funded!</span>
          </div>
        ) : props.isLoadingChequebookAddress || props.isLoadingChequebookBalance ? null : (
          <div>
            <Warning style={{ color: '#ff9800', marginRight: '7px', height: '18px' }} />
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
        )
        /* eslint-enable no-nested-ternary */
      }
    </div>
    <Typography variant="subtitle1" gutterBottom>
      Chequebook Address
    </Typography>
    <EthereumAddress address={props.chequebookAddress?.chequebookaddress} network={'goerli'} />
  </div>
)

export default ChequebookDeployFund
