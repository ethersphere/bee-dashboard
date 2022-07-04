import { BatchId, BeeDebug, PostageBatch } from '@ethersphere/bee-js'
import { decodeCid } from '@ethersphere/swarm-cid'
import { BigNumber } from 'bignumber.js'
import { BZZ_LINK_DOMAIN } from '../constants'
import { Token } from '../models/Token'

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

  // FIXME: bee-js still returns some values as numbers and even outside of SAFE INTEGER bounds
  if (typeof value === 'number' /* && Number.isSafeInteger(value)*/) return new BigNumber(value)

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
    const decodeResult = decodeCid(cid)

    if (!decodeResult.type) {
      return
    }

    return decodeResult.reference
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

export function secondsToTimeString(seconds: number): string {
  let unit = seconds

  if (unit < 120) {
    return `${seconds} seconds`
  }
  unit /= 60

  if (unit < 120) {
    return `${Math.round(unit)} minutes`
  }
  unit /= 60

  if (unit < 48) {
    return `${Math.round(unit)} hours`
  }
  unit /= 24

  if (unit < 14) {
    return `${Math.round(unit)} days`
  }
  unit /= 7

  if (unit < 52) {
    return `${Math.round(unit)} weeks`
  }
  unit /= 52

  return `${unit.toFixed(1)} years`
}

export function convertDepthToBytes(depth: number): number {
  return 2 ** depth * 4096
}

export function convertAmountToSeconds(amount: number, pricePerBlock: number): number {
  // TODO: blocktime should come directly from the blockchain as it may differ between different networks
  const blockTime = 5 // On mainnet there is 5 seconds between blocks

  // See https://github.com/ethersphere/bee/blob/66f079930d739182c4c79eb6008784afeeba1096/pkg/debugapi/postage.go#L410-L413
  return (amount * blockTime) / pricePerBlock
}

export function calculateStampPrice(depth: number, amount: bigint): Token {
  // See https://github.com/ethersphere/bee/blob/66f079930d739182c4c79eb6008784afeeba1096/pkg/debugapi/postage.go#L410-L413
  return new Token(amount * BigInt(2 ** depth)) // FIXME: the 2 ** depth should be performed on bigint already
}

export function shortenText(text: string, length = 20, separator = '[…]'): string {
  if (text.length <= length * 2 + separator.length) {
    return text
  }

  return `${text.slice(0, length)}${separator}${text.slice(-length)}`
}

const DEFAULT_POLLING_FREQUENCY = 1_000
const DEFAULT_STAMP_USABLE_TIMEOUT = 240_000

interface Options {
  pollingFrequency?: number
  timeout?: number
}

export function waitUntilStampUsable(batchId: BatchId, beeDebug: BeeDebug, options?: Options): Promise<PostageBatch> {
  return waitForStamp(batchId, beeDebug, 'usable', options)
}

export function waitUntilStampExists(batchId: BatchId, beeDebug: BeeDebug, options?: Options): Promise<PostageBatch> {
  return waitForStamp(batchId, beeDebug, 'exists', options)
}

async function waitForStamp(
  batchId: BatchId,
  beeDebug: BeeDebug,
  field: 'exists' | 'usable',
  options?: Options,
): Promise<PostageBatch> {
  const timeout = options?.timeout || DEFAULT_STAMP_USABLE_TIMEOUT
  const pollingFrequency = options?.pollingFrequency || DEFAULT_POLLING_FREQUENCY

  for (let i = 0; i < timeout; i += pollingFrequency) {
    const stamp = await beeDebug.getPostageBatch(batchId)

    if (stamp[field]) return stamp
    await sleepMs(pollingFrequency)
  }

  throw new Error('Wait until stamp usable timeout has been reached')
}
