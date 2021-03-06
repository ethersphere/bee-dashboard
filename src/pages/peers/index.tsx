import React, { useState, useEffect } from 'react'

import { Grid } from '@material-ui/core/';

import { beeDebugApi } from '../../services/bee';

import StatCard from '../../components/StatCard';
import PeerTable from './PeerTable';

export default function Peers() {
    const [nodePeers, setNodePeers] = useState({ peers: [{ address: ''}]});
    const [loadingNodePeers, setLoadingNodePeers] = useState(false);

    const [nodeTopology, setNodeTopology] = useState({ baseAddr: '', bins: [{}], connected: 0, depth: 0, nnLowWatermark: 0, population: 0, timestamp: ''});
    const [loadingNodeTopology, setLoadingNodeTopology] = useState(false);

    const fetchPeers = () => {
        setLoadingNodePeers(true)
        beeDebugApi.connectivity.listPeers()
        .then(res => {
            let peers: any = res.data;
            setLoadingNodePeers(false)
            setNodePeers(peers)
        })
        .catch(error => {
            console.log(error)
            setLoadingNodePeers(false)
        })
    }

    const fetchNetworkTopology = () => {
        setLoadingNodeTopology(true)
        beeDebugApi.connectivity.topology()
        .then(res => {
            let topology: any = res.data;
            setLoadingNodeTopology(false)
            setNodeTopology(topology)
        })
        .catch(error => {
            console.log(error)
            setLoadingNodeTopology(false)
        })
    }

    useEffect(() => {
        fetchPeers()
        fetchNetworkTopology()
    }, []);

    return (
        <div>
            <Grid style={{ marginBottom: '20px', flexGrow: 1 }}>
                <Grid container spacing={3}>
                    <Grid key={1} item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <StatCard
                        label='Connected Peers'
                        statistic={nodeTopology.connected.toString()}
                        />
                    </Grid>
                    <Grid key={2} item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <StatCard
                        label='Population'
                        statistic={nodeTopology.population.toString()}
                        />
                    </Grid>
                    <Grid key={3} item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <StatCard
                        label='Depth'
                        statistic={nodeTopology.depth.toString()}
                        />
                    </Grid>
                    <Grid key={4} item xs={12} sm={12} md={4} lg={3} xl={3}>
                        <StatCard
                        label='nnLowWatermark'
                        statistic={nodeTopology.nnLowWatermark.toString()}
                        />
                    </Grid>
                </Grid> 
            </Grid>
            <PeerTable
            nodePeers={nodePeers}
            loadingNodePeers={loadingNodePeers}
            />
        </div>
    )
}
