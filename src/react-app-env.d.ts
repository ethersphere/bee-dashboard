/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

interface LatestBeeRelease {
  name: string
  html_url: string
}

interface SwarmMetadata {
  size?: number
  name: string
  type?: string
}

interface Metadata extends SwarmMetadata {
  type: string
  isWebsite?: boolean
  isVideo?: boolean
  isAudio?: boolean
  isImage?: boolean
  count?: number
  hash?: string
}

type FilePath = File & { path?: string; fullPath?: string }
