import './VersionList.scss'
import '../../../styles/global.scss'
import { memo, useState, useCallback, useContext } from 'react'

import { Button } from '../../Button/Button'
import CalendarIcon from 'remixicon-react/CalendarLineIcon'
import UserIcon from 'remixicon-react/UserLineIcon'
import DownloadIcon from 'remixicon-react/Download2LineIcon'

import { FileInfo } from '@solarpunkltd/file-manager-lib'

import { Context as FMContext } from '../../../../../providers/FileManager'
import { capitalizeFirstLetter, formatBytes, indexStrToBigint } from '../../../utils/common'
import { startDownloadingQueue } from '../../../utils/download'
import { ActionTag, DownloadProgress, TrackDownloadProps } from '../../../constants/transfers'
import { Context as SettingsContext } from '../../../../../providers/Settings'
import { useContextMenu } from '../../../hooks/useContextMenu'

export const truncateNameMiddle = (s: string, max = 42): string => {
  const str = String(s)

  if (str.length <= max) return str
  const half = Math.floor((max - 1) / 2)

  return `${str.slice(0, half)}…${str.slice(-half)}`
}

interface VersionListProps {
  versions: FileInfo[]
  headFi: FileInfo
  onDownload: (props: TrackDownloadProps) => (dp: DownloadProgress) => void
  restoreVersion: (fi: FileInfo) => Promise<void>
}

function formatMaybeIso(s?: string): string | undefined {
  if (!s) return undefined
  const d = new Date(s)

  return isNaN(d.getTime()) ? undefined : d.toLocaleString()
}

type LifecycleMetaConf = { className: string; label: (fi: FileInfo) => string }
const LIFECYCLE_META: Record<ActionTag, LifecycleMetaConf> = {
  trashed: { className: 'vh-tag--trashed', label: () => capitalizeFirstLetter(ActionTag.Trashed) },
  recovered: { className: 'vh-tag--recovered', label: () => capitalizeFirstLetter(ActionTag.Recovered) },
  restored: {
    className: 'vh-tag--restored',
    label: fi => {
      const from = fi.customMetadata?.lifecycleFrom?.trim()

      return from ? `Restored ${from}` : capitalizeFirstLetter(ActionTag.Restored)
    },
  },
}

function readLifecycleRaw(fi: FileInfo): string {
  return (fi.customMetadata?.lifecycle || '').trim().toLowerCase()
}

function hasSecondaryTrashOrRecovered(fi: FileInfo): boolean {
  if (readLifecycleRaw(fi) !== ActionTag.Restored) return false
  const src = (fi.customMetadata?.restoredFromLifecycle || '').trim().toLowerCase()

  return src === ActionTag.Trashed || src === ActionTag.Recovered
}

function isMinimizable(fi: FileInfo): boolean {
  const raw = readLifecycleRaw(fi)

  return raw === ActionTag.Trashed || raw === ActionTag.Recovered || hasSecondaryTrashOrRecovered(fi)
}

function getPrimaryLifecycle(fi: FileInfo) {
  const raw = readLifecycleRaw(fi) as keyof typeof LIFECYCLE_META
  const conf = LIFECYCLE_META[raw as ActionTag] as LifecycleMetaConf | undefined
  const label = conf?.label(fi)
  const cls = conf?.className
  const at =
    formatMaybeIso(fi.customMetadata?.lifecycleAt) ||
    (fi.timestamp ? new Date(fi.timestamp).toLocaleString() : undefined)

  return { label, cls, at }
}

function getSecondaryLifecycleIfRestored(fi: FileInfo) {
  const raw = readLifecycleRaw(fi)

  if (raw !== ActionTag.Restored) return { label: undefined, cls: undefined, at: undefined }

  const src = (fi.customMetadata?.restoredFromLifecycle || '').trim().toLowerCase()
  const isSupported = src === ActionTag.Trashed || src === ActionTag.Recovered

  if (!isSupported) return { label: undefined, cls: undefined, at: undefined }

  const conf = LIFECYCLE_META[src as ActionTag.Trashed | ActionTag.Recovered]
  const at =
    formatMaybeIso(fi.customMetadata?.restoredFromLifecycleAt) ||
    (fi.timestamp ? new Date(fi.timestamp).toLocaleString() : undefined)

  return { label: conf.label(fi), cls: conf.className, at }
}

type VersionRowProps = {
  item: FileInfo
  headFi: FileInfo
  isCurrent: boolean
  fmDownload: (fi: FileInfo) => void
  onRestore: (fi: FileInfo) => void
  collapsed: boolean
  onToggle: () => void
}

function ToggleButton({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`vh-toggle ${collapsed ? '' : 'is-open'}`}
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Expand version details' : 'Collapse version details'}
      onClick={onToggle}
    >
      <span className="vh-toggle-icon" />
    </button>
  )
}

