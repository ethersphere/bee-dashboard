import { FileInfo, FileManager } from '@solarpunkltd/file-manager-lib'
import { getExtensionFromName, guessMime, VIEWERS } from './view'
import { AbortManager } from './abortManager'
import { DownloadProgress, DownloadState } from '../constants/transfers'

const downloadAborts = new AbortManager()

enum Errors {
  AbortError = 'AbortError',
  NotAllowedError = 'NotAllowedError',
  SecurityError = 'SecurityError',
}

export function createDownloadAbort(name: string): void {
  downloadAborts.create(name)
}

export function abortDownload(name: string): void {
  downloadAborts.abort(name)
}

const processStream = async (
  stream: ReadableStream<Uint8Array>,
  fileHandle: FileSystemFileHandle,
  onDownloadProgress?: (progress: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<void> => {
  const reader = stream.getReader()
  let writable: WritableStreamDefaultWriter<Uint8Array> | undefined
  let progress = 0

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writable = (await (fileHandle as any).createWritable()) as WritableStreamDefaultWriter<Uint8Array>

    let done = false
    while (!done) {
      if (signal?.aborted) throw new DOMException('Aborted', Errors.AbortError)

      const { value, done: streamDone } = await reader.read()

      if (value) {
        await writable.write(value)
        progress += value.length
      }
      done = streamDone

      onDownloadProgress?.({ progress, isDownloading: !done })
    }
  } catch (e: unknown) {
    if ((e as { name?: string }).name === Errors.AbortError) {
      onDownloadProgress?.({ progress, isDownloading: false, state: DownloadState.Cancelled })

      return
    }

    onDownloadProgress?.({ progress, isDownloading: false, state: DownloadState.Error })
    // eslint-disable-next-line no-console
    console.error('Failed to process stream: ', e)
  } finally {
    reader.releaseLock()

    try {
      if (signal?.aborted) {
        await writable?.abort()
      } else {
        await writable?.close()
      }
    } catch {
      /* no-op */
    }
  }
}

const streamToBlob = async (
  stream: ReadableStream<Uint8Array>,
  mimeType: string,
  onDownloadProgress?: (dp: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<Blob | undefined> => {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let progress = 0

  try {
    let done = false

    while (!done) {
      if (signal?.aborted) throw new DOMException('Aborted', Errors.AbortError)

      const { value, done: streamDone } = await reader.read()

      if (value) {
        chunks.push(value)
        progress += value.length
      }
      done = streamDone
      onDownloadProgress?.({ progress, isDownloading: !done })
    }
  } catch (error: unknown) {
    if ((error as { name?: string }).name === Errors.AbortError) {
      onDownloadProgress?.({ progress, isDownloading: false, state: DownloadState.Cancelled })
    } else {
      onDownloadProgress?.({ progress, isDownloading: false, state: DownloadState.Error })
      // eslint-disable-next-line no-console
      console.error('Error during stream processing: ', error)
    }

    return
  } finally {
    reader.releaseLock()
  }

  const combined = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0))
  let offset = 0
  for (const c of chunks) {
    combined.set(c, offset)
    offset += c.length
  }

  return new Blob([combined], { type: mimeType })
}

interface FileInfoWithHandle {
  info: FileInfo
  handle?: FileSystemFileHandle
  cancelled?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPickerSupported = (): boolean => typeof (window as any).showSaveFilePicker === 'function'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDirectoryPickerSupported = (): boolean => typeof (window as any).showDirectoryPicker === 'function'

const isUserCancellation = (error: unknown): boolean => {
  const errName = (error as { name?: string })?.name

  return errName === Errors.AbortError || errName === Errors.NotAllowedError || errName === Errors.SecurityError
}

const getSingleFileHandle = async (
  info: FileInfo,
  defaultDownloadFolder: string,
): Promise<FileInfoWithHandle[] | undefined> => {
  const mimeType = guessMime(info.name, info.customMetadata)

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handle = (await (window as any).showSaveFilePicker({
      suggestedName: info.name,
      startIn: defaultDownloadFolder,
      types: [{ accept: { [mimeType]: [`.${getExtensionFromName(info.name)}`] } }],
    })) as FileSystemFileHandle

    return [{ info, handle }]
  } catch (error: unknown) {
    return isUserCancellation(error) ? [{ info, cancelled: true }] : undefined
  }
}

const getMultipleFileHandles = async (
  infoList: FileInfo[],
  defaultDownloadFolder: string,
): Promise<FileInfoWithHandle[] | undefined> => {
  if (!isDirectoryPickerSupported()) {
    const handles: FileInfoWithHandle[] = []

    for (const info of infoList) {
      const result = await getSingleFileHandle(info, defaultDownloadFolder)

      if (!result) return undefined
      handles.push(result[0])
    }

    return handles
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dirHandle = (await (window as any).showDirectoryPicker({
      mode: 'readwrite',
      startIn: defaultDownloadFolder,
    })) as FileSystemDirectoryHandle

    const handles: FileInfoWithHandle[] = []

    for (const info of infoList) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileHandle = (await (dirHandle as any).getFileHandle(info.name, {
          create: true,
        })) as FileSystemFileHandle

        handles.push({ info, handle: fileHandle })
      } catch (error: unknown) {
        // eslint-disable-next-line no-console
        console.error(`Failed to create file handle for ${info.name}:`, error)
        handles.push({ info, cancelled: true })
      }
    }

    return handles
  } catch (error: unknown) {
    return isUserCancellation(error) ? infoList.map(info => ({ info, cancelled: true })) : undefined
  }
}

