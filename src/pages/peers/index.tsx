import React, { useState, useEffect } from 'react'

import { Typography } from '@material-ui/core/';

import { beeDebugApi } from '../../services/bee';

import PeerTable from './PeerTable';

export default function Peers() {
    const [nodePeers, setNodePeers] = useState({ peers: [{ address: ''}]});
    const [loadingNodePeers, setLoadingNodePeers] = useState(false);

    const fetchPeers = () => {
        setLoadingNodePeers(true)
        beeDebugApi.connectivity.listPeers()
        .then(res => {
            console.log(res.data)
            // let peers = res.data;
            let peers = {
                "peers":
                [
                    {"address":"01e9f3941b041fa5b32f7c3f0f704696afc63662c7c3d7c1fbc4d23a7c69b988"},
                    {"address":"022e900f3fa62afc8155c1f10345ea63d173efdf3ae7cec67dc07d9c10c75faa"}
                ]
            }
            setLoadingNodePeers(false)
            setNodePeers(peers)
        })
        .catch(error => {
            let peers = {
                "peers":
                [
                    {"address":"01e9f3941b041fa5b32f7c3f0f704696afc63662c7c3d7c1fbc4d23a7c69b988"},
                    {"address":"022e900f3fa62afc8155c1f10345ea63d173efdf3ae7cec67dc07d9c10c75faa"}
                ]
            }
            setNodePeers(peers)

            console.log(error)
            setLoadingNodePeers(false)
        })
    }

    useEffect(() => {
        fetchPeers()
    }, []);

    return (
        <div>
            <Typography color="textSecondary" component='h3'>
                Peers
            </Typography>
            <PeerTable
            nodePeers={nodePeers}
            loadingNodePeers={loadingNodePeers}
            />
        </div>
    )
}
