import { BatchId, Bee, BeeDebug, Reference } from '@ethersphere/bee-js'
import { Wallet } from 'ethers'
import { uuidV4, waitUntilStampUsable } from '.'
import { Identity, IdentityType, Post, Context as IdentityContext } from '../providers/Feeds'
import { FeedUploadOptions } from '@ethersphere/bee-js/dist/types/feed'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { Context as FileContext } from '../providers/File'
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
  msg: Post,
  password?: string,
): Promise<void> {
  const wallet = await getWalletFromIdentity(identity, password)
  const [hexTopic, setTopic] = useState('0x0')
  const { uploadOrigin } = useContext(FileContext)

  if (uploadOrigin.origin === 'POST') {
    setTopic(beeApi.makeFeedTopic(identity.topic))
  } else {
    setTopic('00'.repeat(32))
  }

  if (!identity.feedHash) {
    identity.feedHash = (await beeApi.createFeedManifest(stamp, 'sequence', hexTopic, wallet.address)).reference
  }

  const writer = beeApi.makeFeedWriter('sequence', hexTopic, wallet.privateKey)

  if (beeDebugApi) {
    await waitUntilStampUsable(stamp as BatchId, beeDebugApi)
  }

  if (uploadOrigin.origin === 'POST') {
    const postData = JSON.stringify(msg)
    const fileoptions: FileUploadOptions = {}
    fileoptions.contentType = 'application/json'
    const dirHash = await beeApi.uploadFile(stamp, postData, 'file.json', fileoptions)

    if (dirHash) {
      const result = await writer.upload(stamp, dirHash.reference)
      console.log('Feed write result hash: ', result)
    }
  } else {
    await writer.upload(stamp, hash as Reference)
  }
}

function decimalToHex(d: number, padding: number) {
  var hex = Number(d).toString(16)
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
  const { posts, setPosts } = useContext(IdentityContext)
  const Posts: Post[] = []
  const wallet = await getWalletFromIdentity(identity, password)
  const topic = beeApi.makeFeedTopic(identity.topic)
  const reader = beeApi.makeFeedWriter('sequence', topic, wallet.address)
  const options: FeedUploadOptions = {}

  const { reference, feedIndex, feedIndexNext } = await reader.download()
  const I0 = parseInt(feedIndex, 16)

  for (let i = 0; i <= I0; i++) {
    options.index = decimalToHex(i, 16).toString()
    const fv = await reader
      .download(options)
      .then(async fv => {
        const fjson = await beeApi
          .downloadReadableFile(fv.reference, 'file.json')
          .then(fjson => {
            const jdata = JSON.parse(JSON.stringify(fjson.data))
            try {
              Posts.push(...[jdata])
            } catch (e) {
              console.log('Failed to: ', e)
            }
          })
          .catch(error0 => {
            console.log(error0)
          })
      })
      .catch(error1 => {
        console.log(error1)
      })
  }
  setPosts(Posts)

  return Posts
}
