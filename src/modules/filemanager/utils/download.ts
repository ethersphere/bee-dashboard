import { FileInfo, FileManager } from '@solarpunkltd/file-manager-lib'

import { guessMime, VIEWERS } from '../../../utils/file'
import { DownloadProgress, DownloadState } from '../constants/transfers'

import { AbortManager } from './abortManager'
import { isDirectoryPickerSupported, isPickerSupported } from './fileOperations'

const DefaultDownloadFolder = 'downloads'

const downloadAborts = new AbortManager()

enum Errors {
  AbortError = 'AbortError',
  NotAllowedError = 'NotAllowedError',
  SecurityError = 'SecurityError',
}

export function createDownloadAbort(id: string): void {
  downloadAborts.create(id)
}

export function abortDownload(id: string): void {
  downloadAborts.abort(id)
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
    const isAbort = (e as { name?: string }).name === Errors.AbortError

    if (isAbort) {
      onDownloadProgress?.({ progress, isDownloading: false, state: DownloadState.Cancelled })
    } else {
      onDownloadProgress?.({ progress, isDownloading: false, state: DownloadState.Error })

      // eslint-disable-next-line no-console
      console.error('Failed to process stream: ', e)
    }

    throw e
  } finally {
    reader.releaseLock()

    try {
      if (signal?.aborted) {
        await writable?.abort()
      } else {
        await writable?.close()
      }
    } catch (e: unknown) {
      /* no-op */

      // eslint-disable-next-line no-console
      console.error('filehandle close/abort error: ', e)
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

export interface FileInfoWithUUID {
  uuid: string
  info: FileInfo
}

interface FileInfoWithHandle {
  infoWithId: FileInfoWithUUID
  handle?: FileSystemFileHandle
  cancelled?: boolean
}

const isUserCancellation = (error: unknown): boolean => {
  const errName = (error as { name?: string })?.name

  return errName === Errors.AbortError || errName === Errors.NotAllowedError || errName === Errors.SecurityError
}

const getSingleFileHandle = async (infoWithId: FileInfoWithUUID): Promise<FileInfoWithHandle | undefined> => {
  const { mime, ext } = guessMime(infoWithId.info.name, infoWithId.info.customMetadata)

  const pickerOptions: {
    suggestedName: string
    startIn: string
    types?: Array<{ accept: Record<string, string[]> }>
  } = {
    suggestedName: infoWithId.info.name,
    startIn: DefaultDownloadFolder,
  }

  if (ext) {
    pickerOptions.types = [{ accept: { [mime]: [`.${ext}`] } }]
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handle = (await (window as any).showSaveFilePicker(pickerOptions)) as FileSystemFileHandle

    return { infoWithId, handle }
  } catch (error: unknown) {
    return isUserCancellation(error) ? { infoWithId, cancelled: true } : undefined
  }
}

const getMultipleFileHandles = async (
  infoWithIdList: FileInfoWithUUID[],
): Promise<FileInfoWithHandle[] | undefined> => {
  if (!isDirectoryPickerSupported()) {
    const handles: FileInfoWithHandle[] = []

    for (const info of infoWithIdList) {
      const result = await getSingleFileHandle(info)

      if (!result) return undefined

      handles.push(result)
    }

    return handles
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dirHandle = (await (window as any).showDirectoryPicker({
      mode: 'readwrite',
      startIn: DefaultDownloadFolder,
    })) as FileSystemDirectoryHandle

    const handles: FileInfoWithHandle[] = []

    for (const infoWithId of infoWithIdList) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileHandle = (await (dirHandle as any).getFileHandle(infoWithId.info.name, {
          create: true,
        })) as FileSystemFileHandle

        handles.push({ infoWithId, handle: fileHandle })
      } catch (error: unknown) {
        // eslint-disable-next-line no-console
        console.error(`Failed to create file handle for ${infoWithId.info.name}:`, error)
        handles.push({ infoWithId, cancelled: true })
      }
    }

    return handles
  } catch (error: unknown) {
    return isUserCancellation(error) ? infoWithIdList.map(infoWithId => ({ infoWithId, cancelled: true })) : undefined
  }
}

const getFileHandles = async (infoWithIdList: FileInfoWithUUID[]): Promise<FileInfoWithHandle[] | undefined> => {
  if (!isPickerSupported()) return Promise.resolve(infoWithIdList.map(infoWithId => ({ infoWithId })))

  if (infoWithIdList.length === 1) {
    const fh = await getSingleFileHandle(infoWithIdList[0])

    return fh ? [fh] : undefined
  }

  return getMultipleFileHandles(infoWithIdList)
}

