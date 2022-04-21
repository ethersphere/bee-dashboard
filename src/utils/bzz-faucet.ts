import axios from 'axios'

export async function requestBzz(address: string): Promise<void> {
  await axios.post(`https://xbzz-faucet.apyos.dev/xbzz/${address}`)
}
