import { Strings } from 'cafe-utility'

interface Props {
  pathParts: string[]
  jumpToDirectory: (fullPath: string) => void
  backgroundColor: string
  rootAlias?: string
}

export function CafeReactFsPath({ pathParts, jumpToDirectory, backgroundColor, rootAlias }: Props) {
  const absolutePaths: string[] = []

  for (const pathPart of pathParts) {
    if (absolutePaths.length === 0) {
      absolutePaths.push(pathPart)
    } else {
      absolutePaths.push(Strings.joinUrl(absolutePaths[absolutePaths.length - 1], pathPart))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '4px' }}>
      {pathParts.map((part, index) => (
        <button
          key={index}
          style={{
            background: backgroundColor,
            borderRadius: '2px',
            cursor: 'pointer',
            outline: 'none',
            border: 'none',
            fontSize: '20px',
            padding: '4px 16px',
          }}
          onClick={() => {
            jumpToDirectory(absolutePaths[index])
          }}
        >
          {rootAlias && part === '/' ? rootAlias : part}
        </button>
      ))}
    </div>
  )
}
