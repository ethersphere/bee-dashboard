export function shortenHash(hash: string, sliceLength = 8): string {
  return hash.slice(0, sliceLength) + '[…]' + hash.slice(-sliceLength)
}
