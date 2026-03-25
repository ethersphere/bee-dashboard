import { EthAddress } from '@ethersphere/bee-js'
import { getAddress, JsonRpcPayload, JsonRpcProvider, JsonRpcResult, Networkish } from 'ethers'

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

/**
 * Some RPC endpoints always return id:1 in their JSON-RPC responses regardless of the id in the request.
 * Ethers v6 validates that response ids match request ids, so we patch them.
 */
class FixedIdJsonRpcProvider extends JsonRpcProvider {
  async _send(payload: JsonRpcPayload | Array<JsonRpcPayload>): Promise<Array<JsonRpcResult>> {
    const results = await super._send(payload)
    const payloads = Array.isArray(payload) ? payload : [payload]

    return results.map((result, i) => ({ ...result, id: payloads[i]?.id ?? result.id }))
  }
}

export function newGnosisProvider(url: string): JsonRpcProvider {
  return new FixedIdJsonRpcProvider(url, GnosisNetwork, { staticNetwork: true, batchMaxCount: 1 })
}

/**
 * Provider for RPC validation only — no staticNetwork so getNetwork() actually
 * calls eth_chainId, but still uses FixedIdJsonRpcProvider to handle endpoints
 * that return a fixed/wrong id in their responses.
 */
export function newGnosisProviderForValidation(url: string): JsonRpcProvider {
  return new FixedIdJsonRpcProvider(url, undefined, { batchMaxCount: 1 })
}
