interface Props {
  backgroundColor: string
  onSync: () => Promise<void>
}

export function CafeReactFsSync({ backgroundColor, onSync }: Props) {
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
      onClick={onSync}
    >
      <img
        alt="Sync"
        style={{ width: '64px', height: '64px', position: 'absolute', left: '8px', top: 0 }}
        src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%22512%22%20height%3D%22512%22%20viewBox%3D%220%200%20512%20512%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M%20156%20156%20l%20250%200%20l%200%20150%22%20stroke%3D%22%231F2D3D%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3Cpath%20d%3D%22M%20356%20256%20l%2050%2050%20l%2050%20-50%22%20stroke%3D%22%231F2D3D%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3Cpath%20d%3D%22M%20356%20356%20l%20-250%200%20l%200%20-150%22%20stroke%3D%22%231F2D3D%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3Cpath%20d%3D%22M%20156%20256%20l%20-50%20-50%20l%20-50%2050%22%20stroke%3D%22%231F2D3D%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3C%2Fsvg%3E"
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
        Sync
      </p>
    </div>
  )
}
