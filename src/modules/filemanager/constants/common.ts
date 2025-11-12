import { FeedIndex, RedundancyLevel } from '@ethersphere/bee-js'
import { capitalizeFirstLetter } from '../utils/common'

export const FEED_INDEX_ZERO = FeedIndex.fromBigInt(BigInt(0))

export const erasureCodeMarks = Object.entries(RedundancyLevel)
  .filter(([_, value]) => typeof value === 'number')
  .map(([key, value]) => ({
    value: value as number,
    label: capitalizeFirstLetter(key),
  }))
