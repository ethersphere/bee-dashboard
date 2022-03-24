export async function requestBzz(address: string): Promise<void> {
  await fetch(`https://xbzz-faucet.apyos.dev/xbzz/${address}`, {
    method: 'POST',
  })
}
