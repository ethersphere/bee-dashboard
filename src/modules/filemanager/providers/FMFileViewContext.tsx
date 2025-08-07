import { createContext, useContext, useState, ReactNode } from 'react'
import { ViewType } from '../constants/constants'

interface ViewContextProps {
  view: ViewType
  setView: (view: ViewType) => void
  actualItemView?: string
  setActualItemView?: (view: string) => void
}

const FMFileViewContext = createContext<ViewContextProps | undefined>(undefined)

export function FMFileViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>(ViewType.File)
  const [actualItemView, setActualItemView] = useState<string | undefined>(undefined)

  return (
    <FMFileViewContext.Provider
      value={{
        view,
        setView,
        actualItemView,
        setActualItemView,
      }}
    >
      {children}
    </FMFileViewContext.Provider>
  )
}

export function useView() {
  const context = useContext(FMFileViewContext)

  if (!context) {
    throw new Error('useView must be used within a FMFileViewProvider')
  }

  return context
}
