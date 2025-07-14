import { useState, useRef } from 'react'
import { useClickOutside } from './useClickOutside'

export function useContextMenu<T extends Element = HTMLDivElement>() {
  const [showContext, setShowContext] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const contextRef = useRef<T | null>(null)

  function handleContextMenu(e: React.MouseEvent<T>) {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setShowContext(true)
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  function handleCloseContext() {
    setShowContext(false)
  }

  useClickOutside(contextRef, handleCloseContext, showContext)

  return {
    showContext,
    setShowContext,
    pos,
    setPos,
    contextRef,
    handleContextMenu,
    handleCloseContext,
  }
}
