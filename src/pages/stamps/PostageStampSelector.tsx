import React, { ReactElement, useContext } from 'react'
import { SwarmSelect } from '../../components/SwarmSelect'
import { Context, EnrichedPostageBatch } from '../../providers/Stamps'

interface Props {
  onSelect: (stamp: EnrichedPostageBatch) => void
}

export function PostageStampSelector({ onSelect }: Props): ReactElement {
  const { stamps } = useContext(Context)

  function onChange(stampId: string) {
    if (!stamps) {
      return
    }
    const stamp = stamps.find(x => x.batchID === stampId)

    if (stamp) {
      onSelect(stamp)
    }
  }

  return (
    <SwarmSelect
      options={(stamps || []).map(x => ({ label: x.batchID, value: x.batchID }))}
      onChange={event => onChange(event.target.value as string)}
    />
  )
}
