const BZZ_BASE_UNIT = 1e15

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

export function assertSafeBZZ(value: unknown): asserts value is string | number {
  if (typeof value === 'string') {
    if (!/^-?(\d|\d?\.\d{1,15})$/.test(value)) {
      throw new Error('not a valid digit number')
    }

    toBZZbaseUnit(Number.parseFloat(value))
  } else if (typeof value === 'number') toBZZbaseUnit(value)
  else throw new TypeError('Not a valid string or number')
}

export const fromBZZbaseUnit = (amount: number): number | never => {
  assertInteger(amount)

  return amount / BZZ_BASE_UNIT
}

export const toBZZbaseUnit = (amount: number): number | never => {
  if (typeof amount !== 'number') throw new TypeError('amount is not a number')

  const conversion = amount * BZZ_BASE_UNIT

  assertInteger(conversion)

  return conversion
}
