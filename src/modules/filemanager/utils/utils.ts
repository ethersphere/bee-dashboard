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
