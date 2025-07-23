import { ReactElement } from 'react'
import './FileBrowserTopBar.scss'
import { useView } from '../../../providers/FileViewContext'

export function FileBrowserTopBar(): ReactElement {
  const { actualItemView } = useView()

  return <div className="fm-file-browser-top-bar">{actualItemView}</div>
}
