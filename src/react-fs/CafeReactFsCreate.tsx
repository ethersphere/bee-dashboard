import { useState } from 'react'
import { CafeReactFsLoading } from './CafeReactFsLoading'

interface Props {
  backgroundColor: string
  onCreateDirectory: () => Promise<void>
}

export function CafeReactFsCreate({ backgroundColor, onCreateDirectory }: Props) {
  const [loading, setLoading] = useState(false)

  function proxyUpload() {
    setLoading(true)
    onCreateDirectory().finally(() => setLoading(false))
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
      onClick={proxyUpload}
    >
      <img
        alt="Create"
        style={{ width: '64px', height: '64px', position: 'absolute', left: '8px', top: 0 }}
        src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%22512%22%20height%3D%22512%22%20viewBox%3D%220%200%20512%20512%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M%20106%20131%20l%20100%200%20l%2025%2025%20l%20175%200%20l%200%20200%20l%20-300%200%20z%22%20stroke%3D%22%231F2D3D%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3Cpath%20d%3D%22M%20206%20256%20l%20100%200%22%20stroke%3D%22%23B83B5E%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3Cpath%20d%3D%22M%20256%20206%20l%200%20100%22%20stroke%3D%22%23B83B5E%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3C%2Fsvg%3E"
      />
      <p
        style={{
          margin: 0,
          fontFamily: 'sans-serif',
          fontSize: '12px',
          textAlign: 'center',
          width: '80px',
          position: 'absolute',
          bottom: '5px',
          left: 0,
        }}
      >
        New Folder
      </p>
    </div>
  )
}
