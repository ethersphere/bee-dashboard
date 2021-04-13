import { BigNumber } from 'bignumber.js'

/**
 * @deprecated Should be removed in favour of Token class
 */
const BZZ_BASE_UNIT = 1e16

/**
 * Convert from base units of BZZ token to BZZ
 * @deprecated This should only be used for displaying values, it's unsafe and should be replaced with Token class
 *
 * @param amount Amount in base units of BZZ token
 *
 * @returns amount in BZZ
 */
export const fromBZZbaseUnit = (amount: number): number => {
  return amount / BZZ_BASE_UNIT
}

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
export function makeBigNumber(value: BigNumber | bigint | string): BigNumber | never {
  if (BigNumber.isBigNumber(value)) return value

  if (typeof value === 'string') return new BigNumber(value)

  if (typeof value === 'bigint') return new BigNumber(value.toString())

  throw new TypeError('Not a BigNumber or BigNumber convertible value')
}
