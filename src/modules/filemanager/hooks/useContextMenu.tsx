import { useState, useRef } from 'react'
import { useClickOutside } from './useClickOutside'
import { Point } from '../utils/common'

export function useContextMenu<T extends Element = HTMLDivElement>() {
  const [showContext, setShowContext] = useState(false)
  const [pos, setPos] = useState<Point>({ x: 0, y: 0 })
  const contextRef = useRef<T | null>(null)

  function handleContextMenu(e: React.MouseEvent<T> | MouseEvent) {
    e.preventDefault()
    const clientX = (e as MouseEvent).clientX ?? (e as React.MouseEvent).clientX
    const clientY = (e as MouseEvent).clientY ?? (e as React.MouseEvent).clientY

    setShowContext(true)
    setPos({ x: clientX, y: clientY })
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
