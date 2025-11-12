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
}

export function getExtensionFromName(name: string): string {
  return name.split('.').pop()?.toLowerCase() || ''
}

export function guessMime(name: string, mtdt?: Record<string, string> | undefined): string {
  const md = mtdt?.mimeType || mtdt?.mime || mtdt?.['content-type']

  if (md) return md

  const ext = getExtensionFromName(name)

  return EXT_TO_MIME[ext] || 'application/octet-stream'
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