const getFileHandles = (infoList: FileInfo[]): Promise<FileInfoWithHandle[] | undefined> => {
  const defaultDownloadFolder = 'downloads'

  if (!isPickerSupported()) return Promise.resolve(infoList.map(info => ({ info })))

  if (infoList.length === 1) {
    return getSingleFileHandle(infoList[0], defaultDownloadFolder)
  }

  return getMultipleFileHandles(infoList, defaultDownloadFolder)
}

const downloadToDisk = async (
  streams: ReadableStream<Uint8Array>[],
  handle: FileSystemFileHandle,
  onDownloadProgress?: (progress: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<void> => {
  try {
    for (const stream of streams) {
      await processStream(stream, handle, onDownloadProgress, signal)
    }
  } catch (error: unknown) {
    if ((error as { name?: string }).name !== Errors.AbortError) {
      // eslint-disable-next-line no-console
      console.error('Error during download to disk: ', error)
    }
  }
}

const downloadToBlob = async (
  streams: ReadableStream<Uint8Array>[],
  info: FileInfo,
  onDownloadProgress?: (progress: DownloadProgress) => void,
  isOpenWindow?: boolean,
  signal?: AbortSignal,
): Promise<void> => {
  try {
    for (const stream of streams) {
      const mime = guessMime(info.name, info.customMetadata)
      const blob = await streamToBlob(stream, mime, onDownloadProgress, signal)

      if (blob) {
        const url = URL.createObjectURL(blob)
        let opened = false

        if (isOpenWindow) {
          opened = openNewWindow(info.name, mime, url)
        }

        if (!opened) {
          downloadFromUrl(url, info.name)
        }
      }
    }
  } catch (error: unknown) {
    if ((error as { name?: string }).name !== Errors.AbortError) {
      // eslint-disable-next-line no-console
      console.error('Error during download and open: ', error)
    }
  }
}

const openNewWindow = (name: string, mime: string, url: string): boolean => {
  const viewer = VIEWERS.find(v => v.test(mime))
  const win = window.open('', '_blank')

  if (viewer && win) {
    viewer.render(win, url, mime, name)

    return true
  }

  win?.close()

  return false
}

const downloadFromUrl = (url: string, fileName: string): void => {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const startDownloadingQueue = async (
  fm: FileManager,
  infoList: FileInfo[],
  trackers?: Array<(progress: DownloadProgress) => void>,
  isOpenWindow?: boolean,
): Promise<void> => {
  if (!infoList.length || (trackers && trackers.length !== infoList.length)) return

  try {
    const fileHandles: FileInfoWithHandle[] | undefined = isOpenWindow
      ? infoList.map(info => ({ info }))
      : await getFileHandles(infoList)

    if (!fileHandles) return

    await Promise.all(
      fileHandles.map(async (fh, i) => {
        const name = fh.info.name
        const tracker = trackers ? trackers[i] : undefined

        createDownloadAbort(name)
        const signal = downloadAborts.getSignal(name)

        try {
          if (fh.cancelled) {
            tracker?.({ progress: 0, isDownloading: false, state: DownloadState.Cancelled })
          } else {
            const dataStreams = (await fm.download(fh.info)) as ReadableStream<Uint8Array>[]

            if (isOpenWindow || !fh.handle) {
              await downloadToBlob(dataStreams, fh.info, tracker, isOpenWindow, signal)
            } else {
              await downloadToDisk(dataStreams, fh.handle, tracker, signal)
            }

            // Ensure the tracker shows completion
            if (tracker) {
              const size = fh.info.customMetadata?.size
              const finalProgress = size ? Number(size) : 0

              tracker({ progress: finalProgress, isDownloading: false })
            }
          }
        } catch (error: unknown) {
          const isAbortError = (error as { name?: string }).name === Errors.AbortError

          // Ensure the tracker shows completion
          if (!isAbortError) {
            tracker?.({ progress: 0, isDownloading: false, state: DownloadState.Error })
          } else {
            tracker?.({ progress: 0, isDownloading: false, state: DownloadState.Cancelled })
          }
        } finally {
          downloadAborts.abort(name)
        }
      }),
    )
  } catch (error: unknown) {
    // Errors are handled per-file in the map above
  }
}
