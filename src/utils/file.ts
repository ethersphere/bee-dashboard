import { isSupportedAudioType } from './audio'
import { isSupportedImageType } from './image'
import { isSupportedVideoType } from './video'

const indexHtmls = ['index.html', 'index.htm']

interface DetectedIndex {
  indexPath: string
  commonPrefix?: string
}

export function detectIndexHtml(files: FilePath[]): DetectedIndex | false {
  const paths = files.map(getPath)

  if (!paths.length) {
    return false
  }

  if (files.length === 1) {
    return false
  }

  const exactMatch = paths.find(x => indexHtmls.includes(x))

  if (exactMatch) {
    return { indexPath: exactMatch }
  }

  const sortedPaths = paths.sort((a, b) => a.localeCompare(b))
  const firstSegments = sortedPaths[0].split('/')
  const lastSegments = sortedPaths[sortedPaths.length - 1].split('/')
  let matchingSegments = 0

  for (; matchingSegments < firstSegments.length; matchingSegments++) {
    if (firstSegments[matchingSegments] !== lastSegments[matchingSegments]) {
      break
    }
  }

  const commonPrefix = firstSegments.slice(0, matchingSegments).join('/') + '/'

  const allStartWithSamePrefix = paths.every(x => x.startsWith(commonPrefix))

  if (allStartWithSamePrefix) {
    const match = paths.find(x => indexHtmls.map(y => commonPrefix + y).includes(x))

    if (match) {
      return { indexPath: match, commonPrefix }
    }
  }

  return false
}

export function getHumanReadableFileSize(bytes: number): string {
  const KB = 1000
  const MB = KB * 1000
  const GB = MB * 1000
  const TB = GB * 1000
  const PB = TB * 1000

  if (bytes >= PB) {
    return (bytes / PB).toFixed(2) + ' PB'
  }

  if (bytes >= TB) {
    return (bytes / TB).toFixed(2) + ' TB'
  }

  if (bytes >= GB) {
    return (bytes / GB).toFixed(2) + ' GB'
  }

  if (bytes >= MB) {
    return (bytes / MB).toFixed(2) + ' MB'
  }

  if (bytes >= KB) {
    return (bytes / KB).toFixed(2) + ' KB'
  }

  return bytes + ' bytes'
}

export function getAssetNameFromFiles(files: FilePath[]): string {
  if (files.length === 1) return files[0].name

  if (files.length > 0) {
    const prefix = getPath(files[0]).split('/')[0]

    // Only if all files have a common prefix we can use it as a folder name
    if (files.every(f => getPath(f).split('/')[0] === prefix)) return prefix
  }

  return 'unknown'
}

export function getMetadata(files: FilePath[]): Metadata {
  const size = files.reduce((total, item) => total + item.size, 0)
  const name = getAssetNameFromFiles(files)
  const type = files.length === 1 ? files[0].type : 'folder'
  const count = files.length
  const isWebsite = Boolean(detectIndexHtml(files))
  const isVideo = isSupportedVideoType(type)
  const isAudio = isSupportedAudioType(type)
  const isImage = isSupportedImageType(type)

  return { size, name, type, isWebsite, count, isVideo, isAudio, isImage }
}

export function getPath(file: FilePath): string {
  return (file.path || file.webkitRelativePath || file.name).replace(/^\//g, '') // remove the starting slash
}

/**
 * Utility function that is needed to have correct directory structure as webkitRelativePath is read only
 */
export function packageFile(file: FilePath, pathOverwrite?: string): FilePath {
  let path = pathOverwrite || getPath(file)

  if (!path.startsWith('/') && path.includes('/')) {
    path = `/${path}`
  }

  return {
    path: path,
    fullPath: path,
    webkitRelativePath: path,
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    type: file.type,
    stream: file.stream,
    slice: (start: number, end: number) => file.slice(start, end),
    text: file.text,
    arrayBuffer: async () => await file.arrayBuffer(),
    bytes: file.bytes,
  }
}

export function getExtensionFromName(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const hasExtension = name.includes('.') && ext && ext !== name

  return hasExtension ? ext : ''
}

const EXT_TO_MIME: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogv: 'video/ogg',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  txt: 'text/plain',
  md: 'text/markdown',
  json: 'application/json',
  csv: 'text/csv',
  html: 'text/html',
  htm: 'text/html',
  ico: 'image/vnd.microsoft.icon',
}

export function guessMime(name: string, mtdt?: Record<string, string> | undefined): { mime: string; ext: string } {
  const md = mtdt?.mimeType || mtdt?.mime || mtdt?.['content-type']
  const ext = getExtensionFromName(name)

  if (md) return { mime: md, ext }

  const mime = EXT_TO_MIME[ext] || 'application/octet-stream'

  return { mime, ext }
}

export type Viewer = {
  name: string
  test: (mime: string) => boolean
  render: (win: Window, url: string, mime: string, name: string) => void
}

const VIDEO_HTML = (u: string, title: string) =>
  `<html><head><meta charset="utf-8"/><title>${title}</title></head><body style="margin:0;background:#000">
    <video controls autoplay style="width:100%;height:100%" src="${u}"></video>
  </body></html>`

const AUDIO_HTML = (u: string, title: string) =>
  `<html><head><meta charset="utf-8"/><title>${title}</title></head><body>
    <audio controls autoplay style="width:100%" src="${u}"></audio>
  </body></html>`

const IMAGE_HTML = (u: string, title: string) =>
  `<html><head><meta charset="utf-8"/><title>${title}</title></head><body style="margin:0;background:#111;display:grid;place-items:center;min-height:100vh">
    <img style="max-width:100%;max-height:100vh" src="${u}" />
  </body></html>`

export const VIEWERS: Viewer[] = [
  {
    name: 'video',
    test: m => m.startsWith('video/'),
    render: (w, url, mime, name) => {
      w.document.write(VIDEO_HTML(url, name))
      w.document.title = name
    },
  },
  {
    name: 'audio',
    test: m => m.startsWith('audio/'),
    render: (w, url, mime, name) => {
      w.document.write(AUDIO_HTML(url, name))
      w.document.title = name
    },
  },
  {
    name: 'image',
    test: m => m.startsWith('image/'),
    render: (w, url, mime, name) => {
      w.document.write(IMAGE_HTML(url, name))
      w.document.title = name
    },
  },
  {
    name: 'pdf',
    test: m => m === 'application/pdf',
    render: (w, url, mime, name) => {
      w.document.title = name
      w.location.href = url
    },
  },
  {
    name: 'html',
    test: m => m === 'text/html',
    render: (w, url, mime, name) => {
      w.document.title = name
      w.location.href = url
    },
  },
  {
    name: 'text-like',
    test: m => m.startsWith('text/') || m === 'application/json' || m === 'text/markdown',
    render: (w, url, mime, name) => {
      w.document.title = name
      w.location.href = url
    },
  },
]
