import { useMemo, useCallback } from 'react'
import { FileInfo, DriveInfo } from '@solarpunkltd/file-manager-lib'
import { ViewType } from '../constants/transfers'
import { indexStrToBigint, isTrashed } from '../utils/common'

interface UseFileFilteringProps {
  files: FileInfo[]
  currentDrive: DriveInfo | null
  view: ViewType
  isSearchMode: boolean
  query: string
  scope: string
  includeActive: boolean
  includeTrashed: boolean
}

interface UseFileFilteringReturn {
  rows: FileInfo[]
  searchRows: FileInfo[]
  listToRender: FileInfo[]
  statusIncluded: (fi: FileInfo) => boolean
  matchesQuery: (fi: FileInfo) => boolean
}

export function useFileFiltering(props: UseFileFilteringProps): UseFileFilteringReturn {
  const { files, currentDrive, view, isSearchMode, query, scope, includeActive, includeTrashed } = props

  const q = query.trim().toLowerCase()

  const statusIncluded = useCallback(
    (fi: FileInfo): boolean => {
      const trashed = isTrashed(fi)

      if (trashed && !includeTrashed) return false

      if (!trashed && !includeActive) return false

      return true
    },
    [includeActive, includeTrashed],
  )

  const matchesQuery = useCallback(
    (fi: FileInfo): boolean => {
      if (!q) return true
      const name = fi.name.toLowerCase()
      const mime = (fi.customMetadata?.mime || '').toLowerCase()
      const topic = String(fi.topic ?? '').toLowerCase()

      return name.includes(q) || mime.includes(q) || topic.includes(q)
    },
    [q],
  )

  const rows = useMemo((): FileInfo[] => {
    if (!currentDrive) return []

    const sameDrive = files.filter(fi => fi.driveId.toString() === currentDrive.id.toString())

    const nameCount = sameDrive.reduce<Record<string, number>>((acc, fi) => {
      acc[fi.name] = (acc[fi.name] || 0) + 1

      return acc
    }, {})

    const keyOf = (fi: FileInfo): string => {
      if (nameCount[fi.name] > 1) return `N:${fi.name}`
      const hist = fi.file.historyRef.toString()

      if (hist) return `H:${hist}`
      const t = fi.topic.toString()

      if (t) return `T:${t}`

      return `N:${fi.name}`
    }

    const map = new Map<string, FileInfo>()
    sameDrive.forEach(fi => {
      const key = keyOf(fi)
      const prev = map.get(key)

      if (!prev) {
        map.set(key, fi)

        return
      }

      const vi = indexStrToBigint(fi.version)
      const pi = indexStrToBigint(prev.version)

      if (vi === undefined || pi === undefined) {
        return
      }

      if (vi > pi) {
        map.set(key, fi)

        return
      }

      if (vi === pi && Number(fi.timestamp || 0) > Number(prev.timestamp || 0)) {
        map.set(key, fi)
      }
    })

    const latest = Array.from(map.values())

    return view === ViewType.Trash ? latest.filter(isTrashed) : latest.filter(fi => !isTrashed(fi))
  }, [files, currentDrive, view])

  const searchRows = useMemo((): FileInfo[] => {
    if (!isSearchMode) return []

    const source =
      scope === 'selected' && currentDrive
        ? files.filter(f => f.driveId.toString() === currentDrive.id.toString())
        : files

    const filtered = source.filter(f => statusIncluded(f) && matchesQuery(f))

    const keyOf = (fi: FileInfo): string => {
      const hist = fi.file.historyRef.toString()

      if (hist) return `H:${hist}`
      const t = fi.topic.toString()

      return `T:${t}|N:${fi.name}`
    }

    const latest = new Map<string, FileInfo>()
    for (const fi of filtered) {
      const k = keyOf(fi)
      const prev = latest.get(k)

      if (!prev) {
        latest.set(k, fi)
      } else {
        const a = indexStrToBigint(fi.version)
        const b = indexStrToBigint(prev.version)

        if (a === undefined || b === undefined) {
          // TODO: Skip if version parsing fails?
          // TODO: review keyof everywhere
        } else if (a > b || (a === b && Number(fi.timestamp || 0) > Number(prev.timestamp || 0))) {
          latest.set(k, fi)
        }
      }
    }

    return Array.from(latest.values()).sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0))
  }, [isSearchMode, scope, currentDrive, files, matchesQuery, statusIncluded])

  const listToRender = isSearchMode ? searchRows : rows

  return {
    rows,
    searchRows,
    listToRender,
    statusIncluded,
    matchesQuery,
  }
}
