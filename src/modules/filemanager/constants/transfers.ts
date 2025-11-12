export enum FileTransferType {
  Upload = 'upload',
  Download = 'download',
  Update = 'update',
}

export enum TransferStatus {
  Uploading = 'uploading',
  Downloading = 'downloading',
  Done = 'done',
  Error = 'error',
  Queued = 'queued',
  Cancelled = 'cancelled',
}

export enum TransferBarColor {
  Upload = '#22c55e',
  Update = '#f59e0b',
  Download = '#3b82f6',
}

export enum ViewType {
  File = 'file',
  Trash = 'trash',
  Expired = 'expired',
}

export enum ActionTag {
  Trashed = 'trashed',
  Recovered = 'recovered',
  Restored = 'restored',
}

export enum FileAction {
  Trash = 'trash',
  Forget = 'forget',
  Destroy = 'destroy',
}

export enum DownloadState {
  InProgress = 'in-progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Error = 'error',
}

export type TrackDownloadProps = {
  name: string
  size?: string
  expectedSize?: number
}

export interface DownloadProgress {
  progress: number
  isDownloading: boolean
  state?: DownloadState
}
