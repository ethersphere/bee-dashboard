import { ReactElement } from 'react'
import DownIcon from 'remixicon-react/ArrowDownSLineIcon'

import { useBulkActions } from '../../../hooks/useBulkActions'
import { SortDir, SortKey } from '../../../hooks/useSorting'

import { capitalizeFirstLetter } from '@/modules/filemanager/utils/common'

interface FileBrowserHeaderProps {
  isSearchMode: boolean
  bulk: ReturnType<typeof useBulkActions>
  sortKey: SortKey
  sortDir: SortDir
  onSortName: () => void
  onSortSize: () => void
  onSortDate: () => void
  onSortDrive: () => void
  onClearSort: () => void
}

enum AriaSortValue {
  Ascending = 'ascending',
  Descending = 'descending',
  None = 'none',
}

const Arrow = ({ active, dir }: { active: boolean; dir: SortDir }) => {
  let title: string | undefined

  if (active) {
    const sortValue = dir === SortDir.Asc ? AriaSortValue.Ascending : AriaSortValue.Descending
    title = capitalizeFirstLetter(sortValue)
  } else {
    title = undefined
  }

  return (
    <div
      className={'fm-file-browser-content-header-item-icon' + (active ? '' : ' is-inactive')}
      aria-hidden={title ? 'false' : 'true'}
      aria-label={title}
      title={title}
    >
      <DownIcon size="16px" />
    </div>
  )
}

function HeaderCell({
  label,
  isActive,
  dir,
  onToggle,
  onClear,
  ariaSort,
  'data-testid': testId,
}: {
  label: string
  isActive: boolean
  dir: SortDir
  onToggle: () => void
  onClear: () => void
  ariaSort: AriaSortValue
  'data-testid'?: string
}) {
  return (
    <div className="fm-header-cell" role="columnheader" aria-sort={ariaSort} data-testid={testId}>
      <button
        type="button"
        className="fm-header-button"
        onClick={onToggle}
        data-dir={isActive ? dir : undefined}
        aria-label={
          isActive
            ? `Sort by ${label.toLowerCase()}, currently ${
                dir === SortDir.Asc ? AriaSortValue.Ascending : AriaSortValue.Descending
              }`
            : `Sort by ${label.toLowerCase()}`
        }
        title={
          isActive
            ? `Currently ${capitalizeFirstLetter(
                dir === SortDir.Asc ? AriaSortValue.Ascending : AriaSortValue.Descending,
              )}`
            : 'Click to sort'
        }
      >
        <span>{label}</span>
        <Arrow active={isActive} dir={dir} />
      </button>

      {isActive && (
        <button
          type="button"
          className="fm-sort-clear"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onClear()
          }}
          aria-label="Reset sorting to default"
          title="Clear sorting"
        >
          ×
        </button>
      )}
    </div>
  )
}

export function FileBrowserHeader({
  isSearchMode,
  bulk,
  sortKey,
  sortDir,
  onSortName,
  onSortSize,
  onSortDate,
  onSortDrive,
  onClearSort,
}: FileBrowserHeaderProps): ReactElement {
  const ariaSort = (thisKey: SortKey): AriaSortValue => {
    if (sortKey !== thisKey) return AriaSortValue.None

    return sortDir === SortDir.Asc ? AriaSortValue.Ascending : AriaSortValue.Descending
  }

  return (
    <div className="fm-file-browser-content-header" role="row">
      <input
        type="checkbox"
        checked={bulk.allChecked}
        ref={el => {
          if (el) el.indeterminate = bulk.someChecked
        }}
        onChange={e => (e.target.checked ? bulk.selectAll() : bulk.clearAll())}
      />

      <div className="fm-file-browser-content-header-item fm-name">
        <HeaderCell
          label="Name"
          isActive={sortKey === SortKey.Name}
          dir={sortDir}
          onToggle={onSortName}
          onClear={onClearSort}
          ariaSort={ariaSort(SortKey.Name)}
          data-testid="hdr-name"
        />
      </div>

      {isSearchMode && (
        <div className="fm-file-browser-content-header-item fm-drive">
          <HeaderCell
            label="Drive"
            isActive={sortKey === SortKey.Drive}
            dir={sortDir}
            onToggle={onSortDrive}
            onClear={onClearSort}
            ariaSort={ariaSort(SortKey.Drive)}
            data-testid="hdr-drive"
          />
        </div>
      )}

      <div className="fm-file-browser-content-header-item fm-size">
        <HeaderCell
          label="Size"
          isActive={sortKey === SortKey.Size}
          dir={sortDir}
          onToggle={onSortSize}
          onClear={onClearSort}
          ariaSort={ariaSort(SortKey.Size)}
          data-testid="hdr-size"
        />
      </div>

      <div className="fm-file-browser-content-header-item fm-date-mod">
        <HeaderCell
          label="Date mod."
          isActive={sortKey === SortKey.Timestamp}
          dir={sortDir}
          onToggle={onSortDate}
          onClear={onClearSort}
          ariaSort={ariaSort(SortKey.Timestamp)}
          data-testid="hdr-date"
        />
      </div>
    </div>
  )
}
