import axios from 'axios'
import { DaiToken } from '../models/DaiToken'
import { Token } from '../models/Token'
import { postJson } from './net'
import { BEE_DESKTOP_LATEST_RELEASE_PAGE_API } from '../constants'

export async function getBzzPriceAsDai(desktopUrl: string): Promise<Token> {
  const response = await axios.get(`${desktopUrl}/price`)

  return DaiToken.fromDecimal(response.data, 18)
}

export async function upgradeToLightNode(desktopUrl: string, rpcProvider: string): Promise<void> {
  await updateDesktopConfiguration(desktopUrl, {
    'chain-enable': true,
    'swap-enable': true,
    'swap-endpoint': rpcProvider,
  })
}

export async function setJsonRpcInDesktop(desktopUrl: string, value: string): Promise<void> {
  await updateDesktopConfiguration(desktopUrl, {
    'swap-endpoint': value,
  })
}

async function updateDesktopConfiguration(desktopUrl: string, values: Record<string, unknown>): Promise<void> {
  await postJson(`${desktopUrl}/config`, values)
}

export async function restartBeeNode(desktopUrl: string): Promise<void> {
  await postJson(`${desktopUrl}/restart`)
}

export async function createGiftWallet(desktopUrl: string, address: string): Promise<void> {
  await postJson(`${desktopUrl}/gift-wallet/${address}`)
}

export async function performSwap(desktopUrl: string, daiAmount: string): Promise<void> {
  await postJson(`${desktopUrl}/swap`, { dai: daiAmount })
}

export async function getLatestBeeDesktopVersion(): Promise<string> {
  const response = await (await fetch(BEE_DESKTOP_LATEST_RELEASE_PAGE_API)).json()

  return response.tag_name.replace('v', '') // We get for example "v0.12.1"
}
