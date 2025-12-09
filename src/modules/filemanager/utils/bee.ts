import { BatchId, Bee, BZZ, Duration, PostageBatch, RedundancyLevel, Size } from '@ethersphere/bee-js'
import {
  FileManagerBase,
  DriveInfo,
  estimateDriveListMetadataSize,
  estimateFileInfoMetadataSize,
  FileInfo,
} from '@solarpunkltd/file-manager-lib'
import { getHumanReadableFileSize } from '../../../utils/file'
import { indexStrToBigint } from './common'

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
  adminRedundancy: RedundancyLevel
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
    adminRedundancy,
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

      // verify if there is enough space on the admin stamp first
      verifyDriveSpace({
        fm,
        redundancyLevel,
        stamp: existingBatch,
        adminRedundancy,
        cb: err => {
          throw new Error(err)
        },
      })

      batchId = existingBatch.batchID
    }

    await fm.createDrive(batchId, label, isAdmin, redundancyLevel, resetState)

    onSuccess?.()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error creating drive:', e instanceof Error ? e.message : String(e))
    onError?.(e)
  }
}

export interface DestroyDriveOptions {
  beeApi?: Bee | null
  fm: FileManagerBase | null
  drive: DriveInfo
  adminDrive: DriveInfo | null
  isDestroy: boolean
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const handleDestroyAndForgetDrive = async (options: DestroyDriveOptions): Promise<void> => {
  const { beeApi, fm, adminDrive, drive, isDestroy, onSuccess, onError } = { ...options }

  if (!beeApi || !fm || !fm.adminStamp || !adminDrive) {
    onError?.('Error destroying drive: Admin Drive, Bee API or FM is invalid!')

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
      adminRedundancy: adminDrive.redundancyLevel,
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

export interface StampCapacityMetrics {
  capacityPct: number
  usedSize: string
  stampSize: string
  usedBytes: number
  stampSizeBytes: number
  remainingBytes: number
}

export const calculateStampCapacityMetrics = (
  stamp: PostageBatch,
  files: FileInfo[],
  redundancyLevel?: RedundancyLevel,
): StampCapacityMetrics => {
  let stampSizeBytes = 0
  let remainingReportedBytes = 0

  if (redundancyLevel !== undefined) {
    stampSizeBytes = stamp.calculateSize(false, redundancyLevel).toBytes()
    remainingReportedBytes = stamp.calculateRemainingSize(false, redundancyLevel).toBytes()
  } else {
    stampSizeBytes = stamp.size.toBytes()
    remainingReportedBytes = stamp.remainingSize.toBytes()
  }

  const usedBytesFromFiles = files
    .map(f => {
      const fileSize = Number(f.customMetadata?.size || 0)
      const versionCount = Number((indexStrToBigint(f.version) ?? BigInt(0)) + BigInt(1))

      return fileSize * versionCount
    })
    .reduce((acc, current) => acc + current, 0)

  const remainingBytesFromFiles = stampSizeBytes - usedBytesFromFiles > 0 ? stampSizeBytes - usedBytesFromFiles : 0
  const remainingBytes = Math.min(remainingReportedBytes, remainingBytesFromFiles)

  const usedBytesReported = stampSizeBytes - remainingReportedBytes
  const pctFromStampUsage = stamp.usage * 100

  const usedSizeMaxBytes = Math.max(usedBytesFromFiles, usedBytesReported)
  const usedSizeMax = getHumanReadableFileSize(usedSizeMaxBytes)
  const pctFromDriveUsage = stampSizeBytes > 0 ? (usedSizeMaxBytes / stampSizeBytes) * 100 : 0
  const capacityPct = Math.max(pctFromDriveUsage, pctFromStampUsage)
  const stampSize = getHumanReadableFileSize(stampSizeBytes)

  return {
    capacityPct,
    usedSize: usedSizeMax,
    stampSize,
    usedBytes: usedSizeMaxBytes,
    stampSizeBytes,
    remainingBytes,
  }
}

export interface DriveSpaceOptions {
  fm: FileManagerBase
  driveId?: string
  redundancyLevel: RedundancyLevel
  stamp: PostageBatch
  adminRedundancy?: RedundancyLevel
  useInfoSize?: boolean
  isRemove?: boolean
  fileSize?: number
  cb?: (msg: string) => void
}

export const verifyDriveSpace = (
  options: DriveSpaceOptions,
): { remainingBytes: number; totalSizeBytes: number; ok: boolean } => {
  const { fm, driveId, redundancyLevel, stamp, adminRedundancy, useInfoSize, isRemove, fileSize, cb } = {
    ...options,
  }

  const drives = [...fm.driveList]
  let filesPerDrives: FileInfo[] = []

  // new drivelist state size calc.
  if (isRemove) {
    const driveIx = drives.findIndex(d => d.id.toString() === driveId?.toString())

    if (driveIx === -1) {
      cb?.(`Admin drive not found during stamp verification`)

      return { remainingBytes: 0, totalSizeBytes: 0, ok: false }
    }

    drives.splice(driveIx, 1)
    filesPerDrives = fm.fileInfoList.filter(fi => fi.driveId !== driveId)
  } else {
    filesPerDrives = driveId ? fm.fileInfoList.filter(fi => fi.driveId === driveId) : []
  }

  // admin stamp capacity calcl., needed for forget, destroy, create
  if (adminRedundancy !== undefined && fm.adminStamp) {
    // upper limit estimate on the drivelist metadata state size based on the number of drives and files
    const estimatedDlSizeBytes = estimateDriveListMetadataSize(drives) * drives.length
    const { remainingBytes: remainingAdminBytes } = calculateStampCapacityMetrics(fm.adminStamp, [], adminRedundancy)

    const ok = remainingAdminBytes >= estimatedDlSizeBytes

    if (!ok) {
      cb?.(
        `Insufficient admin drive capacity. Required: ~${getHumanReadableFileSize(
          estimatedDlSizeBytes,
        )} bytes, Available: ${getHumanReadableFileSize(
          remainingAdminBytes,
        )} bytes. Please top up the admin drive/stamp.`,
      )

      return { remainingBytes: remainingAdminBytes, totalSizeBytes: estimatedDlSizeBytes, ok }
    }
  }

  // other fileinfo metadata size calc.
  const estimatedFiSize = estimateFileInfoMetadataSize()
  const estimateReqSizeBytes = Number(Boolean(useInfoSize)) * estimatedFiSize + (fileSize ? fileSize : 0)
  const { remainingBytes } = calculateStampCapacityMetrics(stamp, filesPerDrives, redundancyLevel)

  const ok = remainingBytes >= estimateReqSizeBytes

  if (!ok) {
    cb?.(
      `Insufficient capacity. Required: ~${getHumanReadableFileSize(
        estimateReqSizeBytes,
      )} bytes, Available: ${getHumanReadableFileSize(remainingBytes)} bytes. Please top up the drive/stamp.`,
    )
  }

  return { remainingBytes, totalSizeBytes: estimateReqSizeBytes, ok }
}
