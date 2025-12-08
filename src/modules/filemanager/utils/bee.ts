import { BatchId, Bee, BZZ, Duration, PostageBatch, RedundancyLevel, Size } from '@ethersphere/bee-js'
import {
  FileManagerBase,
  DriveInfo,
  estimateDriveListMetadataSize,
  estimateFileInfoMetadataSize,
} from '@solarpunkltd/file-manager-lib'
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

export const validateStampStillExists = async (bee: Bee, batchId: BatchId): Promise<boolean> => {
  try {
    const stamp = await bee.getPostageBatch(batchId.toString())

    return stamp.usable
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Failed to validate stamp ${batchId.toString().slice(0, 8)}...:`, error)

    return false
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
  onError?: (error: unknown) => void,
) => {
  if (currentFetch.current) {
    await currentFetch.current
  }

  let isCurrentFetch = true

  const fetchPromise = (async () => {
    try {
      const cost = await fmGetStorageCost(capacity, validityEndDate, encryption, erasureCodeLevel, beeApi)

      if (isCurrentFetch) {
        if (cost) {
          setCost(cost)
        } else {
          setCost(BZZ.fromDecimalString('0'))
          onError?.(new Error('Storage cost unavailable - node may be syncing'))
        }
      }
    } catch (error) {
      if (isCurrentFetch) {
        setCost(BZZ.fromDecimalString('0'))
        onError?.(error)
      }
    }
  })()

  currentFetch.current = fetchPromise
  await fetchPromise

  isCurrentFetch = false
  currentFetch.current = null
}

export interface CreateDriveOptions {
  beeApi: Bee | null
  fm: FileManagerBase | null
  size: Size
  duration: Duration
  label: string
  encryption: boolean
  redundancyLevel: RedundancyLevel
  isAdmin: boolean
  resetState: boolean
  existingBatch: PostageBatch | null
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const handleCreateDrive = async (options: CreateDriveOptions): Promise<void> => {
  const {
    beeApi,
    fm,
    size,
    duration,
    label,
    encryption,
    redundancyLevel,
    isAdmin,
    resetState,
    existingBatch,
    onSuccess,
    onError,
  } = { ...options }

  if (!beeApi || !fm) {
    onError?.('Error creating drive: Bee API or FM is invalid!')

    return
  }

  try {
    let batchId: BatchId

    if (!existingBatch) {
      batchId = await beeApi.buyStorage(size, duration, { label }, undefined, encryption, redundancyLevel)
    } else {
      const isValid = await validateStampStillExists(beeApi, existingBatch.batchID)

      if (!isValid) {
        throw new Error(
          'The stamp is no longer valid or has been deleted. Please select a different stamp from the list.',
        )
      }

      batchId = existingBatch.batchID

      verifyDriveSpace({
        fm,
        redundancyLevel,
        stamp: existingBatch,
        useDlSize: true,
        cb: err => {
          throw new Error(err)
        },
      })
    }

    await fm.createDrive(batchId, label, isAdmin, redundancyLevel, resetState)

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
  redundancyLevel?: RedundancyLevel,
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

  let totalBytes = 0
  let remainingBytes = 0

  if (redundancyLevel !== undefined) {
    totalBytes = stamp.calculateSize(false, redundancyLevel).toBytes()
    remainingBytes = stamp.calculateRemainingSize(false, redundancyLevel).toBytes()
  } else {
    totalBytes = stamp.size.toBytes()
    remainingBytes = stamp.remainingSize.toBytes()
  }

  const usedBytes = totalBytes - remainingBytes
  const pctFromStampUsage = stamp.usage * 100
  const pctFromDriveUsage = totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0
  const capacityPct = Math.max(pctFromDriveUsage, pctFromStampUsage)
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

export interface DestroyDriveOptions {
  beeApi?: Bee | null
  fm: FileManagerBase | null
  drive: DriveInfo
  isDestroy: boolean
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const handleDestroyAndForgetDrive = async (options: DestroyDriveOptions): Promise<void> => {
  const { beeApi, fm, drive, isDestroy, onSuccess, onError } = { ...options }

  if (!beeApi || !fm || !fm.adminStamp) {
    onError?.('Error destroying drive: Bee API or FM is invalid!')

    return
  }

  try {
    const stamp = (await getUsableStamps(beeApi)).find(s => s.batchID.toString() === drive.batchId.toString())

    if (!stamp) {
      throw new Error(`Postage stamp (${drive.batchId}) for the current drive (${drive.name}) not found`)
    }

    verifyDriveSpace({
      fm,
      driveId: drive.id.toString(),
      redundancyLevel: drive.redundancyLevel,
      stamp,
      isRemove: true,
      cb: err => {
        throw new Error(err)
      },
    })

    const ttlDays = stamp.duration.toDays()

    if (ttlDays <= 2 || !isDestroy) {
      if (isDestroy) {
        // eslint-disable-next-line no-console
        console.warn(`Stamp TTL ${ttlDays} <= 2 days, skipping drive destruction: forgetting the drive.`)
      }

      await fm.forgetDrive(drive)

      return
    }

    await fm.destroyDrive(drive, stamp)

    onSuccess?.()
  } catch (e) {
    onError?.(e)
  }
}

export interface DriveSpaceOptions {
  fm: FileManagerBase
  driveId?: string
  redundancyLevel: RedundancyLevel
  stamp: PostageBatch
  useDlSize?: boolean
  useInfoSize?: boolean
  isRemove?: boolean
  fileSize?: number
  cb?: (msg: string) => void
}

export const verifyDriveSpace = (
  options: DriveSpaceOptions,
): { remainingBytes: number; totalSize: number; ok: boolean } => {
  const { fm, driveId, redundancyLevel, stamp, useDlSize, useInfoSize, isRemove, fileSize, cb } = { ...options }

  let drivesLen = fm.getDrives().length
  let filesPerDrivesLen = 0

  if (isRemove) {
    drivesLen -= 1
    filesPerDrivesLen = fm.fileInfoList.filter(fi => fi.driveId !== driveId).length
  } else {
    filesPerDrivesLen = driveId ? fm.fileInfoList.filter(fi => fi.driveId === driveId).length : 0
  }

  const estimatedFiSize = estimateFileInfoMetadataSize()
  const estimatedDlSize = estimateDriveListMetadataSize(drivesLen, filesPerDrivesLen)
  const totalSize =
    Number(Boolean(useDlSize)) * estimatedDlSize +
    Number(Boolean(useInfoSize)) * estimatedFiSize +
    (fileSize ? fileSize : 0)
  const { remainingBytes } = calculateStampCapacityMetrics(stamp, redundancyLevel)
  const ok = remainingBytes >= totalSize

  if (!ok) {
    cb?.(
      `Insufficient capacity. Required: ~${getHumanReadableFileSize(
        totalSize,
      )} bytes, Available: ${getHumanReadableFileSize(remainingBytes)} bytes. Please top up the drive/stamp.`,
    )
  }

  return { remainingBytes, totalSize, ok }
}
