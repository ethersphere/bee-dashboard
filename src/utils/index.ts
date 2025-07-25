import { BatchId, Bee, PostageBatch, Reference } from '@ethersphere/bee-js'
import { BigNumber } from 'bignumber.js'
import { BZZ_LINK_DOMAIN } from '../constants'

/**
 * Test if value is an integer
 *
 * @param value Value to be tested if it is an integer
 *
 * @returns True if the passed in value is integer
 */
export function isInteger(value: unknown): value is BigNumber | bigint {
  return (BigNumber.isBigNumber(value) && value.isInteger()) || typeof value === 'bigint'
}

/**
 *Convert value into a BigNumber if not already
 *
 * @param value Value to be converted
 *
 * @throws {TypeError} if the value is not convertible to a BigNumber
 *
 * @returns BigNumber - but it may still be NaN or Infinite
 */
export function makeBigNumber(value: BigNumber | bigint | number | string): BigNumber | never {
  if (BigNumber.isBigNumber(value)) return value

  if (typeof value === 'string') return new BigNumber(value)

  if (typeof value === 'bigint') return new BigNumber(value.toString())

  if (typeof value === 'number') return new BigNumber(value)

  throw new TypeError(`Not a BigNumber or BigNumber convertible value. Type: ${typeof value} value: ${value}`)
}

export type PromiseSettlements<T> = {
  fulfilled: PromiseFulfilledResult<T>[]
  rejected: PromiseRejectedResult[]
}

export type UnwrappedPromiseSettlements<T> = {
  fulfilled: T[]
  rejected: string[]
}

export async function sleepMs(ms: number): Promise<void> {
  await new Promise<void>(resolve =>
    setTimeout(() => {
      resolve()
    }, ms),
  )
}

/**
 * Maps the returned results of `Promise.allSettled` to an object
 * with `fulfilled` and `rejected` arrays for easy access.
 *
 * The results still need to be unwrapped to get the fulfilled values or rejection reasons.
 */
export function mapPromiseSettlements<T>(promises: PromiseSettledResult<T>[]): PromiseSettlements<T> {
  const fulfilled = promises.filter(promise => promise.status === 'fulfilled') as PromiseFulfilledResult<T>[]
  const rejected = promises.filter(promise => promise.status === 'rejected') as PromiseRejectedResult[]

  return { fulfilled, rejected }
}

/**
 * Maps the returned values of `Promise.allSettled` to an object
 * with `fulfilled` and `rejected` arrays for easy access.
 *
 * For rejected promises, the value is the stringified `reason`,
 * or `'Unknown error'` string when it is unavailable.
 */
export function unwrapPromiseSettlements<T>(
  promiseSettledResults: PromiseSettledResult<T>[],
): UnwrappedPromiseSettlements<T> {
  const values = mapPromiseSettlements(promiseSettledResults)
  const fulfilled = values.fulfilled.map(x => x.value)
  const rejected = values.rejected.map(x => (x.reason ? String(x.reason) : 'Unknown error'))

  return { fulfilled, rejected }
}

/**
 * Wraps a `Promise<T>` or async function inside a new `Promise<T>`,
 * which retries the original function up to `maxRetries` times,
 * waiting `delayMs` milliseconds between failed attempts.
 *
 * If all attempts fail, then this `Promise<T>` also rejects.
 */
export function makeRetriablePromise<T>(fn: () => Promise<T>, maxRetries = 3, delayMs = 1000): Promise<T> {
  return new Promise(async (resolve, reject) => {
    for (let tries = 0; tries < maxRetries; tries++) {
      try {
        const results = await fn()
        resolve(results)

        return
      } catch (error) {
        if (tries < maxRetries - 1) {
          await sleepMs(delayMs)
        } else {
          reject(error)
        }
      }
    }
  })
}

// Matches exactly 64 or 128 caracters alphanumeric characters that are surrounded by non-alpha num characters
const regexpMatchHash = /(?:^|[^a-f0-9]+)([a-f0-9]{64}|[a-f0-9]{128})(?:$|[^a-f0-9]+)/i

export function extractSwarmHash(string: string): string | undefined {
  const matches = string.match(regexpMatchHash)

  return (matches && matches[1]) || undefined
}

// Matches the CID from bzz-link subdomain
const regexpMatchCID = new RegExp(`https://(bah5acgza[a-z0-9]{52})\\.${BZZ_LINK_DOMAIN}`, 'i')

export function extractSwarmCid(s: string): string | undefined {
  const matches = s.match(regexpMatchCID)

  if (!matches || !matches[1]) {
    return
  }

  const cid = matches[1]
  try {
    return new Reference(cid).toHex()
  } catch (e) {
    return
  }
}

// Matches any number of subdomain with .eth
// e.g. this.is.just-a-test.eth
export const regexpEns = /((?:(?:[^-./?:\s][^./?:\s]{0,61}[^-./?:\s]|[^-./?:\s]{1,2})\.)+eth)(?:$|[/?:#].*)/i

export function extractEns(value: string): string | undefined {
  const matches = value.match(regexpEns)

  return (matches && matches[1]) || undefined
}

export function recognizeEnsOrSwarmHash(value: string): string {
  return extractEns(value) || extractSwarmHash(value) || extractSwarmCid(value) || value
}

export function uuidV4(): string {
  const pattern = '10000000-1000-4000-8000-100000000000'

  return pattern.replace(/[018]/g, (s: string) => {
    const c = parseInt(s, 10)

    return (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  })
}

export function formatEnum(string: string): string {
  return (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()).replaceAll('_', ' ')
}

export function secondsToTimeString(seconds: number | bigint): string {
  seconds = BigInt(seconds)
  let unit = seconds

  if (unit < 120) {
    return `${seconds} seconds`
  }
  unit /= BigInt(60)

  if (unit < 120) {
    return `${unit} minutes`
  }
  unit /= BigInt(60)

  if (unit < 48) {
    return `${unit} hours`
  }
  unit /= BigInt(24)

  if (unit < 14) {
    return `${unit} days`
  }
  unit /= BigInt(7)

  if (unit < 52) {
    return `${unit} weeks`
  }
  unit /= BigInt(52)

  return `${unit} years`
}

export function shortenText(text: string, length = 20, separator = '[…]'): string {
  if (text.length <= length * 2 + separator.length) {
    return text
  }

  return `${text.slice(0, length)}${separator}${text.slice(-length)}`
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
