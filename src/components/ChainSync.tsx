import { ChainState } from '@ethersphere/bee-js'
import { useContext, useEffect, useState } from 'react'

import { Context } from '../providers/Settings'

import ExpandableListItem from './ExpandableListItem'

const CHAIN_STATE_INTERVAL_MS = 3_000

export function ChainSync() {
  const { beeApi } = useContext(Context)
  const [chainState, setChainState] = useState<ChainState | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!beeApi) {
        return
      }

      // eslint-disable-next-line no-console
      beeApi.getChainState().then(setChainState).catch(console.error)
    }, CHAIN_STATE_INTERVAL_MS)

    return () => clearInterval(interval)
  })

  return (
    <ExpandableListItem label="Chain state" value={chainState ? `${chainState.block} / ${chainState.chainTip}` : '-'} />
  )
}
