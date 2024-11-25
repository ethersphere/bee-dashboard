import { useState } from 'react'
import { CafeReactFsDelete } from './CafeReactFsDelete'
import { CafeReactFsLoading } from './CafeReactFsLoading'
import { CafeReactFsName } from './CafeReactFsName'
import { VirtualFile } from './CafeReactType'
import { joinUrl } from './Utility'

interface Props {
  path: string
  file: VirtualFile
  download: (path: string) => Promise<void>
  deleteFile: (path: string) => Promise<void>
  backgroundColor: string
}

export function CafeReactFsFile({ path, file, download, deleteFile, backgroundColor }: Props) {
  const [hovered, setHovered] = useState(false)
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <CafeReactFsLoading backgroundColor={backgroundColor} />
  }

  function proxyDelete() {
    setLoading(true)

    return deleteFile(joinUrl(path, file.name)).finally(() => setLoading(false))
  }

  return (
    <div
      onClick={() => download(joinUrl(path, file.name))}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '80px',
        height: '80px',
        position: 'relative',
        background: backgroundColor,
        borderRadius: '2px',
        cursor: 'pointer',
      }}
    >
      {hovered && <CafeReactFsDelete onDelete={proxyDelete} />}
      <img
        alt="File"
        style={{ width: '64px', height: '64px', position: 'absolute', left: '8px', top: 0 }}
        src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%22512%22%20height%3D%22512%22%20viewBox%3D%220%200%20512%20512%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M%20156%20131%20l%20150%200%20l%2050%2050%20l%200%20200%20l%20-200%200%20z%22%20stroke%3D%22%231F2D3D%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3Cpath%20d%3D%22M%20306%20131%20l%200%2050%20l%2050%200%22%20stroke%3D%22%231F2D3D%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3C%2Fsvg%3E"
      />
      <CafeReactFsName name={file.name} />
    </div>
  )
}
