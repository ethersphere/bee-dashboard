import type { PostageBatch, RedundancyLevel } from '@ethersphere/bee-js'
import type { DriveInfo, FileInfo, FileManagerBase } from '@solarpunkltd/file-manager-lib'

import { ActionTag } from '../constants/transfers'

import { verifyDriveSpace } from './bee'
import { capitalizeFirstLetter } from './common'

export enum FileOperation {
  Trash = 'trash',
  Recover = 'recover',
  Forget = 'forget',
}

interface FileOperationOptions {
  fm: FileManagerBase
  file: FileInfo
  redundancyLevel: RedundancyLevel
  driveId: string
  stamp: PostageBatch
  adminStamp?: PostageBatch
  adminRedundancy?: RedundancyLevel
  operation: FileOperation
  onError?: (error: string) => void
  onSuccess?: () => void
}

export async function performFileOperation({
  fm,
  file,
  redundancyLevel,
  driveId,
  stamp,
  adminStamp,
  adminRedundancy,
  operation,
  onError,
  onSuccess,
}: FileOperationOptions): Promise<boolean> {
  try {
    const isForget = operation === FileOperation.Forget
    const verifyStamp = isForget ? adminStamp || stamp : stamp

    const { ok } = verifyDriveSpace({
      fm,
      redundancyLevel,
      stamp: verifyStamp,
      useInfoSize: !isForget,
      adminRedundancy: isForget ? adminRedundancy : undefined,
      driveId,
      fileSize: 0,
      cb: err => {
        onError?.(err || `Could not ${operation} file due to insufficient space: ${file.name}`)
      },
    })

    if (!ok) return false

    const lifecycleTag = operation === FileOperation.Trash ? ActionTag.Trashed : ActionTag.Recovered
    const withMeta: FileInfo = {
      ...file,
      customMetadata: {
        ...(file.customMetadata ?? {}),
        lifecycle: capitalizeFirstLetter(lifecycleTag),
        lifecycleAt: new Date().toISOString(),
      },
    }

    switch (operation) {
      case FileOperation.Trash:
        await fm.trashFile(withMeta)
        break
      case FileOperation.Recover:
        await fm.recoverFile(withMeta)
        break
      case FileOperation.Forget:
        await fm.forgetFile(file)
        break
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }

    onSuccess?.()

    return true
  } catch (error) {
    onError?.(error instanceof Error ? error.message : `Failed to ${operation} file: ${file.name}`)

    return false
  }
}

export async function performBulkFileOperation({
  fm,
  files,
  operation,
  stamps,
  adminStamp,
  adminDrive,
  onError,
  onFileComplete,
}: {
  fm: FileManagerBase
  files: FileInfo[]
  operation: FileOperation
  stamps: PostageBatch[]
  adminStamp?: PostageBatch
  adminDrive?: DriveInfo
  onError?: (error: string) => void
  onFileComplete?: (file: FileInfo, index: number) => void
}): Promise<void> {
  if (!fm || !files?.length) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const defaultErrorMsg = `Could not ${operation} file due to insufficient space: ${file.name}`

    try {
      const currentStamp = stamps.find(s => s.batchID.toString() === file.batchId.toString())

      if (!currentStamp && operation !== FileOperation.Forget) {
        onError?.(`Stamp not found for file: ${file.name}`)

        return
      }

      if (!currentStamp) return

      const success = await performFileOperation({
        fm,
        file,
        redundancyLevel: file.redundancyLevel || 0,
        driveId: file.driveId,
        stamp: currentStamp,
        adminStamp,
        operation,
        adminRedundancy: adminDrive?.redundancyLevel,
        onError,
      })

      if (!success) {
        throw new Error(defaultErrorMsg)
      }

      onFileComplete?.(file, i)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      onError?.(errorMsg || defaultErrorMsg)

      return
    }
  }
}
