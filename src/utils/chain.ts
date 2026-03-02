import { EthAddress } from '@ethersphere/bee-js'
import { getAddress, JsonRpcProvider, Networkish } from 'ethers'

export const GNOIS_NETWORK_ID = 100
export const GnosisNetwork: Networkish = { chainId: GNOIS_NETWORK_ID, name: 'gnosis', ensAddress: undefined }

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
    chainId: GNOIS_NETWORK_ID,
  },
]

export function chainIdToName(chainId: number): string {
  return chains.find(record => record.chainId === chainId)?.name || 'Unknown'
}

export function ethAddressString(address: EthAddress | string): string {
  return typeof address === 'string' ? getAddress(address) : getAddress(address.toHex())
}

export function newGnosisProvider(url: string): JsonRpcProvider {
  return new JsonRpcProvider(url, GnosisNetwork, { staticNetwork: true })
}
