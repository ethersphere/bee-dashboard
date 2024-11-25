import { CSSProperties } from 'react'

interface Props {
  backgroundColor: string
}

export function CafeReactFsLoading({ backgroundColor }: Props) {
  const spinnerStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '2px',
    position: 'relative',
    background: backgroundColor,
  } as CSSProperties

  const bounceStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#333',
    top: '24px',
    left: '24px',
    opacity: 0.6,
    position: 'absolute',
    animation: 'bounce 2.0s infinite ease-in-out',
  } as CSSProperties

  const bounceStyle2 = {
    ...bounceStyle,
    animationDelay: '-1.0s',
  }

  const keyframes = `
        @keyframes bounce {
          0%, 100% {
            transform: scale(0.0);
          } 50% {
            transform: scale(1.0);
          }
        }
      `

  return (
    <>
      <style>{keyframes}</style>
      <div style={spinnerStyle}>
        <div style={bounceStyle}></div>
        <div style={bounceStyle2}></div>
      </div>
    </>
  )
}
