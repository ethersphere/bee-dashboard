import { Bee, Reference } from '@ethersphere/bee-js'
import Wallet from 'ethereumjs-wallet'
import { uuidV4 } from '.'
import { Identity, IdentityType } from '../providers/Feeds'

export function generateWallet(): Wallet {
  const buffer = new Uint8Array(32)
  crypto.getRandomValues(buffer)
  const wallet = new Wallet(Buffer.from(buffer))

  return wallet
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

  const identityString =
    type === 'PRIVATE_KEY' ? identity.getPrivateKeyString() : await identity.toV3String(password as string)

  return {
    uuid: uuidV4(),
    name,
    type: password ? 'V3' : 'PRIVATE_KEY',
    address: identity.getAddressString(),
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
      identity: data,
      address: wallet.getAddressString(),
    }
  }

  if (data.length === 66 && data.toLowerCase().startsWith('0x')) {
    const wallet = await getWallet('PRIVATE_KEY', data.slice(2))

    return { uuid: uuidV4(), name, type: 'PRIVATE_KEY', identity: data, address: wallet.getAddressString() }
  }
  try {
    const { address } = JSON.parse(data)

    return { uuid: uuidV4(), name, type: 'V3', identity: data, address }
  } catch {
    return null
  }
}

function getWalletFromIdentity(identity: Identity, password?: string): Promise<Wallet> {
  return getWallet(identity.type, identity.identity, password)
}

async function getWallet(type: IdentityType, data: string, password?: string): Promise<Wallet> {
  return type === 'PRIVATE_KEY' ? getWalletFromPrivateKeyString(data) : await Wallet.fromV3(data, password as string)
}

export function getWalletFromPrivateKeyString(privateKey: string): Wallet {
  return Wallet.fromPrivateKey(Buffer.from(trimHexString(privateKey), 'hex'))
}

export async function updateFeed(
  beeApi: Bee,
  identity: Identity,
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
