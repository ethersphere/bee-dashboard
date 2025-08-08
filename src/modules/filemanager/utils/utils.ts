import { Bee, Duration, PostageBatch, RedundancyLevel, Size } from '@ethersphere/bee-js'

import { MouseEvent } from 'react'
export function preventDefault(event: MouseEvent) {
  event.preventDefault()
}

export function getDaysLeft(expiryDate: string): number {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffMs = expiry.getTime() - now.getTime()

  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

export const getUsableStamps = async (bee: Bee | null): Promise<PostageBatch[]> => {
  if (!bee) {
    return []
  }

  try {
    return (await bee.getPostageBatches())
      .filter(s => s.usable)
      .sort((a, b) => (a.label || '').localeCompare(b.label || ''))
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error getting usable stamps: ', error)

    return []
  }
}

export const fromBytesConversion = (size: number, metric: string) => {
  switch (metric) {
    case 'GB':
      return size / 1000 / 1000 / 1000
    case 'MB':
      return size / 1000 / 1000
    default:
      return 0
  }
}

const lifetimeAdjustments = new Map<number, (date: Date) => void>([
  [1, date => date.setDate(date.getDate() + 7)],
  [2, date => date.setMonth(date.getMonth() + 1)],
  [3, date => date.setMonth(date.getMonth() + 3)],
  [4, date => date.setMonth(date.getMonth() + 6)],
  [5, date => date.setFullYear(date.getFullYear() + 1)],
])

export function getExpiryDateByLifetime(lifetimeValue: number): Date {
  const now = new Date()

  const adjustDate = lifetimeAdjustments.get(lifetimeValue)

  if (adjustDate) {
    adjustDate(now)
  }

  return now
}

export const fmGetStorageCost = async (
  capacity: number,
  validityEndDate: Date,
  encryption: boolean,
  erasureCodeLevel: RedundancyLevel,
  beeApi: Bee | null,
): Promise<string> => {
  try {
    if (Size.fromBytes(capacity).toGigabytes() >= 0 && validityEndDate.getTime() >= new Date().getTime()) {
      const cost = await beeApi?.getStorageCost(
        Size.fromBytes(capacity),
        Duration.fromEndDate(validityEndDate),
        undefined,
        encryption,
        erasureCodeLevel,
      )

      return cost ? cost.toSignificantDigits(2) : '0'
    }

    return '0'
  } catch (e) {
    //TODO It needs to be discussed what happens to the error
    return '0'
  }
}

export const fmFetchCost = async (
  capacity: number,
  validityEndDate: Date,
  encryption: boolean,
  erasureCodeLevel: RedundancyLevel,
  beeApi: Bee | null,
  setCost: (cost: string) => void,
  currentFetch: React.MutableRefObject<Promise<void> | null>,
) => {
  if (currentFetch.current) {
    await currentFetch.current
  }
  const fetchPromise = (async () => {
    const cost = await fmGetStorageCost(capacity, validityEndDate, false, erasureCodeLevel, beeApi)
    setCost(cost)
  })()

  currentFetch.current = fetchPromise
  await fetchPromise
  currentFetch.current = null
}
