import axios from 'axios'
import { getJson, postJson, sendRequest } from './net'

interface DesktopStatus {
  status: 0 | 1 | 2
  address: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
}

export const BEE_DESKTOP_LATEST_RELEASE_PAGE = 'https://github.com/ethersphere/bee-desktop/releases/latest'

export async function getDesktopStatus(): Promise<DesktopStatus> {
  const response = await getJson(`${getDesktopHost()}/status`)

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
  await postJson(`${getDesktopHost()}/config`, values)
}

export async function restartBeeNode(): Promise<void> {
  await postJson(`${getDesktopHost()}/restart`)
}

export async function createGiftWallet(address: string): Promise<void> {
  await postJson(`${getDesktopHost()}/gift-wallet/${address}`)
}

export async function performSwap(daiAmount: string): Promise<void> {
  await postJson(`${getDesktopHost()}/swap`, { dai: daiAmount })
}

export async function getBeeDesktopLogs(): Promise<string> {
  const response = await sendRequest(`${getDesktopHost()}/logs/bee-desktop`, 'GET')

  return response as unknown as string
}

export async function getBeeLogs(): Promise<string> {
  const response = await sendRequest(`${getDesktopHost()}/logs/bee`, 'GET')

  return response as unknown as string
}

export async function getLatestBeeDesktopVersion(): Promise<string> {
  const response = await (await fetch('https://api.github.com/repos/ethersphere/bee-desktop/releases/latest')).json()

  return response.tag_name.replace('v', '') // We get for example "v0.12.1"
}

function getDesktopHost(): string {
  if (process.env.REACT_APP_BEE_DESKTOP_URL) {
    return process.env.REACT_APP_BEE_DESKTOP_URL
  }

  return `http://${window.location.host}`
}
