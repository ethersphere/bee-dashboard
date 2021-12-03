export function shortenHash(hash: string): string {
  return hash.slice(0, 8) + '[…]' + hash.slice(-8)
}
