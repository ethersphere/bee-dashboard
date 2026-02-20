import { ReactPortal, useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { UploadConflictModal } from '../components/UploadConflictModal/UploadConflictModal'

export enum ConflictAction {
  KeepBoth = 'keep-both',
  Replace = 'replace',
  Cancel = 'cancel',
}
export type ConflictChoice = { action: ConflictAction; newName?: string }

type Request = {
  originalName: string
  existingNames: Set<string>
  isTrashedExisting?: boolean
  resolve: (r: ConflictChoice) => void
}

function splitExt(name: string): { base: string; ext: string } {
  const dot = name.lastIndexOf('.')

  if (dot <= 0 || dot === name.length - 1) return { base: name, ext: '' }

  return { base: name.slice(0, dot), ext: name.slice(dot) }
}

// TODO: why do we need the whole array of same names? just the length should and the name should be enough
function nextCopyName(originalName: string, taken: Set<string>): string {
  const { base, ext } = splitExt(originalName)
  let n = 1
  let candidate = `${base} (${n})${ext}`
  while (taken.has(candidate)) {
    n += 1
    candidate = `${base} (${n})${ext}`
  }

  return candidate
}

export function useUploadConflictDialog(): [
  (args: {
    originalName: string
    existingNames: Set<string> | string[]
    isTrashedExisting?: boolean
  }) => Promise<ConflictChoice>,
  ReactPortal | null,
] {
  const [req, setReq] = useState<Request | null>(null)

  const portal = useMemo(() => {
    if (!req) return null
    const modalRoot = document.querySelector('.fm-main') || document.body
    const suggested = nextCopyName(req.originalName, req.existingNames)

    return createPortal(
      <UploadConflictModal
        filename={req.originalName}
        suggestedName={suggested}
        existingNames={req.existingNames}
        isTrashedExisting={req.isTrashedExisting}
        onKeepBoth={(newName: string) => {
          const { resolve } = req
          setReq(null)
          resolve({ action: ConflictAction.KeepBoth, newName })
        }}
        onReplace={() => {
          const { resolve } = req
          setReq(null)
          resolve({ action: ConflictAction.Replace })
        }}
        onCancel={() => {
          const { resolve } = req
          setReq(null)
          resolve({ action: ConflictAction.Cancel })
        }}
      />,
      modalRoot,
    )
  }, [req])

  const open = useCallback(
    async (args: {
      originalName: string
      existingNames: Set<string> | string[]
      isTrashedExisting?: boolean
    }): Promise<ConflictChoice> => {
      const existing = Array.isArray(args.existingNames) ? new Set(args.existingNames) : args.existingNames

      return await new Promise<ConflictChoice>(resolve => {
        setReq({
          originalName: args.originalName,
          existingNames: existing,
          isTrashedExisting: args.isTrashedExisting,
          resolve,
        })
      })
    },
    [],
  )

  return [open, portal]
}
