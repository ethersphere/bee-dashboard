import { createContext, useContext, useState, ReactNode } from 'react'
import { ViewType } from '../constants/constants'

interface ViewContextProps {
  view: ViewType
  setView: (view: ViewType) => void
  actualItemView?: string
  setActualItemView?: (view: string) => void
}

const FileViewContext = createContext<ViewContextProps | undefined>(undefined)

export function FileViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>(ViewType.File)
  const [actualItemView, setActualItemView] = useState<string | undefined>(undefined)

  return (
    <FileViewContext.Provider value={{ view, setView, actualItemView, setActualItemView }}>
      {children}
    </FileViewContext.Provider>
  )
}

export function useView() {
  const context = useContext(FileViewContext)

  if (!context) {
    throw new Error('useView must be used within a FileViewProvider')
  }

  return context
}
