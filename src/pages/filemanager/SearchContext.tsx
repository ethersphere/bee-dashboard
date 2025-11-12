import { createContext, useContext, useMemo, useRef, useState, ReactNode, useCallback } from 'react'

type Scope = 'selected' | 'all'

export interface SearchState {
  query: string
  scope: Scope
  includeActive: boolean
  includeTrashed: boolean
  setQuery: (q: string) => void
  clear: () => void
  setScope: (s: Scope) => void
  setIncludeActive: (v: boolean) => void
  setIncludeTrashed: (v: boolean) => void
}

const Ctx = createContext<SearchState | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, _setQuery] = useState('')
  const [scope, setScope] = useState<Scope>('all')
  const [includeActive, setIncludeActive] = useState(true)
  const [includeTrashed, setIncludeTrashed] = useState(true)

  const preSearchState = useRef<{ scope: Scope; includeActive: boolean; includeTrashed: boolean } | null>(null)
  const inSearch = useRef(false)

  const setQuery = useCallback(
    (q: string) => {
      const trimmed = q.trim()

      if (!inSearch.current && trimmed.length > 0) {
        preSearchState.current = { scope, includeActive, includeTrashed }
        inSearch.current = true
      }

      if (inSearch.current && trimmed.length === 0) {
        const prev = preSearchState.current

        if (prev) {
          setScope(prev.scope)
          setIncludeActive(prev.includeActive)
          setIncludeTrashed(prev.includeTrashed)
        }
        preSearchState.current = null
        inSearch.current = false
      }

      _setQuery(q)
    },
    [scope, includeActive, includeTrashed],
  )

  const clear = useCallback(() => {
    setQuery('')
  }, [setQuery])

  const value = useMemo<SearchState>(
    () => ({
      query,
      scope,
      includeActive,
      includeTrashed,
      setQuery,
      clear,
      setScope,
      setIncludeActive,
      setIncludeTrashed,
    }),
    [query, scope, includeActive, includeTrashed, clear, setQuery],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSearch(): SearchState {
  const v = useContext(Ctx)

  if (!v) throw new Error('useFMSearch must be used within SearchProvider')

  return v
}
