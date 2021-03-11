import React from 'react'

import { Grid } from '@material-ui/core/';

import StatCard from '../../components/StatCard';
import PeerTable from './PeerTable';
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard';

import { useApiNodeTopology, useApiNodePeers } from '../../hooks/apiHooks';

export default function Peers(props: any) {
    const { nodeTopology, isLoadingNodeTopology } = useApiNodeTopology()
    const { nodePeers, isLoadingNodePeers } = useApiNodePeers()

    return (
        <div>
            {props.nodeHealth.status === 'ok' && props.health ?
            <div>
            <Grid style={{ marginBottom: '20px', flexGrow: 1 }}>
                <Grid container spacing={3}>
                    <Grid key={1} item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <StatCard
                        label='Connected Peers'
                        statistic={nodeTopology.connected.toString()}
                        loading={isLoadingNodeTopology}
                        />
                    </Grid>
                    <Grid key={2} item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <StatCard
                        label='Population'
                        statistic={nodeTopology.population.toString()}
                        loading={isLoadingNodeTopology}
                        />
                    </Grid>
                    <Grid key={3} item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <StatCard
                        label='Depth'
                        statistic={nodeTopology.depth.toString()}
                        loading={isLoadingNodeTopology}
                        />
                    </Grid>
                </Grid> 
            </Grid>
            <PeerTable
            nodePeers={nodePeers}
            loading={isLoadingNodePeers}
            />
            </div>
            :
            <TroubleshootConnectionCard />
            }
        </div>
    )
}
