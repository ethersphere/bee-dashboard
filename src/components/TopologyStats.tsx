import type { Topology } from '@upcoming/bee-js'
import type { ReactElement } from 'react'
import { pickThreshold, ThresholdValues } from '../utils/threshold'
import ExpandableListItem from './ExpandableListItem'

interface Props {
  topology: Topology | null
}

const TopologyStats = (props: Props): ReactElement => {
  const thresholds: ThresholdValues = {
    connectedPeers: pickThreshold('connectedPeers', props.topology?.connected || 0),
    population: pickThreshold('population', props.topology?.population || 0),
    depth: pickThreshold('depth', props.topology?.depth || 0),
  }

  const maximumTotalScore = Object.values(thresholds).reduce((sum, item) => sum + item.maximumScore, 0)
  const actualTotalScore = Object.values(thresholds).reduce((sum, item) => sum + item.score, 0)
  const percentageText = Math.round((actualTotalScore / maximumTotalScore) * 100) + '%'

  return (
    <>
      <ExpandableListItem label="Overall Health Indicator" value={percentageText} />
      <ExpandableListItem
        label="Connected Peers"
        value={props.topology?.connected.toString()}
        tooltip={thresholds.connectedPeers.explanation}
      />
      <ExpandableListItem
        label="Population"
        value={props.topology?.population.toString()}
        tooltip={thresholds.population.explanation}
      />
      <ExpandableListItem
        label="Depth"
        value={props.topology?.depth.toString()}
        tooltip={thresholds.depth.explanation}
      />
    </>
  )
}

export default TopologyStats
