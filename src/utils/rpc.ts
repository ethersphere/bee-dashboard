const PROVIDER = 'https://dai.poa.network/'

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

export const Rpc = {
  eth_getBalance,
}
