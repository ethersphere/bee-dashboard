const BZZ_BASE_UNIT = 1e16

export function isInteger(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    value > Number.MIN_SAFE_INTEGER &&
    value < Number.MAX_SAFE_INTEGER &&
    Number.isInteger(value)
  )
}

export function assertInteger(value: unknown): asserts value is number {
  if (!isInteger(value)) throw new TypeError('value is not integer')
}

/**
 * Asserts that the value can be safely converted from base unist of BZZ token to BZZ
 *
 * @param value Amount in base units of BZZ token
 */
export function assertSafeBZZ(value: unknown): asserts value is string | number {
  if (typeof value === 'string') {
    // Matches '0' or any decimal with 16 decimal places
    if (!/^-?(0|0?\.\d{1,16})$/.test(value)) {
      throw new Error('not a valid string number or not safe value')
    }

    toBZZbaseUnitSafe(Number.parseFloat(value))
  } else if (typeof value === 'number') toBZZbaseUnitSafe(value)
  else throw new TypeError('Not a valid string or number')
}

/**
 * Convert from base units of BZZ token to BZZ
 * @deprecated please use safe variant fromBZZbaseUnitSafe
 *
 * @param amount Amount in base units of BZZ token
 *
 * @returns amount in BZZ
 */
export const fromBZZbaseUnit = (amount: number): number => {
  return amount / BZZ_BASE_UNIT
}
/**
 * Convert from base units of BZZ token to BZZ
 *
 * @param amount Amount in base units of BZZ token
 *
 * @returns amount in BZZ
 *
 * @throws Error if the amount to be converted is not a safe integer
 */

export const fromBZZbaseUnitSafe = (amount: number): number | never => {
  assertInteger(amount)

  return fromBZZbaseUnit(amount)
}
/**
 * Convert from BZZ to base units of BZZ token
 *
 * @param amount Amount in BZZ
 *
 * @returns amount in base units of BZZ token
 *
 * @throws Error if the amount after conversion is not a safe integer
 */

export const toBZZbaseUnitSafe = (amount: number): number | never => {
  if (typeof amount !== 'number') throw new TypeError('amount is not a number')
  const conversion = toBZZbaseUnit(amount)

  assertInteger(conversion)

  return conversion
}

/**
 * Convert from BZZ to base units of BZZ token
 * @deprecated please use safe variant toBZZbaseUnitSafe
 *
 * @param amount Amount in BZZ
 *
 * @returns amount in base units of BZZ token
 */
export const toBZZbaseUnit = (amount: number): number | never => {
  return Number((amount * BZZ_BASE_UNIT).toFixed(0))
}
