import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { Strings } from 'cafe-utility'
import { useState } from 'react'
import { CafeReactFs } from '../../react-fs/CafeReactFs'
import { FsItem, FsItemType } from '../../react-fs/CafeReactType'

interface Props {
  fdp: FdpStorage
  name: string
}

export function FdpPod({ fdp, name }: Props) {
  const [reloader, setReloader] = useState(0)

  function reload() {
    setReloader(reloader + 1)
  }

  return (
    <CafeReactFs
      rootAlias={`/${name}`}
      backgroundColor="#ffffff"
      reloader={reloader}
      onDeleteFile={async (path: string) => {
        await fdp.file.delete(name, path)
        reload()
      }}
      onDeleteDirectory={async (path: string) => {
        await fdp.directory.delete(name, path)
        reload()
      }}
      onUpload={(path: string) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = true
        input.click()

        return new Promise<void>(resolve => {
          input.onchange = async () => {
            if (!input.files || !input.files.length) {
              resolve()

              return
            }
            for (const file of Array.from(input.files)) {
              const data = await file.arrayBuffer()
              await fdp.file.uploadData(name, Strings.joinUrl(path, file.name), new Uint8Array(data))
            }
            reload()
            resolve()
          }
        })
      }}
      onCreateDirectory={async (path: string) => {
        // eslint-disable-next-line no-alert
        const newDirectoryName = prompt('Directory name')

        if (!newDirectoryName) {
          return
        }
        await fdp.directory.create(name, Strings.joinUrl(path, newDirectoryName))
        reload()
      }}
      // eslint-disable-next-line require-await
      onSync={async () => {
        setReloader(reloader + 1)
      }}
      download={async (path: string) => {
        const data = await fdp.file.downloadData(name, path)
        const url = URL.createObjectURL(new Blob([data]))
        const a = document.createElement('a')
        a.href = url
        a.download = path.split('/').pop() || 'Untitled'
        a.click()
      }}
      list={async (path: string) => {
        const fdpResponse = await fdp.directory.read(name, path)
        const items: FsItem[] = []
        for (const directory of fdpResponse.directories) {
          items.push({
            name: directory.name,
            $type: FsItemType.DIRECTORY,
            id: directory.name,
          })
        }
        for (const file of fdpResponse.files) {
          items.push({
            name: file.name,
            $type: FsItemType.FILE,
            id: file.name,
          })
        }

        return items
      }}
    />
  )
}
