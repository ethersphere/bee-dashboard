import { ReactElement, useContext } from 'react'

import Download from './Download'
import Upload from './Upload'
import TabsContainer from '../../components/TabsContainer'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'

export default function Files(): ReactElement {
  const { status } = useContext(BeeContext)

  if (!status.all) return <TroubleshootConnectionCard />

  return (
    <TabsContainer
      values={[
        {
          label: 'download',
          component: <Download />,
        },
        {
          label: 'upload',
          component: <Upload />,
        },
      ]}
    />
  )
}
