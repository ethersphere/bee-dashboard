export enum FileTransferType {
  Upload = 'upload',
  Download = 'download',
}

export enum ViewType {
  File = 'file',
  Trash = 'trash',
}

export const desiredLifetimeOptions = [
  { value: 1, label: '1 week' },
  { value: 2, label: '1 month' },
  { value: 3, label: '3 months' },
  { value: 4, label: '6 months' },
  { value: 5, label: '1 year' },
]
