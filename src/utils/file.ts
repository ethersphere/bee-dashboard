import { Bee, Bytes, PostageBatch } from '@ethersphere/bee-js'
import { isSupportedImageType } from './image'
import { isSupportedVideoType } from './video'
import { FileInfo, FileManager } from '@solarpunkltd/file-manager-lib'
import { FileTypes } from '../constants'

const indexHtmls = ['index.html', 'index.htm']

interface DetectedIndex {
  indexPath: string
  commonPrefix?: string
}

interface FilePath extends Omit<File, 'bytes'> {
  bytes?: Uint8Array
  path?: string
  fullPath?: string
  webkitRelativePath: string
}

export function detectIndexHtml(files: FilePath[]): DetectedIndex | false {
  const paths = files.map(getPath)

  if (!paths.length) {
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
  if (bytes >= 1e15) {
    return (bytes / 1e15).toFixed(2) + ' PB'
  }

  if (bytes >= 1e12) {
    return (bytes / 1e12).toFixed(2) + ' TB'
  }

  if (bytes >= 1e9) {
    return (bytes / 1e9).toFixed(2) + ' GB'
  }

  if (bytes >= 1e6) {
    return (bytes / 1e6).toFixed(2) + ' MB'
  }

  if (bytes >= 1e3) {
    return (bytes / 1e3).toFixed(2) + ' kB'
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
  const isImage = isSupportedImageType(type)

  return { size, name, type, isWebsite, count, isVideo, isImage }
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
    // bytes: file.bytes, // recently added
    webkitRelativePath: path,
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    type: file.type,
    stream: file.stream,
    slice: (start: number, end: number) => file.slice(start, end),
    text: file.text,
    arrayBuffer: async () => await file.arrayBuffer(),
  }
}

export function getFileType(input: string): string {
  const index = input.indexOf('/')

  const type = index !== -1 ? input.substring(0, index) : input
  const fileTypes = Object.values(FileTypes)

  if (fileTypes.includes(type as FileTypes)) {
    return type
  }

  return 'other'
}

export const fromBytesConversion = (size: number, metric: string) => {
  switch (metric) {
    case 'GB':
      return size / 1000 / 1000 / 1000
    case 'MB':
      return size / 1000 / 1000
    default:
      return 0
  }
}

export const sizeToBytes = (size: number, metric: string) => {
  switch (metric) {
    case 'GB':
      return size * 1000 * 1000 * 1000
    case 'MB':
      return size * 1000 * 1000
    default:
      return 0
  }
}

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export const startDownloadingQueue = async (filemanager: FileManager, fileInfoList: FileInfo[]): Promise<void> => {
  try {
    const dataPromises: Promise<Bytes[]>[] = []
    for (const infoItem of fileInfoList) {
      dataPromises.push(
        filemanager.download(infoItem, undefined, {
          actPublisher: infoItem.actPublisher.toString(),
          actHistoryAddress: infoItem.file.historyRef.toString(),
        }),
      )
    }

    await Promise.allSettled(dataPromises).then(results => {
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          if (result.value.length !== 0) {
            downloadToDisk(result.value[0], 'todo_dummy_name', undefined)
          }
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to dowload file: ', result.reason)
        }
      })
    })
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error downloading file with: ', error)
  }
}

async function downloadToDisk(data: Bytes, fileName: string, mimeType = 'application/octet-stream'): Promise<void> {
  const uint8Array = data.toUint8Array()
  const blob = new Blob([uint8Array], { type: mimeType })

  try {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: 'File',
          accept: {
            [mimeType]: [`.${fileName.split('.').pop()}`],
          },
        },
      ],
    })
    const writable = await handle.createWritable()
    await writable.write(blob)
    await writable.close()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return
    }
    // Fallback for browsers that do not support the File System Access API
    downloadFileFallback(blob, fileName, mimeType)
  }
}

function downloadFileFallback(blob: Blob, fileName: string, mimeType = 'application/octet-stream') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const getUsableStamps = async (bee: Bee | null): Promise<PostageBatch[]> => {
  if (!bee) {
    return []
  }
  try {
    return (await bee.getAllPostageBatch())
      .filter(s => s.usable)
      .sort((a, b) => (a.label || '').localeCompare(b.label || ''))
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error getting usable stamps: ', error)

    return []
  }
}
