import type { Bee, DownloadOptions } from '@ethersphere/bee-js'
import { BeeRequestOptions, MantarayNode, NULL_ADDRESS } from '@ethersphere/bee-js'

import { regexpEns } from '.'

export async function loadManifest(
  beeApi: Bee,
  hash: string,
  options?: DownloadOptions,
  requestOptions?: BeeRequestOptions,
): Promise<MantarayNode> {
  let manifest: MantarayNode

  if (regexpEns.test(hash)) {
    // MantarayNode.unmarshal() wraps its input in `new Reference()`, which throws on
    // ENS names. Instead, let the Bee node resolve the name server-side via /bytes
    // (this is where the node's configured ENS resolver is actually used) and unmarshal
    // the returned root-node bytes. Child chunks are addressed by real hashes, so
    // loadRecursively() works normally afterwards.
    const data = (await beeApi.downloadData(hash, options, requestOptions)).toUint8Array()
    manifest = MantarayNode.unmarshalFromData(data, NULL_ADDRESS)
  } else {
    manifest = await MantarayNode.unmarshal(beeApi, hash, options, requestOptions)
  }

  await manifest.loadRecursively(beeApi, options, requestOptions)

  // If the manifest is a feed, resolve it and overwrite the manifest
  const feed = await manifest.resolveFeed(beeApi, requestOptions)
  await feed.ifPresentAsync(async feedUpdate => {
    manifest = MantarayNode.unmarshalFromData(feedUpdate.payload.toUint8Array(), NULL_ADDRESS)
    await manifest.loadRecursively(beeApi, options, requestOptions)
  })

  return manifest
}
