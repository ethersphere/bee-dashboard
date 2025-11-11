import type { ReactElement, ReactNode } from 'react'
import { useContext } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItemActions from '../../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../../components/ExpandableListItemKey'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
import StatusIcon from '../../../components/StatusIcon'
import DepositModal from '../../../containers/DepositModal'
import { CheckState, Context } from '../../../providers/Bee'

const ChequebookDeployFund = (): ReactElement | null => {
  const { status, isLoading, chequebookAddress } = useContext(Context)
  const { checkState, isEnabled } = status.chequebook

  if (!isEnabled) {
    return null
  }

  let text: ReactNode

  switch (checkState) {
    case CheckState.OK:
      text = (
        <>
          Your chequebook is deployed. You may deposit some xBZZ to your chequebook to afford more traffic. You can
          acquire BZZ (e.g. <a href="https://bzz.exchange/">bzz.exchange</a>) and bridge it to the Gnosis Chain network
          through the <a href="https://omni.gnosischain.com/bridge">omni bridge</a>. To pay the transaction fees, you
          will also need xDAI token. You can purchase DAI on the Ethereum mainnet network and bridge it to Gnosis Chain
          network through the <a href="https://bridge.gnosischain.com">xDai Bridge</a>. See the{' '}
          <a href="https://www.gnosischain.com">official Gnosis Chain website</a> for more information.
        </>
      )
      break
    default:
      text = (
        <>
          Your chequebook is either not deployed nor funded. To run the node you will need xDAI and xBZZ on the Gnosis
          chain network. You may need to aquire BZZ (e.g. <a href="https://bzz.exchange/">bzz.exchange</a>) and bridge
          it to the Gnosis Chain network through the <a href="https://omni.gnosischain.com/bridge">omni bridge</a>. To
          pay the transaction fees, you will also need xDAI token. You can purchase DAI on the Ethereum mainnet network
          and bridge it to Gnosis Chain network through the <a href="https://bridge.gnosischain.com">xDai Bridge</a>.
          See the <a href="https://www.gnosischain.com">official Gnosis Chain website</a> for more information.
        </>
      )
  }

  return (
    <ExpandableList
      label={
        <>
          <StatusIcon checkState={checkState} isLoading={isLoading} /> Chequebook Deployment & Funding
        </>
      }
    >
      <ExpandableListItemNote>{text}</ExpandableListItemNote>
      {chequebookAddress && (
        <>
          <ExpandableListItemKey label="Chequebook Address" value={chequebookAddress.chequebookAddress.toString()} />
          <ExpandableListItemActions>
            <DepositModal />
          </ExpandableListItemActions>
        </>
      )}
    </ExpandableList>
  )
}

export default ChequebookDeployFund
