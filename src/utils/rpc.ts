const PROVIDER = 'https://dai.poa.network/'

async function eth_getBalance(address: string): Promise<number> {
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
  const result = json.result
  const number = parseInt(result, 16)

  return number
}

export const Rpc = {
  eth_getBalance,
}
