import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Container, CircularProgress } from '@material-ui/core';

import type { NodeAddresses, ChequebookAddressResponse } from '@ethersphere/bee-js'

import { beeDebugApi, beeApi } from '../../services/bee';

import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard';
import NodeSetupWorkflow from './NodeSetupWorkflow';
import StatusCard from './StatusCard';
import EthereumAddressCard from '../../components/EthereumAddressCard';

export default function Status() {
    const [beeRelease, setBeeRelease] = useState({ name: ''});
    const [loadingBeeRelease, setLoadingBeeRelease] = useState(false);

    const [nodeApiHealth, setNodeApiHealth] = useState('');
    const [loadingNodeApiHealth, setLoadingNodeApiHealth] = useState(false);

    const [nodeHealth, setNodeHealth] = useState({ status: '', version: ''});
    const [loadingNodeHealth, setLoadingNodeHealth] = useState(false);

    const [nodeReadiness, setNodeReadiness] = useState({ status: '', version: ''});
    const [loadingNodeReadiness, setLoadingNodeReadiness] = useState(false);

    const [nodeAddresses, setNodeAddresses] = useState<NodeAddresses>({ overlay: '', underlay: [""], ethereum: '', public_key: '', pss_public_key: ''});
    const [loadingNodeAddresses, setLoadingNodeAddresses] = useState(false);

    const [nodeTopology, setNodeTopology] = useState({ baseAddr: '', bins: [""], connected: 0, depth: 0, nnLowWatermark: 0, population: 0, timestamp: ''});
    const [loadingNodeTopology, setLoadingNodeTopology] = useState(false);

    const [chequebookAddress, setChequebookAddress] = useState<ChequebookAddressResponse>({ chequebookaddress: '' });
    const [loadingChequebookAddress, setLoadingChequebookAddress] = useState(false);

    const fetchLatestBeeRelease = async () => {
        let beeRelease = await axios.get(`${process.env.REACT_APP_BEE_GITHUB_REPO_URL}/releases/latest`)
        setBeeRelease(beeRelease.data)
    }

    const [apiHost, setApiHost] = useState('');
    const fetchApiHost = () => {
        let apiHost
  
        if (sessionStorage.getItem('api_host')) {
            apiHost = String(sessionStorage.getItem('api_host') || '')
        } else {
            apiHost = String(process.env.REACT_APP_BEE_HOST)
        }
        setApiHost(apiHost)
    }

    const [debugApiHost, setDebugApiHost] = useState('');
    const fetchDebugApiHost = () => {
        let debugApiHost
  
        if (sessionStorage.getItem('debug_api_host')) {
            debugApiHost = String(sessionStorage.getItem('debug_api_host') || '')
        } else {
            debugApiHost = String(process.env.REACT_APP_BEE_DEBUG_HOST)
        }
        setDebugApiHost(debugApiHost)
    }

    const fetchApiHealth = () => {
        setLoadingNodeApiHealth(true)
        beeApi.status.health()
        .then(res => {
            let health = res.data;
            setLoadingNodeApiHealth(false)
            setNodeApiHealth(health)
        })
        .catch(error => {
            console.log(error)
            setLoadingNodeApiHealth(false)
        })
    }

    const fetchNodeHealth = () => {
        setLoadingNodeHealth(true)
        beeDebugApi.status.nodeHealth()
        .then(res => {
            let health = res.data;
            setLoadingNodeHealth(false)
            setNodeHealth(health)
        })
        .catch(error => {
            console.log(error)
            setLoadingNodeHealth(false)
        })
    }

    const fetchNodeReadiness = () => {
        setLoadingNodeReadiness(true)
        beeDebugApi.status.nodeReadiness()
        .then(res => {
            let readiness: any = res.data;
            setLoadingNodeReadiness(false)
            setNodeReadiness(readiness)
        })
        .catch(error => {
            console.log(error)
            setLoadingNodeReadiness(false)
        })
    }

    const fetchNodeAddresses = () => {
        setLoadingNodeAddresses(true)
        beeDebugApi.connectivity.addresses()
        .then(res => {
            let addresses: any = res.data;
            setLoadingNodeAddresses(false)
            setNodeAddresses(addresses)
        })
        .catch(error => {
            console.log(error)
            setLoadingNodeAddresses(false)
        })
    }

    const fetchChequebookAddress = () => {
        setLoadingChequebookAddress(true)
        beeDebugApi.chequebook.address()
        .then(res => {
            let address: any = res.data;
            setLoadingChequebookAddress(false)
            setChequebookAddress(address)
        })
        .catch(error => {
            console.log(error)
            setLoadingChequebookAddress(false)
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
        fetchNodeHealth()
        fetchNodeReadiness()
        fetchLatestBeeRelease()
        fetchNetworkTopology()
        fetchNodeAddresses()
        fetchChequebookAddress()
        fetchApiHealth()
        fetchApiHost()
        fetchDebugApiHost()
    }, []);

    return (
        <div>
            {nodeHealth.status === 'ok' && 
            nodeApiHealth && 
            beeRelease && 
            beeRelease.name === `v${nodeHealth.version?.split('-')[0]}` &&
            nodeAddresses.ethereum && 
            chequebookAddress.chequebookaddress && 
            nodeTopology.connected && nodeTopology.connected > 0 ? 
                <div>
                    <StatusCard 
                    nodeHealth={nodeHealth} 
                    loadingNodeHealth={loadingNodeHealth} 
                    nodeReadiness={nodeReadiness} 
                    loadingNodeReadiness={loadingNodeReadiness} 
                    beeRelease={beeRelease}
                    loadingBeeRelease={loadingBeeRelease}
                    nodeAddresses={nodeAddresses} 
                    loadingNodeTopology={loadingNodeTopology}
                    nodeTopology={nodeTopology}
                    />
                    <EthereumAddressCard 
                    nodeAddresses={nodeAddresses} 
                    loadingNodeAddresses={loadingNodeAddresses} 
                    chequebookAddress={chequebookAddress}
                    loadingChequebookAddress={loadingChequebookAddress}
                    />
                </div>
                :
                loadingNodeHealth || loadingNodeApiHealth || loadingChequebookAddress || loadingNodeTopology || loadingBeeRelease || loadingNodeAddresses ? 
                <Container style={{textAlign:'center', padding:'50px'}}>
                    <CircularProgress />
                </Container>
                :
                <NodeSetupWorkflow
                beeRelease={beeRelease}
                loadingBeeRelease={loadingBeeRelease}
                nodeHealth={nodeHealth} 
                loadingNodeHealth={loadingNodeHealth} 
                nodeReadiness={nodeReadiness} 
                loadingNodeReadiness={loadingNodeReadiness} 
                nodeAddresses={nodeAddresses} 
                loadingNodeTopology={loadingNodeTopology}
                nodeTopology={nodeTopology}
                nodeApiHealth={nodeApiHealth}
                loadingNodeApiHealth={loadingNodeApiHealth}
                chequebookAddress={chequebookAddress}
                apiHost={apiHost}
                debugApiHost={debugApiHost}
                />
                // <TroubleshootConnectionCard
                // />
            }
        </div>
    )
}
