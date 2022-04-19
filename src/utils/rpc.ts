import { Contract, providers } from 'ethers'

const PROVIDER = 'https://xdai.fairdatasociety.org/'

async function eth_getBalance(address: string): Promise<string> {
  const response = await fetch(PROVIDER, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1,
    }),
  })
  const json = await response.json()

  return json.result
}

const partialERC20tokenABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
]

const provider = new providers.JsonRpcProvider(PROVIDER)

async function eth_getBalanceERC20(
  address: string,
  tokenAddress = '0xdbf3ea6f5bee45c02255b2c26a16f300502f68da',
): Promise<string> {
  const contract = new Contract(tokenAddress, partialERC20tokenABI, provider)
  const balance = await contract.balanceOf(address)

  return balance.toString()
}

export const Rpc = {
  eth_getBalance,
  eth_getBalanceERC20,
}
