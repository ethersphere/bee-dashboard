import { useEffect, useMemo, useState } from 'react'
import type { FileInfo } from '@solarpunkltd/file-manager-lib'

export enum SortKey {
  Name = 'name',
  Size = 'size',
  Timestamp = 'timestamp',
  Drive = 'drive',
}

export enum SortDir {
  Asc = 'asc',
  Desc = 'desc',
}

export type SortState = { key: SortKey; dir: SortDir }

type Options = {
  persist?: boolean
  defaultState?: SortState
  storageKey?: string
  getDriveName?: (fi: FileInfo) => string
}

const STORAGE_KEY = 'fm.sort.v1'
const DEFAULT_STATE: SortState = { key: SortKey.Timestamp, dir: SortDir.Desc }

const coerceNumber = (v: unknown): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v

  if (typeof v === 'string') {
    const n = Number(v)

    if (Number.isFinite(n)) return n
  }

  return 0
}

const getSize = (fi: FileInfo): number => {
  const cm = (fi.customMetadata ?? {}) as Record<string, unknown>

  if (cm && Object.prototype.hasOwnProperty.call(cm, 'size')) {
    return coerceNumber(cm.size)
  }

  return coerceNumber((fi as unknown as { size?: number | string }).size)
}

const getTs = (fi: FileInfo): number => coerceNumber((fi as unknown as { timestamp?: number | string }).timestamp)

const isValidState = (s: Partial<SortState>): s is SortState =>
  Object.values(SortKey).includes(s.key as SortKey) && Object.values(SortDir).includes(s.dir as SortDir)

export function useSorting(
  items: FileInfo[],
  opts: Options = {},
): {
  sorted: FileInfo[]
  sort: SortState
  toggle: (key: SortKey) => void
  reset: () => void
} {
  const { persist = true, defaultState = DEFAULT_STATE, storageKey = STORAGE_KEY, getDriveName } = opts

  const [sort, setSort] = useState<SortState>(() => {
    if (!persist) return defaultState
    try {
      const raw = localStorage.getItem(storageKey)

      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SortState>

        if (isValidState(parsed)) return parsed
      }
    } catch {
      // ignore storage/JSON errors and use default
    }

    return defaultState
  })

  useEffect(() => {
    if (!persist) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(sort))
    } catch {
      // ignore storage errors
    }
  }, [persist, storageKey, sort])

  const toggle = (key: SortKey): void => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === SortDir.Asc ? SortDir.Desc : SortDir.Asc }
        : { key, dir: SortDir.Asc },
    )
  }

  const reset = (): void => setSort(defaultState)

  const sorted = useMemo<FileInfo[]>(() => {
    const arr = [...items]
    const mul = sort.dir === SortDir.Asc ? 1 : -1

    arr.sort((a, b) => {
      if (sort.key === SortKey.Name) {
        const an = (a.name ?? '').toLocaleLowerCase()
        const bn = (b.name ?? '').toLocaleLowerCase()

        if (an < bn) return -1 * mul

        if (an > bn) return Number(mul)

        return 0
      }

      if (sort.key === SortKey.Size) {
        const av = getSize(a)
        const bv = getSize(b)

        if (av < bv) return -1 * mul

        if (av > bv) return Number(mul)

        return 0
      }

      if (sort.key === SortKey.Drive) {
        const ad = (getDriveName?.(a) ?? '').toLocaleLowerCase()
        const bd = (getDriveName?.(b) ?? '').toLocaleLowerCase()

        if (ad < bd) return -1 * mul

        if (ad > bd) return Number(mul)

        return 0
      }

      const av = getTs(a)
      const bv = getTs(b)

      if (av < bv) return -1 * mul

      if (av > bv) return Number(mul)

      return 0
    })

    return arr
  }, [items, sort, getDriveName])

  return { sorted, sort, toggle, reset }
}
