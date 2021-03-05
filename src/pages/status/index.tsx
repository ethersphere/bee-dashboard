import React, { useState, useEffect } from 'react'

import { beeDebugApi } from '../../services/bee';
import StatusCard from './StatusCard';


export default function Status() {
    const [nodeHealth, setNodeHealth] = useState({});
    const [loadingNodeHealth, setLoadingNodeHealth] = useState(false);

    const [nodeReadiness, setNodeReadiness] = useState({});
    const [loadingNodeReadiness, setLoadingNodeReadiness] = useState(false);

    const fetchNodeHealth = () => {
        setLoadingNodeHealth(true)
        beeDebugApi.status.nodeHealth()
        .then(res => {
            console.log(res.data)
            let health = res.data;
            setLoadingNodeHealth(false)
            setNodeHealth(health)
        })
        .catch(error => {
            console.log(error)
            setNodeHealth(false)
        })
    }

    const fetchNodeReadiness = () => {
        setLoadingNodeReadiness(true)
        beeDebugApi.status.nodeReadiness()
        .then(res => {
            console.log(res.data)
            let readiness = res.data;
            setLoadingNodeReadiness(false)
            setNodeReadiness(readiness)
        })
        .catch(error => {
            console.log(error)
            setLoadingNodeReadiness(false)
        })
    }

    useEffect(() => {
        fetchNodeHealth()
        fetchNodeReadiness()
    }, []);

    return (
        <div>
            <StatusCard />
        </div>
    )
}
