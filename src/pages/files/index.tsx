import { ReactElement, useContext } from 'react'

import { Container } from '@material-ui/core'

import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context } from '../../providers/Bee'
import Download from './Download'
import Upload from './Upload'
import TabsContainer from '../../components/TabsContainer'

export default function Files(): ReactElement {
  const { status } = useContext(Context)

  if (!status.all) return <TroubleshootConnectionCard />

  return (
    <Container maxWidth="sm">
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
    </Container>
  )
}