const downloadToDisk = async (
  streams: ReadableStream<Uint8Array>[],
  handle: FileSystemFileHandle,
  onDownloadProgress?: (progress: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<boolean> => {
  try {
    for (const stream of streams) {
      await processStream(stream, handle, onDownloadProgress, signal)
    }

    return true
  } catch (error: unknown) {
    if ((error as { name?: string }).name !== Errors.AbortError) {
      // eslint-disable-next-line no-console
      console.error('Error during download to disk: ', error)
    }

    return false
  }
}

interface BlobDownloadResult {
  success: boolean
  cancelled: boolean
}

const downloadToBlob = async (
  streams: ReadableStream<Uint8Array>[],
  info: FileInfo,
  onDownloadProgress?: (progress: DownloadProgress) => void,
  isOpenWindow?: boolean,
  signal?: AbortSignal,
): Promise<BlobDownloadResult> => {
  try {
    for (const stream of streams) {
      const { mime } = guessMime(info.name, info.customMetadata)
      const blob = await streamToBlob(stream, mime, onDownloadProgress, signal)

      if (!blob) {
        return { success: false, cancelled: false }
      }

      const url = URL.createObjectURL(blob)
      let opened = false

      if (isOpenWindow) {
        opened = openNewWindow(info.name, mime, url)
      }

      if (!opened) {
        if (isOpenWindow && isPickerSupported()) {
          const result = await saveBlobWithPicker(blob, info, onDownloadProgress, signal)
          URL.revokeObjectURL(url)

          return result
        }

        downloadFromUrl(url, info.name)
      }
    }

    return { success: true, cancelled: false }
  } catch (error: unknown) {
    if ((error as { name?: string }).name !== Errors.AbortError) {
      // eslint-disable-next-line no-console
      console.error('Error during download and open: ', error)
    }

    return { success: false, cancelled: false }
  }
}

const openNewWindow = (name: string, mime: string, url: string): boolean => {
  const viewer = VIEWERS.find(v => v.test(mime))

  if (!viewer) return false

  const win = window.open('', '_blank')

  if (!win) return false

  try {
    viewer.render(win, url, mime, name)
  } catch (err: unknown) {
    win.close()
    // eslint-disable-next-line no-console
    console.error('Failed to render file in a new window: ', err)

    return false
  }

  return true
}

const saveBlobWithPicker = async (
  blob: Blob,
  info: FileInfo,
  onDownloadProgress?: (progress: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<BlobDownloadResult> => {
  const infoWithId: FileInfoWithUUID = { uuid: '', info }

  try {
    if (signal?.aborted) {
      throw new DOMException('Aborted', Errors.AbortError)
    }

    const fh = await getSingleFileHandle(infoWithId)

    if (!fh || !fh.handle) {
      return { success: false, cancelled: false }
    }

    if (fh.cancelled) {
      return { success: false, cancelled: true }
    }

    await processStream(blob.stream(), fh.handle, onDownloadProgress, signal)

    return { success: true, cancelled: false }
  } catch (err: unknown) {
    if (isUserCancellation(err)) {
      return { success: false, cancelled: true }
    }

    // eslint-disable-next-line no-console
    console.error('Failed to save blob using file picker: ', err)

    return { success: false, cancelled: false }
  }
}

const RevokeUrlTimeout = 1000

const downloadFromUrl = (url: string, fileName: string): void => {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  window.setTimeout(() => window.URL.revokeObjectURL(url), RevokeUrlTimeout)
  document.body.removeChild(a)
}

export const startDownloadingQueue = async (
  fm: FileManager,
  infoListWithIds: FileInfoWithUUID[],
  trackers: Array<(progress: DownloadProgress) => void>,
  isOpenWindow?: boolean,
): Promise<void> => {
  if (!infoListWithIds.length || (trackers && trackers.length !== infoListWithIds.length)) return

  try {
    const fileHandles: FileInfoWithHandle[] | undefined = isOpenWindow
      ? infoListWithIds.map(infoWithId => ({ infoWithId }))
      : await getFileHandles(infoListWithIds)

    if (!fileHandles) return

    await Promise.all(
      fileHandles.map(async (fh, i) => {
        const tracker = trackers[i]

        const uuid = fh.infoWithId.uuid
        createDownloadAbort(uuid)
        const signal = downloadAborts.getSignal(uuid)

        try {
          if (fh.cancelled) {
            tracker({ progress: 0, isDownloading: false, state: DownloadState.Cancelled })

            return
          }

          const dataStreams = (await fm.download(fh.infoWithId.info, undefined, undefined, {
            signal,
          })) as ReadableStream<Uint8Array>[]

          if (!dataStreams || dataStreams.length === 0) {
            // eslint-disable-next-line no-console
            console.error(`No data streams returned for ${fh.infoWithId.info.name}`)
            tracker({ progress: 0, isDownloading: false, state: DownloadState.Error })

            return
          }

          let success = false
          let userCancelled = false

          if (isOpenWindow || !fh.handle) {
            const { success: saved, cancelled } = await downloadToBlob(
              dataStreams,
              fh.infoWithId.info,
              tracker,
              isOpenWindow,
              signal,
            )

            success = saved
            userCancelled = cancelled
          } else {
            success = await downloadToDisk(dataStreams, fh.handle, tracker, signal)
          }

          if (success) {
            const size = fh.infoWithId.info.customMetadata?.size
            const finalProgress = size ? Number(size) : 0
            tracker({ progress: finalProgress, isDownloading: false })

            return
          }

          if (!signal?.aborted) {
            tracker({
              progress: 0,
              isDownloading: false,
              state: userCancelled ? DownloadState.Cancelled : DownloadState.Error,
            })
          }
        } catch (error: unknown) {
          const isAbortError = (error as { name?: string }).name === Errors.AbortError

          if (!isAbortError) {
            tracker({ progress: 0, isDownloading: false, state: DownloadState.Error })

            // eslint-disable-next-line no-console
            console.error('download queue error: ', error)
          } else {
            tracker({ progress: 0, isDownloading: false, state: DownloadState.Cancelled })
          }
        } finally {
          downloadAborts.abort(uuid)
        }
      }),
    )
  } catch (e: unknown) {
    // eslint-disable-next-line no-console
    console.error('An error happened in the download queue: ', e)
  }
}
