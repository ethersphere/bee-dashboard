import type { Topology } from '@ethersphere/bee-js'
import type { ReactElement } from 'react'
import { pickThreshold, ThresholdValues } from '../utils/threshold'
import ExpandableList from './ExpandableList'
import ExpandableListItem from './ExpandableListItem'

interface RootProps {
  topology: Topology | null
}

interface Props extends RootProps {
  thresholds: ThresholdValues
}

const TopologyStats = (props: RootProps): ReactElement => {
  const thresholds: ThresholdValues = {
    connectedPeers: pickThreshold('connectedPeers', props.topology?.connected || 0),
    population: pickThreshold('population', props.topology?.population || 0),
    depth: pickThreshold('depth', props.topology?.depth || 0),
  }

  return (
    <ExpandableList label="Connectivity" defaultOpen>
      <Indicator {...props} thresholds={thresholds} />
      <ExpandableListItem
        label="Connected Peers"
        value={props.topology?.connected.toString()}
        tooltip={thresholds.connectedPeers.explanation}
      />
      <ExpandableListItem
        label="Pupulation"
        value={props.topology?.population.toString()}
        tooltip={thresholds.population.explanation}
      />
      <ExpandableListItem
        label="Depth"
        value={props.topology?.depth.toString()}
        tooltip={thresholds.depth.explanation}
      />
    </ExpandableList>
  )
}

const Indicator = ({ thresholds }: Props): ReactElement => {
  const maximumTotalScore = Object.values(thresholds).reduce((sum, item) => sum + item.maximumScore, 0)
  const actualTotalScore = Object.values(thresholds).reduce((sum, item) => sum + item.score, 0)
  const percentageText = Math.round((actualTotalScore / maximumTotalScore) * 100) + '%'

  return <ExpandableListItem label="Overall Health Indicator" value={percentageText} />
}

export default TopologyStats
