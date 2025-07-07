import { ReactElement } from 'react'
import SearchIcon from 'remixicon-react/SearchLineIcon'
import FileIcon from 'remixicon-react/File2LineIcon'
import './Header.scss'

export function Header(): ReactElement {
  return (
    <div className="fm-header-container">
      <div className="fm-header-logo">
        <FileIcon />
      </div>
      <div className="fm-header-title">File Manager</div>
      <div className="fm-header-search">
        <SearchIcon color="#9f9f9f" size="16px" />
        <input type="text" placeholder="Quick search..." />
      </div>
    </div>
  )
}
