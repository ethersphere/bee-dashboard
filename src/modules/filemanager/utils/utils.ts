import { Bee, PostageBatch } from '@ethersphere/bee-js'

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
