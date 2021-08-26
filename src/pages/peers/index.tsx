import PeerTable from './PeerTable'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'

import { Context } from '../../providers/Bee'
import TopologyStats from '../../components/TopologyStats'
import { ReactElement, useContext } from 'react'

export default function Peers(): ReactElement {
  const { topology, peers, status } = useContext(Context)

  if (!status.all) {
    return <TroubleshootConnectionCard />
  }

  return (
    <>
      <TopologyStats topology={topology} />
      <PeerTable peers={peers} />
    </>
  )
}
