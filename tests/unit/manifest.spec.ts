import type { Bee } from '@ethersphere/bee-js'
import { MantarayNode } from '@ethersphere/bee-js'

import { loadManifest } from '../../src/utils/manifest'

// A minimal stand-in for the MantarayNode returned by unmarshal / unmarshalFromData.
// resolveFeed returns an Optional-like object whose ifPresentAsync never fires the
// callback, i.e. "this manifest is not a feed".
function makeFakeNode() {
  return {
    loadRecursively: jest.fn().mockResolvedValue(undefined),
    resolveFeed: jest.fn().mockResolvedValue({
      ifPresentAsync: jest.fn().mockResolvedValue(undefined),
    }),
  }
}

const VALID_HASH = 'a'.repeat(64)
const ENS_NAME = 'litter-ally.eth'

describe('loadManifest', () => {
  let downloadData: jest.Mock
  let beeApi: Bee
  let unmarshalSpy: jest.SpyInstance
  let unmarshalFromDataSpy: jest.SpyInstance

  beforeEach(() => {
    downloadData = jest.fn().mockResolvedValue({ toUint8Array: () => new Uint8Array([1, 2, 3]) })
    beeApi = { downloadData } as unknown as Bee

    // Both unmarshal paths return our fake node so we can assert *which* one ran
    // without exercising real chunk parsing.
    unmarshalSpy = jest.spyOn(MantarayNode, 'unmarshal').mockResolvedValue(makeFakeNode() as never)
    unmarshalFromDataSpy = jest.spyOn(MantarayNode, 'unmarshalFromData').mockReturnValue(makeFakeNode() as never)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('resolves an ENS name via the node (downloadData) instead of MantarayNode.unmarshal', async () => {
    await expect(loadManifest(beeApi, ENS_NAME)).resolves.toBeDefined()

    // The node resolves the ENS name server-side; the client never wraps it in a Reference.
    expect(downloadData).toHaveBeenCalledWith(ENS_NAME, undefined, undefined)
    expect(unmarshalFromDataSpy).toHaveBeenCalled()
    expect(unmarshalSpy).not.toHaveBeenCalled()
  })

  it('routes ENS around MantarayNode.unmarshal, which rejects ENS via new Reference()', async () => {
    // Reproduce real bee-js behaviour: unmarshal() wraps its input in new Reference(),
    // which throws on a non-hex (ENS) reference. loadManifest must still resolve because
    // it never calls unmarshal for ENS names.
    unmarshalSpy.mockRejectedValue(new Error('not a valid hex string'))

    await expect(loadManifest(beeApi, ENS_NAME)).resolves.toBeDefined()
    expect(unmarshalSpy).not.toHaveBeenCalled()
  })

  it('keeps using MantarayNode.unmarshal for a plain swarm hash', async () => {
    await expect(loadManifest(beeApi, VALID_HASH)).resolves.toBeDefined()

    expect(unmarshalSpy).toHaveBeenCalledWith(beeApi, VALID_HASH, undefined, undefined)
    expect(downloadData).not.toHaveBeenCalled()
  })
})
