import DepositModal from '../../../containers/DepositModal'
import type { ReactElement } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItemKey from '../../../components/ExpandableListItemKey'
import ExpandableListItemActions from '../../../components/ExpandableListItemActions'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'

interface Props extends StatusHookCommon {
  chequebookAddress?: string
}

const ChequebookDeployFund = ({ chequebookAddress, isOk }: Props): ReactElement | null => {
  return (
    <ExpandableList label={'Chequebook Deployment & Funding'}>
      <ExpandableListItemNote>
        {isOk ? (
          'Your chequebook is deployed and funded'
        ) : (
          <>
            Your chequebook is either not deployed or funded. To run the node you will need xDAI and xBZZ on the xDai
            network. You may need to aquire BZZ (e.g. <a href="https://bzz.exchange/">bzz.exchange</a>) and bridge it to
            the xDai network through the <a href="https://omni.xdaichain.com/bridge">omni bridge</a>. To pay the
            transaction fees, you will also need xDAI token. You can purchase DAI on the network and bridge it to xDai
            network through the <a href="https://bridge.xdaichain.com/">xDai Bridge</a>. See the{' '}
            <a href="https://www.xdaichain.com/#xdai-stable-chain">official xDai website</a> for more information.
          </>
        )}
      </ExpandableListItemNote>
      {chequebookAddress && (
        <>
          <ExpandableListItemKey label="Chequebook Address" value={chequebookAddress} />
          <ExpandableListItemActions>
            <DepositModal />
          </ExpandableListItemActions>
        </>
      )}
    </ExpandableList>
  )
}

export default ChequebookDeployFund
