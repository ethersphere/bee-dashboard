import { ReactElement, useEffect, useState } from 'react'
import { getPrettyDateString } from '../utils/date'
import { getHistorySafe, HistoryItem, HISTORY_KEYS } from '../utils/local-storage'
import ExpandableList from './ExpandableList'
import ExpandableListItemLink from './ExpandableListItemLink'

interface Props {
  title: string
  localStorageKey: HISTORY_KEYS
}

export function History({ title, localStorageKey }: Props): ReactElement | null {
  const [items, setItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    setItems(getHistorySafe(localStorageKey))
  }, [localStorageKey])

  if (!items.length) {
    return null
  }

  return (
    <ExpandableList label={title} defaultOpen>
      {items.map((x, i) => (
        <ExpandableListItemLink
          label={getPrettyDateString(new Date(x.createdAt))}
          value={x.name}
          link={'/files/hash/' + x.hash}
          key={i}
          navigationType="HISTORY_PUSH"
        />
      ))}
    </ExpandableList>
  )
}
