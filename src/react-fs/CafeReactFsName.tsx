interface Props {
  name: string
}

export function CafeReactFsName({ name }: Props) {
  const shortName = name.length > 10 ? name.slice(0, 10) + '...' : name

  return (
    <p
      title={name}
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
      {shortName}
    </p>
  )
}
