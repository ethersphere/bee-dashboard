import { Bee, Utils } from '@ethersphere/bee-js'
import { MantarayNode, MetadataMapping, Reference, loadAllNodes } from 'mantaray-js'

interface ValueNode extends MantarayNode {
  getEntry: Reference
}

/**
 * The ASCII code of the character `/`.
 *
 * This prefix of the root node holds metadata such as the index document.
 */
const INDEX_DOCUMENT_FORK_PREFIX = '47'

export class ManifestJs {
  private bee: Bee

  constructor(bee: Bee) {
    this.bee = bee
  }

  /**
   * Tests whether a given Swarm hash is a valid mantaray manifest
   */
  public async isManifest(hash: string): Promise<boolean> {
    try {
      const data = await this.bee.downloadData(hash)
      const node = new MantarayNode()
      node.deserialize(data)

      return true
    } catch {
      return false
    }
  }

  /**
   * Retrieves `website-index-document` from a Swarm hash, or `null` if it is not present
   */
  public async getIndexDocumentPath(hash: string): Promise<string | null> {
    const metadata = await this.getRootSlashMetadata(hash)

    if (!metadata) {
      return null
    }

    return metadata['website-index-document'] || null
  }

  /**
   * Retrieves all paths with the associated hashes from a Swarm manifest
   */
  public async getHashes(hash: string): Promise<Record<string, string>> {
    const data = await this.bee.downloadData(hash)
    const node = new MantarayNode()
    node.deserialize(data)
    await loadAllNodes(this.load.bind(this), node)
    const result = {}
    this.extractHashes(result, node)

    return result
  }

  /**
   * Resolves an arbitrary Swarm feed manifest to its latest update reference.
   * @returns `/bzz` root manifest hash, or `Promise<null>` if hash is not a feed manifest
   * @throws in case of network errors or bad input
   */
  public async resolveFeedManifest(hash: string): Promise<string | null> {
    const metadata = await this.getRootSlashMetadata(hash)

    if (!metadata) {
      return null
    }

    const owner = metadata['swarm-feed-owner']
    const topic = metadata['swarm-feed-topic']

    if (!owner || !topic) {
      return null
    }

    const reader = this.bee.makeFeedReader('sequence', topic, owner)
    const response = await reader.download()

    return response.reference
  }

  private async getRootSlashMetadata(hash: string): Promise<MetadataMapping | null> {
    const data = await this.bee.downloadData(hash)
    const node = new MantarayNode()
    node.deserialize(data)

    if (!node.forks) {
      return null
    }
    const fork = node.forks[INDEX_DOCUMENT_FORK_PREFIX]

    if (!fork) {
      return null
    }
    const metadataNode = fork.node

    if (!metadataNode.IsWithMetadataType()) {
      return null
    }
    const metadata = metadataNode.getMetadata

    if (!metadata) {
      return null
    }

    return metadata
  }

  private extractHashes(result: Record<string, string>, node: MantarayNode, prefix = ''): void {
    if (!node.forks) {
      return
    }
    for (const fork of Object.values(node.forks)) {
      const path = prefix + this.bytesToUtf8(fork.prefix)
      const childNode = fork.node

      if (this.isValueNode(childNode, path)) {
        result[path] = Utils.bytesToHex(childNode.getEntry)
      }

      if (childNode.isEdgeType()) {
        this.extractHashes(result, childNode, path)
      }
    }
  }

  private load(reference: Uint8Array) {
    return this.bee.downloadData(Utils.bytesToHex(reference))
  }

  private bytesToUtf8(bytes: Uint8Array): string {
    return new TextDecoder('utf-8').decode(bytes)
  }

  private isValueNode(node: MantarayNode, path: string): node is ValueNode {
    return !this.isRootSlash(node, path) && node.isValueType() && typeof node.getEntry !== 'undefined'
  }

  private isRootSlash(node: MantarayNode, path: string): boolean {
    return path === '/' && node.IsWithMetadataType()
  }
}
