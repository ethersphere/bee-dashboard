import { ReactElement, useContext, useEffect, useMemo, useRef, useState } from 'react'
import FileIcon from 'remixicon-react/File2LineIcon'
import FilterIcon from 'remixicon-react/FilterLineIcon'
import SearchIcon from 'remixicon-react/SearchLineIcon'

import { useSearch } from '../../../../pages/filemanager/SearchContext'
import { Context as FMContext } from '../../../../providers/FileManager'

import './Header.scss'

// Defaults used to determine “active filters”
const DEFAULT_FILTERS = {
  scope: 'selected' as 'selected' | 'all',
  includeActive: true,
  includeTrashed: false,
}

export function Header(): ReactElement {
  const {
    query,
    setQuery,
    clear,
    scope,
    setScope,
    includeActive,
    setIncludeActive,
    includeTrashed,
    setIncludeTrashed,
  } = useSearch()

  const { currentDrive } = useContext(FMContext)

  const currentDriveName = useMemo(() => {
    return currentDrive?.name || ''
  }, [currentDrive])

  const [openFilters, setOpenFilters] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  const filtersActive = useMemo(() => {
    return (
      scope !== DEFAULT_FILTERS.scope ||
      includeActive !== DEFAULT_FILTERS.includeActive ||
      includeTrashed !== DEFAULT_FILTERS.includeTrashed
    )
  }, [scope, includeActive, includeTrashed])

  const resetFilters = () => {
    setScope(DEFAULT_FILTERS.scope)
    setIncludeActive(DEFAULT_FILTERS.includeActive)
    setIncludeTrashed(DEFAULT_FILTERS.includeTrashed)
  }

  useEffect(() => {
    if (!openFilters) return
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node

      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return
      setOpenFilters(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenFilters(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)

    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [openFilters])

  return (
    <div className="fm-header-container">
      <div className="fm-header-left">
        <div className="fm-header-logo" aria-hidden>
          <FileIcon />
        </div>
        <div className="fm-header-title">File Manager</div>
      </div>

      <div className="fm-header-search">
        <SearchIcon className="fm-header-search-icon" size="16px" aria-hidden />
        <input
          type="text"
          placeholder="Search files by name or type…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') clear()
          }}
          aria-label="Search files"
        />
        {query && (
          <button
            type="button"
            className="fm-header-search-clear"
            aria-label="Clear search"
            onClick={clear}
            title="Clear"
          >
            ×
          </button>
        )}
      </div>

      <div className="fm-header-actions">
        <button
          ref={btnRef}
          type="button"
          className="fm-filter-btn"
          aria-haspopup="menu"
          aria-expanded={openFilters}
          onClick={() => setOpenFilters(v => !v)}
          title={filtersActive ? 'Filters (active)' : 'Filters'}
          style={{ color: filtersActive ? 'orange' : undefined }}
        >
          <FilterIcon size="16px" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Filters
            {filtersActive && (
              <span
                aria-label="Filters active"
                title="Filters active"
                // tiny inline badge, no external CSS
                style={{
                  fontWeight: 700,
                  fontSize: 11,
                  lineHeight: 1,
                  padding: '0 4px',
                  borderRadius: 8,
                  border: '1px solid orange',
                  color: 'orange',
                  marginLeft: 2,
                }}
              >
                !
              </span>
            )}
          </span>
        </button>

        {openFilters && (
          <div className="fm-filter-menu" role="menu" ref={menuRef}>
            <div className="fm-filter-group" role="radiogroup" aria-label="Search scope">
              <div className="fm-filter-group-title">Scope</div>
              <label className="fm-filter-row">
                <input
                  type="radio"
                  name="fm-scope"
                  checked={scope === 'selected'}
                  onChange={() => setScope('selected')}
                />
                <span title={currentDriveName ? `Search in ${currentDriveName}` : 'Search in selected drive'}>
                  Selected{currentDriveName ? ` — ${currentDriveName}` : ''}
                </span>
              </label>
              <label className="fm-filter-row">
                <input type="radio" name="fm-scope" checked={scope === 'all'} onChange={() => setScope('all')} />
                <span>All drives</span>
              </label>
            </div>

            <div className="fm-filter-sep" />

            <div className="fm-filter-group" aria-label="Status">
              <div className="fm-filter-group-title">Status</div>
              <label className="fm-filter-row">
                <input type="checkbox" checked={includeActive} onChange={e => setIncludeActive(e.target.checked)} />
                <span>Active</span>
              </label>
              <label className="fm-filter-row">
                <input type="checkbox" checked={includeTrashed} onChange={e => setIncludeTrashed(e.target.checked)} />
                <span>Trash</span>
              </label>
            </div>

            <div className="fm-filter-sep" />

            <div className="fm-filter-group" role="group" aria-label="Reset">
              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters to default"
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                }}
              >
                Reset to default
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
