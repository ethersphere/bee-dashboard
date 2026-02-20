import type { Bee, DownloadOptions } from '@ethersphere/bee-js'
import { BeeRequestOptions, MantarayNode, NULL_ADDRESS } from '@ethersphere/bee-js'

export async function loadManifest(
  beeApi: Bee,
  hash: string,
  options?: DownloadOptions,
  requestOptions?: BeeRequestOptions,
): Promise<MantarayNode> {
  let manifest = await MantarayNode.unmarshal(beeApi, hash, options, requestOptions)
  await manifest.loadRecursively(beeApi, options, requestOptions)

  // If the manifest is a feed, resolve it and overwrite the manifest
  const feed = await manifest.resolveFeed(beeApi, requestOptions)
  await feed.ifPresentAsync(async feedUpdate => {
    manifest = MantarayNode.unmarshalFromData(feedUpdate.payload.toUint8Array(), NULL_ADDRESS)
    await manifest.loadRecursively(beeApi, options, requestOptions)
  })

  return manifest
}
