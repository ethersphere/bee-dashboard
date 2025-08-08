import { ReactElement, useContext, useEffect, useState } from 'react'
import './MainPage.scss'
import { Header } from '../../components/Header/Header'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { OwnerStatusBar } from '../../components/OwnerStatusBar/OwnerStatusBar'
import { FileBrowser } from '../../components/FileBrowser/FileBrowser'
import { FMFileViewProvider } from '../../providers/FMFileViewContext'
import { FMInitialModal } from '../../components/FMInitialModal/FMInitialModal'
import { getUsableStamps } from '../../utils/utils'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { PostageBatch } from '@ethersphere/bee-js'

export function MainPage(): ReactElement {
  const [showInitialModal, setShowInitialModal] = useState(false)
  const [ownerStamp, setOwnerStamp] = useState<PostageBatch | undefined>(undefined)
  const { beeApi } = useContext(SettingsContext)

  useEffect(() => {
    const getStamps = async () => {
      const stamps = await getUsableStamps(beeApi)

      const hasOwnerStamp = stamps.some(stamp => stamp.label === 'owner')

      if (!hasOwnerStamp) {
        setShowInitialModal(true)
      } else {
        setShowInitialModal(false)
        const ownerStamp = stamps.find(stamp => stamp.label === 'owner')

        if (ownerStamp) {
          setOwnerStamp(ownerStamp)
        }
      }
    }
    getStamps()
  }, [showInitialModal])

  return (
    <FMFileViewProvider>
      <div className="fm-main">
        {showInitialModal && (
          <FMInitialModal handleVisibility={(isVisible: boolean) => setShowInitialModal(isVisible)} />
        )}
        <Header />
        <div className="fm-main-content">
          <Sidebar />

          <FileBrowser />
        </div>
        <OwnerStatusBar ownerStamp={ownerStamp} />
      </div>
    </FMFileViewProvider>
  )
}
