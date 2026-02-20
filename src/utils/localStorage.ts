import { shortenHash } from './hash'

export const LocalStorageKeys = {
  providerUrl: 'json-rpc-provider',
  apiHost: 'api_host',
  apiKey: 'apiKey',
  fmClickStorage: 'fm_click_count_v1',
  fmSurveyTriggered: 'fm_survey_triggered_v1',
  fmSortKey: 'fm.sort.v1',
  fmPrivateKey: 'privateKey',
  feeds: 'feeds',
  depositWallet: 'deposit-wallet',
  giftWallets: 'gift-wallets',
  invitation: 'invitation',
  uploadHistory: 'UPLOAD_HISTORY',
  downloadHistory: 'DOWNLOAD_HISTORY',
} as const

export type HISTORY_KEYS = typeof LocalStorageKeys.uploadHistory | typeof LocalStorageKeys.downloadHistory

export interface HistoryItem {
  createdAt: number
  name: string
  hash: string
}

export function putHistory(key: HISTORY_KEYS, hash: string, name: string): void {
  const history = getHistorySafe(key)

  const existingIndex = history.findIndex(x => x.hash === hash)

  if (existingIndex !== -1) {
    history.splice(existingIndex, 1)
  }

  history.unshift({
    createdAt: Date.now(),
    hash,
    name,
  })

  if (history.length > 10) {
    history.length = 10
  }
  localStorage.setItem(key, JSON.stringify(history))
}

export function getHistorySafe(key: HISTORY_KEYS): HistoryItem[] {
  const items = localStorage.getItem(key)

  if (!items) {
    return []
  }
  try {
    const parsed = JSON.parse(items)

    if (!Array.isArray(parsed) || !parsed.every(isHistoryItem)) {
      return []
    }

    return parsed
  } catch {
    return []
  }
}

function isHistoryItem(x: unknown): x is HistoryItem {
  if (typeof x !== 'object' || x === null) {
    return false
  }

  return 'createdAt' in x && 'hash' in x
}

export function determineHistoryName(hash: string, indexDocument?: string | null): string {
  if (indexDocument === 'index.html') {
    return `Website ${shortenHash(hash, 4)}`
  } else if (indexDocument) {
    return indexDocument
  }

  return `Folder ${shortenHash(hash, 4)}`
}
