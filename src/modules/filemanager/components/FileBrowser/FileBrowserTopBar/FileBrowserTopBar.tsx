import { ReactElement } from 'react'
import './FileBrowserTopBar.scss'

interface FileBrowserTopBarProps {
  label: string
}

export function FileBrowserTopBar({ label }: FileBrowserTopBarProps): ReactElement {
  return <div className="fm-file-browser-top-bar">{label}</div>
}