function LifecycleBadges({
  lifeLabel,
  lifeClass,
  lifeAt,
  secLabel,
  secClass,
  secAt,
}: {
  lifeLabel?: string
  lifeClass?: string
  lifeAt?: string
  secLabel?: string
  secClass?: string
  secAt?: string
}) {
  if (!lifeLabel) return null

  return (
    <>
      <span className="vh-dot">•</span>
      <span
        className={`vh-tag vh-tag--lifecycle ${lifeClass ?? ''}`}
        title={lifeAt ? `${lifeLabel} at ${lifeAt}` : lifeLabel}
      >
        {lifeLabel}
      </span>

      {secLabel && (
        <>
          <span className="vh-dot">•</span>
          <span
            className={`vh-tag vh-tag--lifecycle ${secClass ?? ''}`}
            title={secAt ? `${secLabel} at ${secAt}` : secLabel}
          >
            {secLabel}
          </span>
        </>
      )}
    </>
  )
}

function MetaItems({ modified }: { modified: string }) {
  return (
    <>
      <span className="vh-dot">•</span>
      <span className="vh-meta-item" title={modified}>
        <CalendarIcon size="12" /> {modified}
      </span>
      <span className="vh-dot">•</span>
      <span className="vh-meta-item" title="Publisher">
        <UserIcon size="12" />
      </span>
    </>
  )
}

function MinimizedRow({
  idx,
  onToggle,
  lifeLabel,
  lifeClass,
  lifeAt,
  secLabel,
  secClass,
  secAt,
}: {
  idx: bigint
  onToggle: () => void
  lifeLabel?: string
  lifeClass?: string
  lifeAt?: string
  secLabel?: string
  secClass?: string
  secAt?: string
}) {
  return (
    <div className="fm-modal-white-section vh-row is-collapsed minimized">
      <div className="vh-left">
        <div className="vh-meta">
          <button
            type="button"
            className="vh-toggle"
            aria-expanded="false"
            aria-label="Expand version details"
            onClick={onToggle}
          >
            <span className="vh-toggle-icon" />
          </button>

          <span className="vh-chip" title={`Version ${idx.toString()}`}>
            v{idx.toString()}
          </span>

          {(lifeLabel === capitalizeFirstLetter(ActionTag.Trashed) ||
            lifeLabel === capitalizeFirstLetter(ActionTag.Recovered)) && (
            <>
              <span className="vh-dot">•</span>
              <span
                className={`vh-tag vh-tag--lifecycle ${lifeClass ?? ''}`}
                title={lifeAt ? `${lifeLabel} at ${lifeAt}` : lifeLabel}
              >
                {lifeLabel}
              </span>
            </>
          )}

          {secLabel &&
            (secLabel === capitalizeFirstLetter(ActionTag.Trashed) ||
              secLabel === capitalizeFirstLetter(ActionTag.Recovered)) && (
              <>
                <span className="vh-dot">•</span>
                <span
                  className={`vh-tag vh-tag--lifecycle ${secClass ?? ''}`}
                  title={secAt ? `${secLabel} at ${secAt}` : secLabel}
                >
                  {secLabel}
                </span>
              </>
            )}
        </div>
      </div>
    </div>
  )
}

type RowFullProps = {
  idx: bigint
  item: FileInfo
  headFi: FileInfo
  isCurrent: boolean
  fmDownload: (fi: FileInfo) => void
  onRestore: (fi: FileInfo) => void
  collapsed: boolean
  onToggle: () => void
  modified: string
  lifeLabel?: string
  lifeClass?: string
  lifeAt?: string
  secLabel?: string
  secClass?: string
  secAt?: string
}

