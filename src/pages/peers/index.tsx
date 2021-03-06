import React, { useState, useEffect } from 'react'

import { Grid } from '@material-ui/core/';

import { beeDebugApi } from '../../services/bee';

import StatCard from '../../components/StatCard';
import PeerTable from './PeerTable';

export default function Peers() {
    const [nodePeers, setNodePeers] = useState({ peers: [{ address: ''}]});
    const [loadingNodePeers, setLoadingNodePeers] = useState(false);

    const fetchPeers = () => {
        setLoadingNodePeers(true)
        beeDebugApi.connectivity.listPeers()
        .then(res => {
            console.log(res.data)
            let peers: any = res.data;
            setLoadingNodePeers(false)
            setNodePeers(peers)
        })
        .catch(error => {
            console.log(error)
            setLoadingNodePeers(false)
        })
    }

    useEffect(() => {
        fetchPeers()
    }, []);

    return (
        <div>
            <Grid style={{ marginBottom: '20px' }}>
                <Grid container spacing={3}>
                    <Grid key={1} item>
                        <StatCard
                        label='Peers'
                        statistic={nodePeers.peers.length.toString()}
                        />
                    </Grid>
                    <Grid key={2} item>
                        <StatCard
                        label='1'
                        statistic='1'
                        />
                    </Grid>
                    <Grid key={3} item>
                        <StatCard
                        label='1'
                        statistic='1'
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
