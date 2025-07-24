import { ReactElement } from 'react'
import './FileBrowserTopBar.scss'
import { useView } from '../../../providers/FMFileViewContext'

export function FileBrowserTopBar(): ReactElement {
  const { actualItemView } = useView()

  return <div className="fm-file-browser-top-bar">{actualItemView}</div>
}
