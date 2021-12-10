import { Bee, PostageBatch } from '@ethersphere/bee-js'
import Wallet from 'ethereumjs-wallet'
import { Feed } from '../providers/Feeds'

export function generateWallet(): Wallet {
  const buffer = new Uint8Array(32)
  crypto.getRandomValues(buffer)
  const wallet = new Wallet(Buffer.from(buffer))

  return wallet
}

export function persistIdentity(identities: Feed[], feed: Feed): void {
  if (!identities.find(x => x.feedHash === feed.feedHash)) {
    identities.unshift(feed)
  }
  localStorage.setItem('feeds', JSON.stringify(identities))
}

export async function convertWalletToIdentity(
  bee: Bee,
  stamp: PostageBatch,
  identity: Wallet,
  name: string,
  hasPassword: boolean,
): Promise<Feed> {
  const address = identity.getAddressString()
  const feedHash = await bee.createFeedManifest(stamp.batchID, 'sequence', '00'.repeat(32), address)

  return {
    name,
    identityType: hasPassword ? 'WITH_PW' : 'WITHOUT_PW',
    hasPassword,
    identity: identity.getPrivateKeyString(),
    feedHash,
  }
}
