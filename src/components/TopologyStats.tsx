import type { Topology } from '@ethersphere/bee-js'
import { Grid } from '@material-ui/core/'
import type { ReactElement } from 'react'
import StatCard from './StatCard'

interface Props {
  isLoading: boolean
  topology: Topology | null
  error: Error | null // FIXME: should display error
}

const TopologyStats = ({ isLoading, topology }: Props): ReactElement => (
  <Grid style={{ marginBottom: '20px', flexGrow: 1 }}>
    <Grid container spacing={3}>
      <Grid key={1} item xs={12} sm={12} md={6} lg={4} xl={4}>
        <StatCard label="Connected Peers" statistic={topology?.connected.toString()} loading={isLoading} />
      </Grid>
      <Grid key={2} item xs={12} sm={12} md={6} lg={4} xl={4}>
        <StatCard label="Population" statistic={topology?.population.toString()} loading={isLoading} />
      </Grid>
      <Grid key={3} item xs={12} sm={12} md={6} lg={4} xl={4}>
        <StatCard label="Depth" statistic={topology?.depth.toString()} loading={isLoading} />
      </Grid>
    </Grid>
  </Grid>
)

export default TopologyStats
