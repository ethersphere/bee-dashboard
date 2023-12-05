import { BatchId, Bee, BeeDebug, Reference } from '@ethersphere/bee-js'
import { Wallet } from 'ethers'
import { uuidV4, waitUntilStampUsable } from '.'
import { Identity, IdentityType } from '../providers/Feeds'

export function generateWallet(): Wallet {
  return Wallet.createRandom()
}

export function persistIdentity(identities: Identity[], identity: Identity): void {
  const existingIndex = identities.findIndex(x => x.uuid === identity.uuid)

  if (existingIndex !== -1) {
    identities.splice(existingIndex, 1)
  }
  identities.unshift(identity)
  localStorage.setItem('feeds', JSON.stringify(identities))
}

export function persistIdentitiesWithoutUpdate(identities: Identity[]): void {
  localStorage.setItem('feeds', JSON.stringify(identities))
}

export async function convertWalletToIdentity(
  identity: Wallet,
  type: IdentityType,
  name: string,
  password?: string,
): Promise<Identity> {
  if (type === 'V3' && !password) {
    throw Error('V3 passwords require password')
  }

  const identityString = type === 'PRIVATE_KEY' ? identity.privateKey : await identity.encrypt(password as string)

  return {
    uuid: uuidV4(),
    name,
    type: password ? 'V3' : 'PRIVATE_KEY',
    topic: '00',
    website: true,
    address: identity.address,
    identity: identityString,
  }
}

export async function importIdentity(name: string, data: string): Promise<Identity | null> {
  if (data.length === 64) {
    const wallet = await getWallet('PRIVATE_KEY', data)

    return {
      uuid: uuidV4(),
      name,
      type: 'PRIVATE_KEY',
      topic: '00',
      website: true,
      identity: data,
      address: wallet.address,
    }
  }

  if (data.length === 66 && data.toLowerCase().startsWith('0x')) {
    const wallet = await getWallet('PRIVATE_KEY', data.slice(2))

    return {
      uuid: uuidV4(),
      name,
      type: 'PRIVATE_KEY',
      identity: data,
      website: true,
      topic: '00',
      address: wallet.address,
    }
  }
  try {
    const { address } = JSON.parse(data)

    return { uuid: uuidV4(), name, type: 'V3', identity: data, website: true, topic: '00', address }
  } catch {
    return null
  }
}

function getWalletFromIdentity(identity: Identity, password?: string): Promise<Wallet> {
  return getWallet(identity.type, identity.identity, password)
}

async function getWallet(type: IdentityType, data: string, password?: string): Promise<Wallet> {
  return type === 'PRIVATE_KEY' ? new Wallet(data) : await Wallet.fromEncryptedJson(data, password as string)
}

export async function updateFeed(
  beeApi: Bee,
  beeDebugApi: BeeDebug | null,
  identity: Identity,
  hash: string,
  stamp: string,
  password?: string,
): Promise<void> {
  const wallet = await getWalletFromIdentity(identity, password)

  if (!identity.feedHash) {
    identity.feedHash = (await beeApi.createFeedManifest(stamp, 'sequence', '00'.repeat(32), wallet.address)).reference
  }

  const writer = beeApi.makeFeedWriter('sequence', '00'.repeat(32), wallet.privateKey)

  if (beeDebugApi) {
    await waitUntilStampUsable(stamp as BatchId, beeDebugApi)
  }
  await writer.upload(stamp, hash as Reference)
}
