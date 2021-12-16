import { Bee, Reference } from '@ethersphere/bee-js'
import Wallet from 'ethereumjs-wallet'
import { uuidV4 } from '.'
import { Feed, IdentityType } from '../providers/Feeds'

export function generateWallet(): Wallet {
  const buffer = new Uint8Array(32)
  crypto.getRandomValues(buffer)
  const wallet = new Wallet(Buffer.from(buffer))

  return wallet
}

export function persistIdentity(identities: Feed[], feed: Feed): void {
  const existingIndex = identities.findIndex(x => x.uuid === feed.uuid)

  if (existingIndex !== -1) {
    identities.splice(existingIndex, 1)
  }
  identities.unshift(feed)
  localStorage.setItem('feeds', JSON.stringify(identities))
}

export function persistIdentitiesWithoutUpdate(identities: Feed[]): void {
  localStorage.setItem('feeds', JSON.stringify(identities))
}

export async function convertWalletToIdentity(
  identity: Wallet,
  type: IdentityType,
  name: string,
  password?: string,
): Promise<Feed> {
  if (type === 'V3' && !password) {
    throw Error('V3 passwords require password')
  }

  const identityString =
    type === 'PRIVATE_KEY' ? identity.getPrivateKeyString() : await identity.toV3String(password as string)

  return {
    uuid: uuidV4(),
    name,
    type: password ? 'V3' : 'PRIVATE_KEY',
    identity: identityString,
  }
}

export function importIdentity(name: string, data: string): Feed | null {
  if (data.length === 64) {
    return {
      uuid: uuidV4(),
      name,
      type: 'PRIVATE_KEY',
      identity: data,
    }
  }

  if (data.length === 66 && data.toLowerCase().startsWith('0x')) {
    return { uuid: uuidV4(), name, type: 'PRIVATE_KEY', identity: data }
  }
  try {
    JSON.parse(data)

    return { uuid: uuidV4(), name, type: 'V3', identity: data }
  } catch {
    return null
  }
}

async function getWalletFromIdentity(identity: Feed, password?: string): Promise<Wallet> {
  return identity.type === 'PRIVATE_KEY'
    ? Wallet.fromPrivateKey(Buffer.from(trimHexString(identity.identity), 'hex'))
    : await Wallet.fromV3(identity.identity, password as string)
}

export async function updateFeed(
  beeApi: Bee,
  identity: Feed,
  hash: string,
  stamp: string,
  password?: string,
): Promise<void> {
  const wallet = await getWalletFromIdentity(identity, password)

  if (!identity.feedHash) {
    identity.feedHash = await beeApi.createFeedManifest(stamp, 'sequence', '00'.repeat(32), wallet.getAddressString())
  }

  const writer = beeApi.makeFeedWriter('sequence', '00'.repeat(32), wallet.getPrivateKeyString())
  await writer.upload(stamp, hash as Reference)
}

function trimHexString(string: string): string {
  if (string.toLowerCase().startsWith('0x')) {
    return string.slice(2)
  }

  return string
}
