export function getStampUsage(utilization: number, depth: number, bucketDepth: number): number {
  return utilization / Math.pow(2, depth - bucketDepth)
}

export function getStampMaximumCapacityBytes(depth: number): number {
  return 2 ** depth * 4096
}

export function getStampCostInPlur(depth: number, amount: number): number {
  return 2 ** depth * amount
}

export function getStampCostInBzz(depth: number, amount: number): number {
  const BZZ_UNIT = 10 ** 16

  return getStampCostInPlur(depth, amount) / BZZ_UNIT
}

// export function getStampTtlSeconds(amount: number, pricePerBlock = 24_000, blockTime = 5): number {
//   return (amount * blockTime) / pricePerBlock
// }

export function getStampTtlSeconds(amount: number, pricePerBlock = 24_000, blockTime = 5): number {
  return (amount * blockTime) / pricePerBlock
}
