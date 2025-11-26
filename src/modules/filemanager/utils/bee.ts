import { BatchId, Bee, BZZ, Duration, PostageBatch, RedundancyLevel, Size } from '@ethersphere/bee-js'
import { FileManagerBase, DriveInfo, FileInfo } from '@solarpunkltd/file-manager-lib'
import { getHumanReadableFileSize } from '../../../utils/file'

export const getUsableStamps = async (bee: Bee | null): Promise<PostageBatch[]> => {
  if (!bee) {
    return []
  }

  try {
    return (await bee.getPostageBatches())
      .filter(s => s.usable)
      .sort((a, b) => (a.label || '').localeCompare(b.label || ''))
  } catch {
    return []
  }
}

export const fmGetStorageCost = async (
  capacity: number,
  validityEndDate: Date,
  encryption: boolean,
  erasureCodeLevel: RedundancyLevel,
  beeApi: Bee | null,
): Promise<BZZ | undefined> => {
  try {
    if (Size.fromBytes(capacity).toGigabytes() >= 0 && validityEndDate.getTime() >= new Date().getTime()) {
      const cost = await beeApi?.getStorageCost(
        Size.fromBytes(capacity),
        Duration.fromEndDate(validityEndDate),
        undefined,
        encryption,
        erasureCodeLevel,
      )

      return cost
    }

    return undefined
  } catch (e) {
    return undefined
  }
}

export const fmFetchCost = async (
  capacity: number,
  validityEndDate: Date,
  encryption: boolean,
  erasureCodeLevel: RedundancyLevel,
  beeApi: Bee | null,
  setCost: (cost: BZZ) => void,
  currentFetch: React.MutableRefObject<Promise<void> | null>,
) => {
  if (currentFetch.current) {
    await currentFetch.current
  }

  let isCurrentFetch = true

  const fetchPromise = (async () => {
    const cost = await fmGetStorageCost(capacity, validityEndDate, encryption, erasureCodeLevel, beeApi)

    if (isCurrentFetch) {
      setCost(cost ?? BZZ.fromDecimalString('0'))
    }
  })()

  currentFetch.current = fetchPromise
  await fetchPromise

  isCurrentFetch = false
  currentFetch.current = null
}

export const handleCreateDrive = async (
  beeApi: Bee | null,
  fm: FileManagerBase | null,
  size: Size,
  duration: Duration,
  label: string,
  encryption: boolean,
  erasureCodeLevel: RedundancyLevel,
  isAdmin: boolean,
  resetState: boolean,
  existingBatch: PostageBatch | null,
  onSuccess?: () => void,
  onError?: (error: unknown) => void,
): Promise<void> => {
  if (!beeApi || !fm) return

  try {
    let batchId: BatchId

    if (!existingBatch) {
      batchId = await beeApi.buyStorage(size, duration, { label }, undefined, encryption, erasureCodeLevel)
    } else {
      batchId = existingBatch.batchID
    }

    await fm.createDrive(batchId, label, isAdmin, erasureCodeLevel, resetState)

    onSuccess?.()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error creating drive:', e instanceof Error ? e.message : String(e))
    onError?.(e)
  }
}

interface StampCapacityMetrics {
  capacityPct: number
  usedSize: string
  totalSize: string
  usedBytes: number
  totalBytes: number
  remainingBytes: number
}

export const calculateStampCapacityMetrics = (
  stamp: PostageBatch | null,
  drive?: DriveInfo | null,
  files?: FileInfo[],
): StampCapacityMetrics => {
  if (!stamp) {
    return {
      capacityPct: 0,
      usedSize: '—',
      totalSize: '—',
      usedBytes: 0,
      totalBytes: 0,
      remainingBytes: 0,
    }
  }

  let usedBytes = 0
  let totalBytes = 0
  let capacityPct = 0
  let remainingBytes = 0

  if (drive) {
    totalBytes = stamp.calculateSize(false, drive.redundancyLevel).toBytes()

    if (files) {
      usedBytes = files
        ?.filter(file => file.driveId === drive?.id)
        .map(file => Number(file.customMetadata?.size || 0))
        .reduce((acc, current) => acc + current, 0)

      remainingBytes = totalBytes - usedBytes
    } else {
      remainingBytes = stamp.calculateRemainingSize(false, drive.redundancyLevel).toBytes()
      usedBytes = totalBytes - remainingBytes
    }
    capacityPct = ((totalBytes - remainingBytes) / totalBytes) * 100
  } else {
    capacityPct = stamp.usage * 100
    usedBytes = stamp.size.toBytes() - stamp.remainingSize.toBytes()
    totalBytes = stamp.size.toBytes()
    remainingBytes = totalBytes - usedBytes
  }

  const usedSize = getHumanReadableFileSize(usedBytes)
  const totalSize = getHumanReadableFileSize(totalBytes)

  return {
    capacityPct,
    usedSize,
    totalSize,
    usedBytes,
    totalBytes,
    remainingBytes,
  }
}

export const handleDestroyDrive = async (
  beeApi: Bee | null,
  fm: FileManagerBase | null,
  drive: DriveInfo,
  onSuccess?: () => void,
  onError?: (error: unknown) => void,
): Promise<void> => {
  if (!beeApi || !fm) {
    return
  }

  try {
    const stamp = (await getUsableStamps(beeApi)).find(s => s.batchID.toString() === drive.batchId.toString())

    if (!stamp) {
      throw new Error(`Postage stamp (${drive.batchId}) for the current drive (${drive.name}) not found`)
    }

    const ttlDays = stamp.duration.toDays()

    if (ttlDays <= 2) {
      // eslint-disable-next-line no-console
      console.warn(`Stamp TTL ${ttlDays} <= 2 days, skipping drive destruction: forgetting the drive.`)
      await fm.forgetDrive(drive)

      return
    }

    await fm.destroyDrive(drive, stamp)

    onSuccess?.()
  } catch (e) {
    onError?.(e)
  }
}

export const handleForgetDrive = async (
  fm: FileManagerBase | null,
  drive: DriveInfo,
  onSuccess?: () => void,
  onError?: (error: unknown) => void,
): Promise<void> => {
  if (!fm) return

  try {
    await fm.forgetDrive(drive)
    onSuccess?.()
  } catch (e) {
    onError?.(e)
  }
}
