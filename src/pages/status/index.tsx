import React, { useState, useEffect } from 'react'

import { beeDebugApi } from '../../services/bee';
import StatusCard from './StatusCard';
import EthereumAddressCard from './EthereumAddressCard';


export default function Status() {
    const [nodeHealth, setNodeHealth] = useState({ status: '', version: ''});
    const [loadingNodeHealth, setLoadingNodeHealth] = useState(false);

    const [nodeReadiness, setNodeReadiness] = useState({ status: '', version: ''});
    const [loadingNodeReadiness, setLoadingNodeReadiness] = useState(false);

    const [nodeAddresses, setNodeAddresses] = useState({ overlay: '', underlay: [""], ethereum: '', public_key: '', pss_public_key: ''});
    const [loadingNodeAddresses, setLoadingNodeAddresses] = useState(false);

    const [nodeTopology, setNodeTopology] = useState({ overlay: '', underlay: [""], ethereum: '', public_key: '', pss_public_key: ''});
    const [loadingNodeTopology, setLoadingNodeTopology] = useState(false);

    const fetchNodeHealth = () => {
        setLoadingNodeHealth(true)
        beeDebugApi.status.nodeHealth()
        .then(res => {
            console.log(res.data)
            // let health = res.data;
            let health = { status: "ok", version: "0.5.2-4a598b6"}
            setLoadingNodeHealth(false)
            setNodeHealth(health)
        })
        .catch(error => {
            let health = { status: "ok", version: "0.5.2-4a598b6"}
            setNodeHealth(health)

            console.log(error)
            setLoadingNodeHealth(false)
        })
    }

    const fetchNodeReadiness = () => {
        setLoadingNodeReadiness(true)
        beeDebugApi.status.nodeReadiness()
        .then(res => {
            console.log(res.data)
            // let readiness = res.data;
            let readiness = { status: "ok", version: "0.5.2-4a598b6"}
            setLoadingNodeReadiness(false)
            setNodeReadiness(readiness)
        })
        .catch(error => {
            let readiness = { status: "ok", version: "0.5.2-4a598b6"}
            setNodeReadiness(readiness)

            console.log(error)
            setLoadingNodeReadiness(false)
        })
    }

    const fetchNodeAddresses = () => {
        setLoadingNodeAddresses(true)
        beeDebugApi.connectivity.addresses()
        .then(res => {
            console.log(res.data)
            // let addresses = res.data;
            let addresses = {
                overlay: "36b7efd913ca4cf880b8eeac5093fa27b0825906c600685b6abdd6566e6cfe8f",
                underlay: [
                    "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAmTm17toLDaPYzRyjKn27iCB76yjKnJ5DjQXneFmifFvaX"
                ],
                ethereum: "0x01cff82c4d9adecff4246b7401f46c62b10c8356",
                public_key: "02ab7473879005929d10ce7d4f626412dad9fe56b0a6622038931d26bd79abf0a4",
                pss_public_key: "02ab7473879005929d10ce7d4f626412dad9fe56b0a6622038931d26bd79abf0a4"
            }
            setLoadingNodeAddresses(false)
            setNodeAddresses(addresses)
        })
        .catch(error => {
            let addresses = {
                overlay: "36b7efd913ca4cf880b8eeac5093fa27b0825906c600685b6abdd6566e6cfe8f",
                underlay: [
                    "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAmTm17toLDaPYzRyjKn27iCB76yjKnJ5DjQXneFmifFvaX"
                ],
                ethereum: "0x01cff82c4d9adecff4246b7401f46c62b10c8356",
                public_key: "02ab7473879005929d10ce7d4f626412dad9fe56b0a6622038931d26bd79abf0a4",
                pss_public_key: "02ab7473879005929d10ce7d4f626412dad9fe56b0a6622038931d26bd79abf0a4"
            }
            setNodeAddresses(addresses)

            console.log(error)
            setLoadingNodeAddresses(false)
        })
    }

    const fetchNetworkTopology = () => {
        setLoadingNodeTopology(true)
        beeDebugApi.connectivity.topology()
        .then(res => {
            console.log(res.data)
            // let topology = res.data;
            let topology = {
                overlay: "36b7efd913ca4cf880b8eeac5093fa27b0825906c600685b6abdd6566e6cfe8f",
                underlay: [
                    "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAmTm17toLDaPYzRyjKn27iCB76yjKnJ5DjQXneFmifFvaX"
                ],
                ethereum: "0x01cff82c4d9adecff4246b7401f46c62b10c8356",
                public_key: "02ab7473879005929d10ce7d4f626412dad9fe56b0a6622038931d26bd79abf0a4",
                pss_public_key: "02ab7473879005929d10ce7d4f626412dad9fe56b0a6622038931d26bd79abf0a4"
            }
            setLoadingNodeTopology(false)
            setNodeTopology(topology)
        })
        .catch(error => {
            let topology = {
                overlay: "36b7efd913ca4cf880b8eeac5093fa27b0825906c600685b6abdd6566e6cfe8f",
                underlay: [
                    "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAmTm17toLDaPYzRyjKn27iCB76yjKnJ5DjQXneFmifFvaX"
                ],
                ethereum: "0x01cff82c4d9adecff4246b7401f46c62b10c8356",
                public_key: "02ab7473879005929d10ce7d4f626412dad9fe56b0a6622038931d26bd79abf0a4",
                pss_public_key: "02ab7473879005929d10ce7d4f626412dad9fe56b0a6622038931d26bd79abf0a4"
            }
            setNodeTopology(topology)

            console.log(error)
            setLoadingNodeTopology(false)
        })
    }

    useEffect(() => {
        fetchNodeHealth()
        fetchNodeReadiness()
        fetchNodeAddresses()
        fetchNetworkTopology()
    }, []);

    return (
        <div>
            <StatusCard 
            nodeHealth={nodeHealth} 
            loadingNodeHealth={loadingNodeHealth} 
            nodeReadiness={nodeReadiness} 
            loadingNodeReadiness={loadingNodeReadiness} 
            nodeAddresses={nodeAddresses} 
            />
            <EthereumAddressCard 
            nodeAddresses={nodeAddresses} 
            loadingNodeAddresses={loadingNodeAddresses} 
            />
        </div>
    )
}
