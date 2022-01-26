/// <reference types="react-scripts" />

interface LatestBeeRelease {
  name: string
  html_url: string
}

interface StatusHookCommon {
  isOk: boolean
}

interface StatusNodeVersionHook extends StatusHookCommon {
  userVersion?: string
  latestVersion?: string
  latestUrl: string
  isLatestBeeVersion: boolean
}
interface StatusEthereumConnectionHook extends StatusHookCommon {
  nodeAddresses: NodeAddresses | null
}
interface StatusTopologyHook extends StatusHookCommon {
  topology: Topology | null
}

interface SwarmMetadata {
  size: number
  name: string
  type?: string
}

interface Metadata extends SwarmMetadata {
  type: string
  isWebsite: boolean
  count?: number
  hash?: string
}

type FilePath = File & { path?: string; fullPath?: string }
