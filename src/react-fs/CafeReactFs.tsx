import { useEffect, useState } from 'react'
import { CafeReactFsCreate } from './CafeReactFsCreate'
import { CafeReactFsItem } from './CafeReactFsItem'
import { CafeReactFsLoading } from './CafeReactFsLoading'
import { CafeReactFsPath } from './CafeReactFsPath'
import { CafeReactFsSync } from './CafeReactFsSync'
import { CafeReactFsUpload } from './CafeReactFsUpload'
import { FsItem } from './CafeReactType'

const DEFAULT_BACKGROUND_COLOR = '#f0f0f0'

interface Props {
  download: (path: string) => Promise<void>
  list: (path: string) => Promise<FsItem[]>
  onUpload: (path: string) => Promise<void>
  onCreateDirectory: (path: string) => Promise<void>
  onDeleteFile: (path: string) => Promise<void>
  onDeleteDirectory: (path: string) => Promise<void>
  onSync: () => Promise<void>
  reloader: number
  backgroundColor?: string
  rootAlias?: string
}

export function CafeReactFs({
  download,
  list,
  onUpload,
  onCreateDirectory,
  onDeleteFile,
  onDeleteDirectory,
  onSync,
  reloader,
  backgroundColor,
  rootAlias,
}: Props) {
  const [path, setPath] = useState('/')
  const [items, setItems] = useState<FsItem[]>([])
  const [loading, setLoading] = useState(false)

  function setItemsSorted(items: FsItem[]) {
    // directories first, all alphabetically
    const sortedItems = items.slice().sort((a, b) => {
      if (a.$type === b.$type) {
        return a.name.localeCompare(b.name)
      }

      return a.$type === 'directory' ? -1 : 1
    })
    setItems(sortedItems)
  }

  useEffect(() => {
    setLoading(true)
    list(path)
      .then(setItemsSorted)
      .finally(() => setLoading(false))
  }, [reloader])

  const pathParts = ['/', ...path.split('/').filter(x => x)]

  function jumpToDirectory(fullPath: string) {
    setPath(fullPath)
    setLoading(true)
    list(fullPath)
      .then(setItemsSorted)
      .finally(() => setLoading(false))
  }

  function enterDirectory(name: string) {
    const newPath = path.endsWith('/') ? `${path}${name}` : `${path}/${name}`
    setPath(newPath)
    setLoading(true)
    list(newPath)
      .then(setItemsSorted)
      .finally(() => setLoading(false))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <CafeReactFsPath
        pathParts={pathParts}
        jumpToDirectory={jumpToDirectory}
        backgroundColor={backgroundColor ?? DEFAULT_BACKGROUND_COLOR}
        rootAlias={rootAlias}
      />
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '4px' }}>
        {loading && <CafeReactFsLoading backgroundColor={backgroundColor ?? DEFAULT_BACKGROUND_COLOR} />}
        {!loading &&
          items.map(item => (
            <CafeReactFsItem
              key={item.id}
              path={path}
              item={item}
              enterDirectory={enterDirectory}
              onDeleteFile={onDeleteFile}
              onDeleteDirectory={onDeleteDirectory}
              download={download}
              backgroundColor={backgroundColor ?? DEFAULT_BACKGROUND_COLOR}
            />
          ))}
        {!loading && (
          <>
            <CafeReactFsUpload
              onUpload={() => onUpload(path)}
              backgroundColor={backgroundColor ?? DEFAULT_BACKGROUND_COLOR}
            />
            <CafeReactFsCreate
              onCreateDirectory={() => onCreateDirectory(path)}
              backgroundColor={backgroundColor ?? DEFAULT_BACKGROUND_COLOR}
            />
            <CafeReactFsSync backgroundColor={backgroundColor ?? DEFAULT_BACKGROUND_COLOR} onSync={onSync} />
          </>
        )}
      </div>
    </div>
  )
}
