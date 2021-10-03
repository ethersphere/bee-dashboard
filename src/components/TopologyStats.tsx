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
      <ExpandableListItem label="Connected Peers" value={props.topology?.connected.toString()} />
      <ExpandableListItem label="Pupulation" value={props.topology?.population.toString()} />
      <ExpandableListItem label="Depth" value={props.topology?.depth.toString()} />
    </ExpandableList>
  )
}

const Indicator = ({ thresholds }: Props): ReactElement => {
  const maximumTotalScore = Object.values(thresholds).reduce((sum, item) => sum + item.maximumScore, 0)
  const actualTotalScore = Object.values(thresholds).reduce((sum, item) => sum + item.score, 0)
  const percentageText = Math.round((actualTotalScore / maximumTotalScore) * 100) + '%'

  return <ExpandableListItem label="Overall Health Indicator" value={percentageText} />
}

// const Metrics = ({ topology, thresholds }: Props): ReactElement => (
//   <Grid container spacing={3} style={{ marginBottom: '20px' }}>
//     <Grid key={1} item xs={12} sm={12} md={6} lg={4} xl={4}>
//       <StatCard
//         label="Connected Peers"
//         statistic={topology?.connected.toString()}
//         tooltip={thresholds.connectedPeers.explanation}
//       />
//     </Grid>
//     <Grid key={2} item xs={12} sm={12} md={6} lg={4} xl={4}>
//       <StatCard
//         label="Population"
//         statistic={topology?.population.toString()}
//         tooltip={thresholds.population.explanation}
//       />
//     </Grid>
//     <Grid key={3} item xs={12} sm={12} md={6} lg={4} xl={4}>
//       <StatCard label="Depth" statistic={topology?.depth.toString()} tooltip={thresholds.depth.explanation} />
//     </Grid>
//   </Grid>
// )

export default TopologyStats
