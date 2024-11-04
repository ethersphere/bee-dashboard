interface Props {
  onDelete: () => Promise<void>
}

export function CafeReactFsDelete({ onDelete }: Props) {
  return (
    <img
      style={{
        position: 'absolute',
        top: '2px',
        right: '2px',
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        zIndex: 1,
      }}
      src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%22128%22%20height%3D%22128%22%20viewBox%3D%220%200%20128%20128%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%2264%22%20r%3D%2264%22%20fill%3D%22%231F2D3D%22%20stroke%3D%22none%22%20stroke-width%3D%220%22%20%20%2F%3E%3Cpath%20d%3D%22M%2032%2064%20l%2064%200%22%20stroke%3D%22%23B83B5E%22%20stroke-width%3D%2220%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20%20%2F%3E%3C%2Fsvg%3E"
      onClick={event => {
        onDelete()
        event.stopPropagation()
      }}
    />
  )
}
