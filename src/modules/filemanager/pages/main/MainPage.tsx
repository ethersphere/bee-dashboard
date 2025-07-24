import { ReactElement } from 'react'

import './MainPage.scss'
import { Header } from '../../components/Header/Header'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { OwnerStatusBar } from '../../components/OwnerStatusBar/OwnerStatusBar'
import { FileBrowser } from '../../components/FileBrowser/FileBrowser'
import { FMFileViewProvider } from '../../providers/FMFileViewContext'

export function MainPage(): ReactElement {
  return (
    <FMFileViewProvider>
      <div className="fm-main">
        <Header />
        <div className="fm-main-content">
          <Sidebar />

          <FileBrowser />
        </div>
        <OwnerStatusBar />
      </div>
    </FMFileViewProvider>
  )
}
