import { BigNumber } from 'bignumber.js'

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
export function makeBigNumber(value: BigNumber | BigInt | number | string): BigNumber | never {
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

export function extractSwarmHash(string: string): string | null {
  const matches = string.match(/[a-fA-F0-9]{64,128}/)

  return (matches && matches[0]) || null
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

export function formatBzz(amount: number): string {
  const asString = amount.toFixed(16)

  let indexOfSignificantDigit = -1
  let reachedDecimalPoint = false

  for (let i = 0; i < asString.length; i++) {
    const char = asString[i]

    if (char === '.') {
      reachedDecimalPoint = true
    } else if (reachedDecimalPoint && char !== '0') {
      indexOfSignificantDigit = i
      break
    }
  }

  return asString.slice(0, indexOfSignificantDigit + 4)
}

export function convertDepthToBytes(depth: number): number {
  return 2 ** depth * 4096
}

export function convertAmountToSeconds(amount: number): number {
  return amount / 10 / 1
}

export function calculateStampPrice(depth: number, amount: number): number {
  return (amount * 2 ** (depth - 16) * 2) / 1e16
}
