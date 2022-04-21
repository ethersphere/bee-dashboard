/// <reference types="react-scripts" />

interface LatestBeeRelease {
  name: string
  html_url: string
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
