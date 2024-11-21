export enum FsItemType {
  FILE = 'file',
  DIRECTORY = 'directory',
}

export interface VirtualFile {
  id: string | number
  name: string
  $type: FsItemType.FILE
}

export interface VirtualDirectory {
  id: string | number
  name: string
  $type: FsItemType.DIRECTORY
}

export type FsItem = VirtualFile | VirtualDirectory

export function isVirtualFile(item: FsItem): item is VirtualFile {
  return item.$type === FsItemType.FILE
}

export function isVirtualDirectory(item: FsItem): item is VirtualDirectory {
  return item.$type === FsItemType.DIRECTORY
}
