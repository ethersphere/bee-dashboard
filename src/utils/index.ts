// FIXME: this should be using BigInt or BigNumber, number does not have enough precision only 9e16
const BZZ_BASE_UNIT = 1e16

export const fromBZZbaseUnit = (amount: number): number => {
  return amount / BZZ_BASE_UNIT
}

export const toBZZbaseUnit = (amount: number): number => {
  return Number((amount * BZZ_BASE_UNIT).toFixed(0))
}
