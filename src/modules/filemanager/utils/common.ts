import { PrivateKey } from '@ethersphere/bee-js'
import { FileInfo, FileStatus } from '@solarpunkltd/file-manager-lib'
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'

export function getDaysLeft(expiryDate: Date): number {
  const now = new Date()

  const diffMs = expiryDate.getTime() - now.getTime()

  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
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

const lifetimeAdjustments = new Map<number, (date: Date) => void>([
  [0, date => date.setDate(date.getDate() + 7)],
  [1, date => date.setMonth(date.getMonth() + 1)],
  [2, date => date.setMonth(date.getMonth() + 3)],
  [3, date => date.setMonth(date.getMonth() + 6)],
  [4, date => date.setFullYear(date.getFullYear() + 1)],
])

export function getExpiryDateByLifetime(lifetimeValue: number, actualValidity?: Date): Date {
  const now = actualValidity || new Date()

  const adjustDate = lifetimeAdjustments.get(lifetimeValue)

  if (adjustDate) {
    adjustDate(now)
  }

  return now
}

export const indexStrToBigint = (indexStr?: string): bigint | undefined => {
  if (!indexStr) {
    return undefined
  }

  const isHex = /[a-fA-F]/.test(indexStr) || indexStr.startsWith('0') || indexStr.length > 10

  if (isHex) {
    return BigInt(parseInt(indexStr, 16))
  }

  return BigInt(parseInt(indexStr, 10))
}

export const formatBytes = (v?: string | number): string | undefined => {
  let n: number

  if (typeof v === 'string') n = Number(v)
  else if (typeof v === 'number') n = v
  else n = NaN

  if (!Number.isFinite(n) || n < 0) return undefined

  if (n < 1024) return `${n} B`

  const units = ['KB', 'MB', 'GB', 'TB'] as const
  let val = n / 1024
  let i = 0
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024
    i++
  }

  return `${val.toFixed(1)} ${units[i]}`
}

export const isTrashed = (fi: FileInfo): boolean => fi.status === FileStatus.Trashed

export type Point = { x: number; y: number }
export enum Dir {
  Down = 'down',
  Up = 'up',
}

export function getFileId(fi: FileInfo): string {
  return fi.topic.toString()
}

export const KEY_STORAGE = 'privateKey'

export function getSigner(input: string): PrivateKey {
  const normalized = input.trim().toLowerCase()
  const hash = keccak256(toUtf8Bytes(normalized))
  const privateKeyHex = hash.slice(2)

  return new PrivateKey(privateKeyHex)
}

export function getSignerPk(): PrivateKey | undefined {
  try {
    const fromLocalPk = localStorage.getItem(KEY_STORAGE)

    if (!fromLocalPk) {
      // eslint-disable-next-line no-console
      console.error('Private key not found, cannot initialize')

      return undefined
    }

    return new PrivateKey(fromLocalPk)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Private key error in localStorage under key "${KEY_STORAGE}": `, err)

    return undefined
  }
}

export function setSignerPk(pk: string): void {
  localStorage.setItem(KEY_STORAGE, pk)
}

export function removeSignerPk(): void {
  localStorage.removeItem(KEY_STORAGE)
}

export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export const safeSetState =
  <T>(ref: React.MutableRefObject<boolean>, setter: React.Dispatch<React.SetStateAction<T>>) =>
  (value: React.SetStateAction<T>) => {
    if (ref.current) setter(value)
  }
