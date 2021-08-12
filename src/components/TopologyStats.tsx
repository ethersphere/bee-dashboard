import type { Topology } from '@ethersphere/bee-js'
import { Grid } from '@material-ui/core/'
import type { ReactElement } from 'react'
import StatCard from './StatCard'

interface Props {
  isLoading: boolean
  topology: Topology | null
  error: Error | null // FIXME: should display error
}

interface Threshold {
  minimumValue: number
  explanation: string
}

type Thresholds = {
  connectedPeers: Threshold[]
  population: Threshold[]
  depth: Threshold[]
}

const GENERIC_ERROR = 'There may be issues with your Node or connection.'

const THRESHOLDS: Thresholds = {
  connectedPeers: [
    {
      minimumValue: 200,
      explanation: 'Perfect! 200 or more connected peers indicate a healthy topology.',
    },
    {
      minimumValue: 1,
      explanation:
        'Your Node is connected to peers, but this number should ideally be above 200. If you have only started your Node, this number may increase quickly.',
    },
    {
      minimumValue: 0,
      explanation: 'Your Node has not connected to any peers. ' + GENERIC_ERROR,
    },
  ],
  population: [
    {
      minimumValue: 100_000,
      explanation:
        'Perfect! Your Node seems to have a realistic value for the network size, which means everything is working well on your end.',
    },
    {
      minimumValue: 1,
      explanation:
        'Population is usually above 100,000. If the number does not increase within a few hours, there may be issues with your Node.',
    },
    {
      minimumValue: 0,
      explanation: 'Your Node has no information on the network population. ' + GENERIC_ERROR,
    },
  ],
  depth: [
    {
      minimumValue: 12,
      explanation: 'Perfect! Your Node has the highest available depth.',
    },
    {
      minimumValue: 1,
      explanation:
        'Your Node is supposed to reach a depth of 12 eventually. Stagnation or decrease in this number may indicate problems with your Node.',
    },
    { minimumValue: 0, explanation: 'Your Node has not started building its topology yet. ' + GENERIC_ERROR },
  ],
}

const pickExplanation = (key: keyof Thresholds, value: number): string => {
  const thresholds = THRESHOLDS[key]
  for (const item of thresholds) {
    if (value >= item.minimumValue) {
      return item.explanation
    }
  }
  throw Error(`Could not find any threshold for ${key} with value ${value}`)
}

const TopologyStats = (props: Props): ReactElement => (
  <>
    <Indicator {...props} />
    <Metrics {...props} />
  </>
)

const Indicator = ({ isLoading }: Props): ReactElement => (
  <div style={{ marginBottom: '20px' }}>
    <StatCard
      label="Overall Health Indicator"
      statistic="Healthy"
      loading={isLoading}
      details="All connectivity stats seem to be in perfect shape! "
    />
  </div>
)

const Metrics = ({ isLoading, topology }: Props): ReactElement => (
  <Grid style={{ marginBottom: '20px', flexGrow: 1 }}>
    <Grid container spacing={3}>
      <Grid key={1} item xs={12} sm={12} md={6} lg={4} xl={4}>
        <StatCard
          label="Connected Peers"
          statistic={topology?.connected.toString()}
          loading={isLoading}
          details={pickExplanation('connectedPeers', topology?.connected || 0)}
        />
      </Grid>
      <Grid key={2} item xs={12} sm={12} md={6} lg={4} xl={4}>
        <StatCard
          label="Population"
          statistic={topology?.population.toString()}
          loading={isLoading}
          details={pickExplanation('population', topology?.population || 0)}
        />
      </Grid>
      <Grid key={3} item xs={12} sm={12} md={6} lg={4} xl={4}>
        <StatCard
          label="Depth"
          statistic={topology?.depth.toString()}
          loading={isLoading}
          details={pickExplanation('depth', topology?.depth || 0)}
        />
      </Grid>
    </Grid>
  </Grid>
)

export default TopologyStats
