import { Typography } from '@material-ui/core/'
import EthereumAddress from '../../../components/EthereumAddress'
import DepositModal from '../../../containers/DepositModal'
import type { ReactElement } from 'react'

interface Props extends StatusHookCommon {
  chequebookAddress?: string
}

const ChequebookDeployFund = ({ chequebookAddress, isOk }: Props): ReactElement | null => {
  return (
    <div>
      <p style={{ marginBottom: '20px', display: 'flex' }}>{chequebookAddress && <DepositModal />}</p>
      <div style={{ marginBottom: '10px' }}>
        {!isOk && (
          <div>
            <span>
              Your chequebook is either not deployed or funded. To run the node you will need xDAI and xBZZ on the xDai
              network. You may need to aquire BZZ through (e.g. <a href="https://bzz.exchange/">bzz.exchange</a>) and
              bridge it to the xDai network through the <a href="https://omni.xdaichain.com/bridge">omni bridge</a>. To
              pay the transaction fees, you will also need xDAI token. You can purchase DAI on the network and bridge it
              to xDai network through the <a href="https://bridge.xdaichain.com/">xDai Bridge</a>. See the{' '}
              <a href="https://www.xdaichain.com/#xdai-stable-chain">official xDai website</a> for more information.
            </span>
          </div>
        )}
      </div>
      <Typography variant="subtitle1" gutterBottom>
        Chequebook Address
      </Typography>
      <EthereumAddress address={chequebookAddress} />
    </div>
  )
}

export default ChequebookDeployFund
