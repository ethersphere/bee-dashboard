import { CafeReactFsDirectory } from './CafeReactFsDirectory'
import { CafeReactFsFile } from './CafeReactFsFile'
import { FsItem, isVirtualDirectory, isVirtualFile } from './CafeReactType'

interface Props {
  path: string
  item: FsItem
  download: (path: string) => Promise<void>
  enterDirectory: (name: string) => void
  onDeleteFile: (path: string) => Promise<void>
  onDeleteDirectory: (path: string) => Promise<void>
  backgroundColor: string
}

export function CafeReactFsItem({
  path,
  item,
  download,
  enterDirectory,
  onDeleteFile,
  onDeleteDirectory,
  backgroundColor,
}: Props) {
  if (isVirtualFile(item)) {
    return (
      <CafeReactFsFile
        path={path}
        file={item}
        download={download}
        deleteFile={onDeleteFile}
        backgroundColor={backgroundColor}
      />
    )
  }

  if (isVirtualDirectory(item)) {
    return (
      <CafeReactFsDirectory
        directory={item}
        enterDirectory={enterDirectory}
        deleteDirectory={onDeleteDirectory}
        backgroundColor={backgroundColor}
      />
    )
  }

  return null
}
