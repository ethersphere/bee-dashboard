import { ReactElement, useContext, useState } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemActions from '../../../components/ExpandableListItemActions'
import { Loading } from '../../../components/Loading'
import TroubleshootConnectionCard from '../../../components/TroubleshootConnectionCard'
import StakeModal from '../../../containers/StakeModal'
import { Context as BeeContext, CheckState } from '../../../providers/Bee'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'

export function AccountStaking(): ReactElement {
  const [loading, setLoading] = useState(false)

  const { status, stake, walletBalance } = useContext(BeeContext)

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  function onStarted() {
    setLoading(true)
  }

  function onFinished() {
    setLoading(false)
  }

  return (
    <>
      <Header />
      <AccountNavigation active="STAKING" />
      <div>
        {loading || !stake ? (
          <Loading />
        ) : (
          <ExpandableList label="Staking" defaultOpen>
            <ExpandableListItem label="Staked BZZ" value={`${stake?.toSignificantDigits(4)} xBZZ`} />
            {walletBalance?.bzzBalance ? (
              <ExpandableListItem
                label="Available xBZZ balance"
                value={`${walletBalance.bzzBalance.toSignificantDigits(4)} xBZZ`}
              />
            ) : null}
            <ExpandableListItemActions>
              <StakeModal onStarted={onStarted} onFinished={onFinished} />
            </ExpandableListItemActions>
          </ExpandableList>
        )}
      </div>
    </>
  )
}
