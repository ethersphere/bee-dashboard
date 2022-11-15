import { ReactElement, useContext } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemActions from '../../../components/ExpandableListItemActions'
import TroubleshootConnectionCard from '../../../components/TroubleshootConnectionCard'
import StakeModal from '../../../containers/StakeModal'
import { CheckState, Context as BeeContext } from '../../../providers/Bee'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'

export function AccountStaking(): ReactElement {
  const { status, stake } = useContext(BeeContext)

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  return (
    <>
      <Header />
      <AccountNavigation active="STAKING" />
      <div>
        <ExpandableList label="Staking" defaultOpen>
          <ExpandableListItem label="Staked BZZ" value={`${stake?.toSignificantDigits()} xBZZ`} />
          <ExpandableListItemActions>
            <StakeModal />
          </ExpandableListItemActions>
        </ExpandableList>
      </div>
    </>
  )
}
