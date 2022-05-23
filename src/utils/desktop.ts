import axios from 'axios'
import { getJson, postJson } from './net'

interface DesktopStatus {
  status: 0 | 1 | 2
  address: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
}

export async function getDesktopStatus(): Promise<DesktopStatus> {
  const response = await getJson(`http://${getDesktopHost()}/status`)

  return response as DesktopStatus
}

export async function getGasFromFaucet(address: string): Promise<void> {
  await axios.post(`http://getxdai.co/${address}/0.1`)
}

export async function upgradeToLightNode(rpcProvider: string): Promise<void> {
  await updateDesktopConfiguration({
    'chain-enable': true,
    'swap-enable': true,
    'swap-endpoint': rpcProvider,
  })
}

export async function setJsonRpcInDesktop(value: string): Promise<void> {
  await updateDesktopConfiguration({
    'swap-endpoint': value,
  })
}

async function updateDesktopConfiguration(values: Record<string, unknown>): Promise<void> {
  await postJson(`http://${getDesktopHost()}/config`, values)
}

export async function restartBeeNode(): Promise<void> {
  await postJson(`http://${getDesktopHost()}/restart`)
}

export async function createGiftWallet(address: string): Promise<void> {
  await postJson(`http://${getDesktopHost()}/gift-wallet/${address}`)
}

export async function performSwap(daiAmount: string): Promise<void> {
  await postJson(`http://${getDesktopHost()}/swap`, { dai: daiAmount })
}

function getDesktopHost(): string {
  return window.location.host
}
