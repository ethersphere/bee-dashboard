import { ReactElement, useContext, useState } from 'react'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemActions from '../../../components/ExpandableListItemActions'
import { Loading } from '../../../components/Loading'
import TroubleshootConnectionCard from '../../../components/TroubleshootConnectionCard'
import StakeModal from '../../../containers/StakeModal'
import { CheckState, Context as BeeContext } from '../../../providers/Bee'
import { Context as BalanceContext } from '../../../providers/WalletBalance'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'

export function AccountStaking(): ReactElement {
  const [loading, setLoading] = useState(false)

  const { status, stake } = useContext(BeeContext)
  const { balance } = useContext(BalanceContext)

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
        {loading || stake?.toDecimal === undefined ? (
          <Loading />
        ) : (
          <ExpandableList label="Staking" defaultOpen>
            <ExpandableListItem label="Staked BZZ" value={`${stake?.toSignificantDigits()} xBZZ`} />
            {balance?.bzz ? (
              <ExpandableListItem
                label="Available xBZZ balance"
                value={`${balance?.bzz.toSignificantDigits(4)} xBZZ`}
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
