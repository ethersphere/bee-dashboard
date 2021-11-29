import { FileData } from '@ethersphere/bee-js'
import { SwarmFile } from './SwarmFile'

const indexHtmls = ['index.html', 'index.htm']

export function detectIndexHtml(files: SwarmFile[]): string | false {
  if (!files.length) {
    return false
  }

  const exactMatch = files.find(x => indexHtmls.includes(x.path))

  if (exactMatch) {
    return exactMatch.name
  }

  const prefix = files[0].path.split('/')[0] + '/'

  const allStartWithSamePrefix = files.every(x => x.path.startsWith(prefix))

  if (allStartWithSamePrefix) {
    const match = files.find(x => indexHtmls.map(y => prefix + y).includes(x.path))

    if (match) {
      return match.name
    }
  }

  return false
}

export function getHumanReadableFileSize(bytes: number): string {
  if (bytes >= 1e6) {
    return (bytes / 1e6).toFixed(2) + ' MB'
  }

  if (bytes >= 1e3) {
    return (bytes / 1e3).toFixed(2) + ' kB'
  }

  return bytes + ' bytes'
}

export function convertBeeFileToBrowserFile(file: FileData<ArrayBuffer>): Partial<File> {
  return {
    name: file.name,
    size: file.data.byteLength,
    type: file.contentType,
    arrayBuffer: () => new Promise(resolve => resolve(file.data)),
  }
}

export function convertManifestToFiles(files: Record<string, string>): SwarmFile[] {
  return Object.entries(files).map(
    x =>
      ({
        name: x[0],
        path: x[0],
        type: 'n/a',
        size: 0,
        webkitRelativePath: x[0],
        arrayBuffer: () => new Promise(resolve => resolve(new ArrayBuffer(0))),
      } as SwarmFile),
  )
}
