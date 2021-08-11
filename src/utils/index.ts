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

// TODO doc
export function mapPromiseSettlements<T>(promises: PromiseSettledResult<T>[]): PromiseSettlements<T> {
  const fulfilled = promises.filter(promise => promise.status === 'fulfilled') as PromiseFulfilledResult<T>[]
  const rejected = promises.filter(promise => promise.status === 'rejected') as PromiseRejectedResult[]

  return { fulfilled, rejected }
}

// TODO doc
export function unwrapPromiseSettlements<T>(
  promiseSettledResults: PromiseSettledResult<T>[],
): UnwrappedPromiseSettlements<T> {
  const values = mapPromiseSettlements(promiseSettledResults)
  const fulfilled = values.fulfilled.map(x => x.value)
  const rejected = values.rejected.map(x => (x.reason ? String(x.reason) : 'Unknown error'))

  return { fulfilled, rejected }
}

export function makeRetriablePromise<T>(fn: () => Promise<T>, maxRetries = 3, delayMs = 1000): Promise<T> {
  return new Promise(async (resolve, reject) => {
    for (let tries = 0; tries < maxRetries; tries++) {
      try {
        const results = await fn()
        resolve(results)

        return
      } catch (error) {
        if (tries < maxRetries) {
          await sleepMs(delayMs)
        } else {
          reject(error)
        }
      }
    }
  })
}
