import { BatchId, Bee, NULL_TOPIC, PrivateKey, Reference } from '@ethersphere/bee-js'
import { randomBytes, Wallet } from 'ethers'

import { Identity, IdentityType } from '../providers/Feeds'

import { LocalStorageKeys } from './localStorage'
import { uuidV4, waitUntilStampUsable } from '.'

export function generateWallet(): Wallet {
  const privateKey = randomBytes(PrivateKey.LENGTH).toString()

  return new Wallet(privateKey)
}

export function persistIdentity(identities: Identity[], identity: Identity): void {
  const existingIndex = identities.findIndex(x => x.uuid === identity.uuid)

  if (existingIndex !== -1) {
    identities.splice(existingIndex, 1)
  }
  identities.unshift(identity)
  localStorage.setItem(LocalStorageKeys.feeds, JSON.stringify(identities))
}

export function persistIdentitiesWithoutUpdate(identities: Identity[]): void {
  localStorage.setItem(LocalStorageKeys.feeds, JSON.stringify(identities))
}

export async function convertWalletToIdentity(
  identity: Wallet,
  type: IdentityType,
  name: string,
  password?: string,
): Promise<Identity> {
  if (type === IdentityType.V3 && !password) {
    throw Error('V3 passwords require password')
  }

  const identityString =
    type === IdentityType.PrivateKey ? identity.privateKey : await identity.encrypt(password as string)

  return {
    uuid: uuidV4(),
    name,
    type: password ? IdentityType.V3 : IdentityType.PrivateKey,
    address: identity.address,
    identity: identityString,
  }
}

export async function importIdentity(name: string, data: string): Promise<Identity | null> {
  if (data.length === 64) {
    const wallet = await getWallet(IdentityType.PrivateKey, data)

    return {
      uuid: uuidV4(),
      name,
      type: IdentityType.PrivateKey,
      identity: data,
      address: wallet.address,
    }
  }

  if (data.length === 66 && data.toLowerCase().startsWith('0x')) {
    const wallet = await getWallet(IdentityType.PrivateKey, data.slice(2))

    return { uuid: uuidV4(), name, type: IdentityType.PrivateKey, identity: data, address: wallet.address }
  }
  try {
    const { address } = JSON.parse(data)

    return { uuid: uuidV4(), name, type: IdentityType.V3, identity: data, address }
  } catch {
    return null
  }
}

function getWalletFromIdentity(identity: Identity, password?: string): Promise<Wallet> {
  return getWallet(identity.type, identity.identity, password)
}

async function getWallet(type: IdentityType, data: string, password?: string): Promise<Wallet> {
  if (type === IdentityType.PrivateKey) {
    return new Wallet(data)
  }

  if (!password) {
    throw new Error('password is required for wallet')
  }

  const w = await Wallet.fromEncryptedJson(data, password)

  return new Wallet(w.privateKey)
}

export async function updateFeed(
  beeApi: Bee,
  identity: Identity,
  hash: Reference | string,
  stamp: BatchId | string,
  password?: string,
): Promise<void> {
  const wallet = await getWalletFromIdentity(identity, password)

  if (!identity.feedHash) {
    identity.feedHash = (await beeApi.createFeedManifest(stamp, NULL_TOPIC, wallet.address)).toHex()
  }

  const writer = beeApi.makeFeedWriter(NULL_TOPIC, wallet.privateKey)

  await waitUntilStampUsable(stamp, beeApi)
  await writer.uploadReference(stamp, hash)
}
