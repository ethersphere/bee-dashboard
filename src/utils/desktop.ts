import { getJson, postJson } from './net'

interface DesktopStatus {
  status: 0 | 1 | 2
  address: string | null
  config: Record<string, any>
}

export async function getDesktopStatus(): Promise<DesktopStatus> {
  const response = await getJson(`http://${getDesktopHost()}/status`)

  return response as DesktopStatus
}

export async function getBeeEthereumAddress(): Promise<string> {
  const status = await getDesktopStatus()

  if (!status.address) {
    throw Error('Bee node Ethereum address is not yet available')
  }

  return status.address
}

export async function getGasFromFaucet(address: string): Promise<void> {
  await fetch(`http://getxdai.co/${address}/0.1`, {
    method: 'POST',
  })
}

export async function upgradeToLightNode(rpcProvider: string): Promise<void> {
  await updateDesktopConfiguration({
    'chain-enable': true,
    'swap-enable': true,
    'swap-endpoint': rpcProvider,
  })
}

async function updateDesktopConfiguration(values: Record<string, unknown>): Promise<void> {
  await postJson(`http://${getDesktopHost()}/config`, values)
}

export async function restartBeeNode(): Promise<void> {
  await postJson(`http://${getDesktopHost()}/restart`)
}

function getDesktopHost(): string {
  return window.location.host
}
