import React, { useState, useEffect } from "react";

import type { NodeAddresses, ChequebookAddressResponse, ChequebookBalanceResponse, BalanceResponse, 
    LastChequesResponse, AllSettlements, LastCashoutActionResponse } from '@ethersphere/bee-js'

import { beeDebugApi, beeApi } from '../services/bee';

export const useApiHealth = () => {
    const [health, setHealth] = useState('')
    const [isLoadingHealth, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeApi.status.health()
        .then(res => {
            setHealth(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { health, isLoadingHealth, error } ;
}

interface NodeHealth {
    status: string,
    version: string
}

export const useDebugApiHealth = () => {
    const [nodeHealth, setNodeHealth] = useState<NodeHealth | null>(null)
    const [isLoadingNodeHealth, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.status.nodeHealth()
        .then(res => {
            setNodeHealth(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { nodeHealth, isLoadingNodeHealth, error } ;
}

interface NodeReadiness {
    status: string,
    version: string
}

export const useApiReadiness = () => {
    const [nodeReadiness, setNodeReadiness] = useState<NodeReadiness | null>(null)
    const [isLoadingNodeReadiness, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.status.nodeReadiness()
        .then(res => {
            setNodeReadiness(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
     }, [])

    return { nodeReadiness, isLoadingNodeReadiness, error } ;
}

export const useApiNodeAddresses = () => {
    const [nodeAddresses, setNodeAddresses] = useState<NodeAddresses | null>(null)
    const [isLoadingNodeAddresses, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.connectivity.addresses()
        .then(res => {
            setNodeAddresses(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { nodeAddresses, isLoadingNodeAddresses, error } ;
}

export const useApiNodeTopology = () => {
    const [nodeTopology, setNodeTopology] = useState({ baseAddr: '', bins: [""], connected: 0, depth: 0, nnLowWatermark: 0, population: 0, timestamp: ''})
    const [isLoadingNodeTopology, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.connectivity.topology()
        .then(res => {
            setNodeTopology(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { nodeTopology, isLoadingNodeTopology, error } ;
}

export const useApiChequebookAddress = () => {
    const [chequebookAddress, setChequebookAddress] = useState<ChequebookAddressResponse | null>(null)
    const [isLoadingChequebookAddress, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.chequebook.address()
        .then(res => {
            setChequebookAddress(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { chequebookAddress, isLoadingChequebookAddress, error };
}

export const useApiNodePeers = () => {
    const [nodePeers, setNodePeers] = useState({ peers: [{ address: '-'}]})
    const [isLoadingNodePeers, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.connectivity.listPeers()
        .then(res => {
            setNodePeers(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { nodePeers, isLoadingNodePeers, error };
}

export const useApiChequebookBalance = () => {
    const [chequebookBalance, setChequebookBalance] = useState<ChequebookBalanceResponse | null>(null)
    const [isLoadingChequebookBalance, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.chequebook.balance()
        .then(res => {
            setChequebookBalance(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { chequebookBalance, isLoadingChequebookBalance, error };
}

export const useApiPeerBalances = () => {
    const [peerBalances, setPeerBalances] = useState<BalanceResponse | null>(null)
    const [isLoadingPeerBalances, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.balance.balances()
        .then(res => {
            setPeerBalances(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { peerBalances, isLoadingPeerBalances, error };
}

export const useApiPeerCheques = () => {
    const [peerCheques, setPeerCheques] = useState<LastChequesResponse | null>(null)
    const [isLoadingPeerCheques, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.chequebook.getLastCheques()
        .then(res => {
            setPeerCheques(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { peerCheques, isLoadingPeerCheques, error };
}

export const useApiPeerLastCheque = (peerId: string) => {
    const [peerCheque, setPeerCheque] = useState({ peer: '-', chequebook: "",
        cumulativePayout: 0,
        beneficiary: "",
        transactionHash: "",
        result: {
            recipient: "",
            lastPayout: 0,
            bounced: false
    }}
    )
    const [isLoadingPeerCheque, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.chequebook.getPeerLastCheques(peerId)
        .then(res => {
            setPeerCheque(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { peerCheque, isLoadingPeerCheque, error };
}

export const useApiSettlements = () => {
    const [settlements, setSettlements] = useState<AllSettlements | null>(null)
    const [isLoadingSettlements, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.settlements.getSettlements()
        .then(res => {
            setSettlements(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { settlements, isLoadingSettlements, error };
}


export const useApiPingPeer = (peerId: string) => {
    const [peerRTP, setPeerRTP] = useState<string>('')
    const [isPingingPeer, setPingingPeer] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setPingingPeer(true)
        beeDebugApi.connectivity.ping(peerId)
        .then(res => {
            setPeerRTP(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setPingingPeer(false)
        })
    }, [])

    return { peerRTP, isPingingPeer, error };
}

export const useApiPeerLastCashout = (peerId: string) => {
    const [peerCashout, setPeerCashout] = useState<LastCashoutActionResponse | null>(null)
    const [isLoadingPeerCashout, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.chequebook.getPeerLastCashout(peerId)
        .then(res => {
            setPeerCashout(res.data)
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])

    return { peerCashout, isLoadingPeerCashout, error };
}