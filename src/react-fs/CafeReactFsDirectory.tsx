import { useState } from 'react'
import { CafeReactFsDelete } from './CafeReactFsDelete'
import { CafeReactFsLoading } from './CafeReactFsLoading'
import { CafeReactFsName } from './CafeReactFsName'
import { VirtualDirectory } from './CafeReactType'

interface Props {
  directory: VirtualDirectory
  enterDirectory: (name: string) => void
  deleteDirectory: (name: string) => Promise<void>
  backgroundColor: string
}

export function CafeReactFsDirectory({ directory, enterDirectory, deleteDirectory, backgroundColor }: Props) {
  const [hovered, setHovered] = useState(false)
  const [loading, setLoading] = useState(false)

  function proxyDelete() {
    setLoading(true)

    return deleteDirectory(directory.name).finally(() => setLoading(false))
  }

  if (loading) {
    return <CafeReactFsLoading backgroundColor={backgroundColor} />
  }

  return (
    <div
      style={{
        width: '80px',
        height: '80px',
        position: 'relative',
        background: backgroundColor,
        borderRadius: '2px',
        cursor: 'pointer',
      }}
      onClick={() => enterDirectory(directory.name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && <CafeReactFsDelete onDelete={proxyDelete} />}
      <img
        src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%22512%22%20height%3D%22512%22%20viewBox%3D%220%200%20512%20512%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M%20106%20131%20l%20100%200%20l%2025%2025%20l%20175%200%20l%200%20200%20l%20-300%200%20z%22%20stroke%3D%22%231F2D3D%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3C%2Fsvg%3E"
        style={{ width: '64px', height: '64px', position: 'absolute', left: '8px', top: 0 }}
      />
      <CafeReactFsName name={directory.name} />
    </div>
  )
}
