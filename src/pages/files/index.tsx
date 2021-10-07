import type { ReactElement } from 'react'

import Download from './Download'
import Upload from './Upload'
import TabsContainer from '../../components/TabsContainer'

export default function Files(): ReactElement {
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
