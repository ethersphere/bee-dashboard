import { RedistributionState, BZZ, DAI } from '@ethersphere/bee-js'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../providers/Settings'
import ExpandableListItem from './ExpandableListItem'

export function Redistribution() {
  const { beeApi } = useContext(Context)
  const [redistributionState, setRedistributionState] = useState<RedistributionState | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!beeApi) {
        return
      }

      beeApi.getRedistributionState().then(setRedistributionState).catch(console.error) // eslint-disable-line
    }, 3_000)

    return () => clearInterval(interval)
  })

  const formatDurationSeconds = (s?: number) => {
    if (s === null || s === undefined) {
      return '-'
    } else {
      return `${s} s`
    }
  }

  const formatBzzAmount = (amount?: BZZ) => {
    if (amount === null || amount === undefined) {
      return '-'
    } else {
      return `${amount.toSignificantDigits(4)} xBZZ`
    }
  }

  const formatDaiAmount = (amount?: DAI) => {
    if (amount === null || amount === undefined) {
      return '-'
    } else {
      return `${amount.toSignificantDigits(4)} xDAI`
    }
  }

  return (
    <>
      <ExpandableListItem
        label="Has sufficient funds"
        value={redistributionState?.hasSufficientFunds?.toString() ?? '-'}
      />
      <ExpandableListItem label="Fully synced" value={redistributionState?.isFullySynced?.toString() ?? '-'} />
      <ExpandableListItem label="Frozen" value={redistributionState?.isFrozen?.toString() ?? '-'} />
      <ExpandableListItem label="Phase" value={redistributionState?.phase ?? '-'} />
      <ExpandableListItem label="Round" value={redistributionState?.round?.toString() ?? '-'} />
      <ExpandableListItem
        label="Last selected round"
        value={redistributionState?.lastSelectedRound.toString() ?? '-'}
      />
      <ExpandableListItem label="Last played round" value={redistributionState?.lastPlayedRound.toString() ?? '-'} />
      <ExpandableListItem label="Last round won" value={redistributionState?.lastWonRound.toString() ?? '-'} />
      <ExpandableListItem label="Last frozen round" value={redistributionState?.lastFrozenRound.toString() ?? '-'} />
      <ExpandableListItem
        label="Last sample duration"
        value={formatDurationSeconds(redistributionState?.lastSampleDurationSeconds)}
      />
      <ExpandableListItem label="Reward" value={formatBzzAmount(redistributionState?.reward)} />
      <ExpandableListItem label="Fees" value={formatDaiAmount(redistributionState?.fees)} />
    </>
  )
}
