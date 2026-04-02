import { BatchId, Bee, PostageBatch } from '@ethersphere/bee-js'
import BigNumber from 'bignumber.js'

import { MAX_STAMP_DEPTH, MIN_STAMP_DEPTH } from '../constants'

import { sleepMs } from '.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateDepthInput(depthInput: string, onError: (v: any) => void, onSuccess: (v: any) => void) {
  let validDepthInput = '0'

  if (!depthInput) {
    onError('Required field')
  } else {
    const depth = new BigNumber(depthInput)

    if (!depth.isInteger()) {
      onError('Depth must be an integer')
    } else if (depth.isLessThan(MIN_STAMP_DEPTH)) {
      onError(`Minimal depth is ${MIN_STAMP_DEPTH}`)
    } else if (depth.isGreaterThan(MAX_STAMP_DEPTH)) {
      onError(`Depth has to be at most ${MAX_STAMP_DEPTH}`)
    } else {
      onError('')
      validDepthInput = depthInput
    }
  }

  onSuccess(validDepthInput)
}

const DEFAULT_POLLING_FREQUENCY = 1_000
const DEFAULT_STAMP_USABLE_TIMEOUT = 5 * 60_000

interface Options {
  pollingFrequency?: number
  timeout?: number
}

export function waitUntilStampUsable(batchId: BatchId | string, bee: Bee, options?: Options): Promise<PostageBatch> {
  return waitForStamp(batchId, bee, options)
}

async function waitForStamp(batchId: BatchId | string, bee: Bee, options?: Options): Promise<PostageBatch> {
  const timeout = options?.timeout || DEFAULT_STAMP_USABLE_TIMEOUT
  const pollingFrequency = options?.pollingFrequency || DEFAULT_POLLING_FREQUENCY

  for (let i = 0; i < timeout; i += pollingFrequency) {
    try {
      const stamp = await bee.getPostageBatch(batchId)

      if (stamp.usable) {
        return stamp
      }
    } catch {
      // ignore
    }

    await sleepMs(pollingFrequency)
  }

  throw new Error('Wait until stamp usable timeout has been reached')
}
