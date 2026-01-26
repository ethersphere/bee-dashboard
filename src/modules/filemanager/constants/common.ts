import { FeedIndex, RedundancyLevel } from '@ethersphere/bee-js'
import { capitalizeFirstLetter } from '../utils/common'

export const FEED_INDEX_ZERO = FeedIndex.fromBigInt(BigInt(0))

export const erasureCodeMarks = Object.entries(RedundancyLevel)
  .filter(([_, value]) => typeof value === 'number')
  .map(([key, value]) => ({
    value: value as number,
    label: capitalizeFirstLetter(key),
  }))

export const FILE_MANAGER_EVENTS = {
  FILE_UPLOADED: 'fm:file-uploaded',
  DRIVE_UPGRADE_START: 'fm:drive-upgrade-start',
  DRIVE_UPGRADE_END: 'fm:drive-upgrade-end',
  DRIVE_UPGRADE_TIMEOUT: 'fm:drive-upgrade-timeout',
} as const

export type FileManagerEventName = typeof FILE_MANAGER_EVENTS[keyof typeof FILE_MANAGER_EVENTS]

export const POLLING_TIMEOUT_MS = 90000
export const UPLOAD_POLLING_TIMEOUT_MS = 10000
export const POLLING_INTERVAL_MS = 2000
