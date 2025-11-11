import { Point, Dir } from './common'

export function computeContextMenuPosition(args: {
  clickPos: Point
  menuRect: DOMRect
  viewport: { w: number; h: number }
  margin?: number
  containerRect?: DOMRect | null
}): { safePos: Point; dropDir: Dir } {
  const { clickPos: pos, menuRect: rect, viewport } = args
  const margin = args.margin ?? 8
  const left = Math.max(margin, Math.min(pos.x, viewport.w - rect.width - margin))
  const vh = viewport.h
  let top = pos.y
  let dir: Dir = Dir.Down

  const spaceBelow = vh - pos.y

  if (spaceBelow < rect.height * 1.4) {
    top = Math.max(margin, pos.y - rect.height - margin)
    dir = Dir.Up
  } else {
    top = Math.max(margin, Math.min(pos.y, vh - rect.height - margin))
  }

  return { safePos: { x: left, y: top }, dropDir: dir }
}
