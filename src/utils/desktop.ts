import { DAI } from '@ethersphere/bee-js'
import axios from 'axios'

import { BEE_DESKTOP_LATEST_RELEASE_PAGE_API } from '../constants'

import { getJson, postJson } from './net'

export interface BeeConfig {
  'api-addr': string
  password: string
  'swap-enable': boolean
  'swap-initial-deposit': bigint
  mainnet: boolean
  'full-node': boolean
  'cors-allowed-origins': string
  'resolver-options': string
  'use-postage-snapshot': boolean
  'data-dir': string
  'blockchain-rpc-endpoint'?: string
}

export async function getBzzPriceAsDai(desktopUrl: string): Promise<DAI> {
  const response = await axios.get(`${desktopUrl}/price`)

  return DAI.fromDecimalString(response.data)
}

export function upgradeToLightNode(desktopUrl: string, rpcProvider: string): Promise<BeeConfig> {
  return updateDesktopConfiguration(desktopUrl, {
    'swap-enable': true,
    'blockchain-rpc-endpoint': rpcProvider,
  })
}

export async function setJsonRpcInDesktop(desktopUrl: string, value: string): Promise<void> {
  await updateDesktopConfiguration(desktopUrl, {
    'blockchain-rpc-endpoint': value,
  })
}

export function getDesktopConfiguration(desktopUrl: string): Promise<BeeConfig> {
  return getJson(`${desktopUrl}/config`)
}

function updateDesktopConfiguration(desktopUrl: string, values: Record<string, unknown>): Promise<BeeConfig> {
  return postJson(`${desktopUrl}/config`, values)
}

export async function restartBeeNode(desktopUrl: string): Promise<void> {
  await postJson(`${desktopUrl}/restart`)
}

export async function createGiftWallet(desktopUrl: string, address: string): Promise<void> {
  await postJson(`${desktopUrl}/gift-wallet/${address}`)
}

export async function performSwap(desktopUrl: string, daiAmount: DAI): Promise<void> {
  await postJson(`${desktopUrl}/swap`, { dai: daiAmount.toWeiString() })
}

export async function getLatestBeeDesktopVersion(): Promise<string> {
  const response = await (await fetch(BEE_DESKTOP_LATEST_RELEASE_PAGE_API)).json()

  return response.tag_name.replace('v', '') // We get for example "v0.12.1"
}
