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
          Your chequebook is deployed. You may deposit some xBZZ to your chequebook to afford more traffic. xBZZ can be
          purchased from a variety of centralized and decentralized exchanges listed on the official{' '}
          <a href="https://ethswarm.org">Ethswarm.org</a> website. To pay the transaction fees, you will also need xDAI
          token. You can purchase xDAI from{' '}
          <a href="https://docs.gnosischain.com/about/tokens/xdai">various exchanges</a> listed in the Gnosis Chain
          documentation. See the <a href="https://www.gnosis.io/chain">official Gnosis Chain website</a> for more
          information.
        </>
      )
      break
    default:
      text = (
        <>
          Your chequebook is either not deployed nor funded. To run the node you will need xDAI and xBZZ on the Gnosis
          chain network. You may need to aquire xBZZ that can be purchased from a variety of centralized and
          decentralized exchanges listed on the official <a href="https://ethswarm.org">Ethswarm.org</a> website. To pay
          the transaction fees, you will also need xDAI token. You can purchase xDAI from{' '}
          <a href="https://docs.gnosischain.com/about/tokens/xdai">various exchanges</a> listed in the Gnosis Chain
          documentation. See the <a href="https://www.gnosis.io/chain">official Gnosis Chain website</a> for more
          information.
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
