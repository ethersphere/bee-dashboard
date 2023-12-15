import { BatchId, Bee, BeeDebug, Reference } from '@ethersphere/bee-js'
import { Wallet } from 'ethers'
import { uuidV4, waitUntilStampUsable } from '.'
import { Identity, IdentityType, Post } from '../providers/Feeds'
import { FeedUploadOptions } from '@ethersphere/bee-js/dist/types/feed'
import { FileUploadOptions } from '@ethersphere/bee-js'
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
  topic: string,
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
    topic: topic,
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

export function getWalletFromIdentity(identity: Identity, password?: string): Promise<Wallet> {
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
  msg?: Post,
  uporigin?: string,
): Promise<void> {
  const wallet = await getWalletFromIdentity(identity, password)
  let hexTopic = '0x0'

  if (uporigin === 'POST') {
    hexTopic = beeApi.makeFeedTopic(identity.topic)
  } else {
    hexTopic = '00'.repeat(32)
  }

  if (!identity.feedHash) {
    identity.feedHash = (await beeApi.createFeedManifest(stamp, 'sequence', hexTopic, wallet.address)).reference
  }

  const writer = beeApi.makeFeedWriter('sequence', hexTopic, wallet.privateKey)

  if (beeDebugApi) {
    await waitUntilStampUsable(stamp as BatchId, beeDebugApi)
  }

  if (uporigin === 'POST') {
    const postData = JSON.stringify(msg)
    const fileoptions: FileUploadOptions = {}
    fileoptions.contentType = 'application/json'
    const dirHash = await beeApi.uploadFile(stamp, postData, 'file.json', fileoptions)

    if (dirHash) {
      await writer.upload(stamp, dirHash.reference)
    }
  } else {
    await writer.upload(stamp, hash as Reference)
  }
}

function decimalToHex(d: number, padding: number) {
  let hex = Number(d).toString(16)
  padding = typeof padding === 'undefined' || padding === null ? (padding = 2) : padding

  while (hex.length < padding) {
    hex = '0' + hex
  }

  return hex
}

export async function readFeed(
  beeApi: Bee,
  beeDebugApi: BeeDebug | null,
  identity: Identity,
  password?: string,
): Promise<Post[]> {
  console.log('Inside reading feed')
  const Posts: Post[] = []
  console.log('read feed: ', identity, 'Password: ', password)
  const wallet = await getWalletFromIdentity(identity, password)
  const topic = beeApi.makeFeedTopic(identity.topic)
  const reader = beeApi.makeFeedReader('sequence', topic, wallet.address)
  const options: FeedUploadOptions = {}

  const { feedIndex } = await reader.download()
  const I0 = parseInt(feedIndex, 16)
  console.log('I0: ', I0)
  for (let i = 0; i <= I0; i++) {
    options.index = decimalToHex(i, 16).toString()
    await reader
      .download(options)
      .then(async fv => {
        await beeApi
          .downloadReadableFile(fv.reference, 'file.json')
          .then(fjson => {
            const jdata = JSON.parse(JSON.stringify(fjson.data))
            try {
              Posts.push(...[jdata])
            } catch (e) {
              throw e
            }
          })
          .catch(error0 => {
            throw error0
          })
      })
      .catch(error1 => {
        throw error1
      })
  }

  return Posts
}