const RowFull = memo(
  ({
    idx,
    item,
    headFi,
    isCurrent,
    fmDownload,
    onRestore,
    collapsed,
    onToggle,
    modified,
    lifeLabel,
    lifeClass,
    lifeAt,
    secLabel,
    secClass,
    secAt,
  }: RowFullProps) => {
    const willRename = headFi.name !== item.name

    return (
      <div className={`fm-modal-white-section vh-row ${collapsed ? 'is-collapsed' : ''}`}>
        <div className="vh-left">
          <div className="vh-meta">
            <ToggleButton collapsed={collapsed} onToggle={onToggle} />

            <span className="vh-chip" title={`Version ${idx.toString()}`}>
              v{idx.toString()}
            </span>

            {isCurrent && <span className="vh-tag vh-tag--current">Current</span>}

            <LifecycleBadges
              lifeLabel={lifeLabel}
              lifeClass={lifeClass}
              lifeAt={lifeAt}
              secLabel={secLabel}
              secClass={secClass}
              secAt={secAt}
            />

            <MetaItems modified={modified} />
          </div>

          {!collapsed && lifeAt && lifeLabel && (
            <div className="vh-lifecycle-note">
              {lifeLabel} <span className="vh-soft">·</span> {lifeAt}
            </div>
          )}

          {!collapsed && willRename && !isCurrent && (
            <div className="vh-rename" title={`Restoring will rename: “${headFi.name}” → “${item.name}”`}>
              Restoring will rename{' '}
              <b className="vh-name" title={headFi.name}>
                {truncateNameMiddle(headFi.name, 44)}
              </b>{' '}
              →{' '}
              <b className="vh-name" title={item.name}>
                {truncateNameMiddle(item.name, 44)}
              </b>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="vh-actions">
            <Button
              label="Download"
              variant="secondary"
              icon={<DownloadIcon size="15" />}
              onClick={() => fmDownload(item)}
            />
            {!isCurrent && <Button label="Restore" variant="primary" onClick={() => onRestore(item)} />}
          </div>
        )}
      </div>
    )
  },
)

RowFull.displayName = 'RowFull'

const VersionRow = memo(({ item, headFi, isCurrent, fmDownload, onRestore, collapsed, onToggle }: VersionRowProps) => {
  const idx = indexStrToBigint(item.version)

  if (idx === undefined) return null

  const modified = item.timestamp !== undefined ? new Date(item.timestamp).toLocaleString() : '—'
  const { label: lifeLabel, cls: lifeClass, at: lifeAt } = getPrimaryLifecycle(item)
  const { label: secLabel, cls: secClass, at: secAt } = getSecondaryLifecycleIfRestored(item)
  const minimized = collapsed && isMinimizable(item)

  if (minimized) {
    return (
      <MinimizedRow
        idx={idx}
        onToggle={onToggle}
        lifeLabel={lifeLabel}
        lifeClass={lifeClass}
        lifeAt={lifeAt}
        secLabel={secLabel}
        secClass={secClass}
        secAt={secAt}
      />
    )
  }

  return (
    <RowFull
      idx={idx}
      item={item}
      headFi={headFi}
      isCurrent={isCurrent}
      fmDownload={fmDownload}
      onRestore={onRestore}
      collapsed={collapsed}
      onToggle={onToggle}
      modified={modified}
      lifeLabel={lifeLabel}
      lifeClass={lifeClass}
      lifeAt={lifeAt}
      secLabel={secLabel}
      secClass={secClass}
      secAt={secAt}
    />
  )
})

VersionRow.displayName = 'VersionRow'

export function VersionsList({ versions, headFi, restoreVersion, onDownload }: VersionListProps) {
  const { handleCloseContext } = useContextMenu<HTMLDivElement>()

  const { fm } = useContext(FMContext)
  const { beeApi } = useContext(SettingsContext)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = useCallback(
    (key: string, fi: FileInfo) => {
      setExpanded(prev => {
        const next = { ...prev }
        const hasValue = Object.prototype.hasOwnProperty.call(next, key)

        if (hasValue) {
          next[key] = !next[key]
        } else {
          const isCurrent = indexStrToBigint(fi.version) === indexStrToBigint(headFi.version)
          const defaultCollapsed = !isCurrent

          next[key] = defaultCollapsed
        }

        return next
      })
    },
    [headFi],
  )

  const handleDownload = useCallback(
    async (fileInfo: FileInfo) => {
      handleCloseContext()

      if (!fm || !beeApi) return
      const rawSize = fileInfo.customMetadata?.size
      const expectedSize = rawSize ? Number(rawSize) : undefined
      await startDownloadingQueue(
        fm,
        [fileInfo],
        [onDownload({ name: fileInfo.name, size: formatBytes(rawSize), expectedSize })],
      )
    },
    [handleCloseContext, fm, beeApi, onDownload],
  )

  if (!versions.length || !fm) return null

  return (
    <div className="fm-version-history-list">
      {versions.map(item => {
        const idx = indexStrToBigint(item.version)

        if (idx === undefined) return null

        const key = `${item.topic.toString()}:${idx.toString()}`
        const hasExplicit = Object.prototype.hasOwnProperty.call(expanded, key)

        const isCurrent = indexStrToBigint(headFi.version) === idx
        const defaultCollapsed = !isCurrent

        const collapsed = hasExplicit ? !expanded[key] : defaultCollapsed

        return (
          <VersionRow
            key={key}
            item={item}
            headFi={headFi}
            isCurrent={Boolean(isCurrent)}
            fmDownload={() => handleDownload(item)}
            onRestore={restoreVersion}
            collapsed={collapsed}
            onToggle={() => toggle(key, item)}
          />
        )
      })}
    </div>
  )
}
