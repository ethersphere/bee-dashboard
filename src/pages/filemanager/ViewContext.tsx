import { createContext, useContext, useState, ReactNode } from 'react'
import { ViewType } from '../../modules/filemanager/constants/transfers'

interface ViewContextProps {
  view: ViewType
  setView: (view: ViewType) => void
  actualItemView?: string
  setActualItemView?: (view: string) => void
}

const ViewContext = createContext<ViewContextProps | undefined>(undefined)

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>(ViewType.File)
  const [actualItemView, setActualItemView] = useState<string | undefined>(undefined)

  return (
    <ViewContext.Provider
      value={{
        view,
        setView,
        actualItemView,
        setActualItemView,
      }}
    >
      {children}
    </ViewContext.Provider>
  )
}

export function useView() {
  const context = useContext(ViewContext)

  if (!context) {
    throw new Error('useView must be used within a ViewProvider')
  }

  return context
}
