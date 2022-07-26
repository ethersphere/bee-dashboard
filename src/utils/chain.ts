const chains = [
  {
    name: 'Ethereum Mainnet',
    chainId: 1,
  },
  {
    name: 'Ropsten Testnet',
    chainId: 3,
  },
  {
    name: 'Rinkeby Testnet',
    chainId: 4,
  },
  {
    name: 'Görli Testnet',
    chainId: 5,
  },
  {
    name: 'Kovan Testnet',
    chainId: 42,
  },
  {
    name: 'Gnosis Chain',
    chainId: 100,
  },
]

export function chainIdToName(chainId: number): string {
  return chains.find(record => record.chainId === chainId)?.name || 'Unknown'
}
