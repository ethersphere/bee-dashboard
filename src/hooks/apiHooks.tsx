import { useState, useEffect } from "react";

import { ChequebookAddressResponse, ChequebookBalanceResponse, BalanceResponse, 
    LastChequesResponse, AllSettlements, LastCashoutActionResponse, Health, Topology, Peer, LastChequesForPeerResponse, PingResponse } from '@ethersphere/bee-js'

import { beeDebugApi, beeApi } from '../services/bee';

export const useApiHealth = () => {
    const [health, setHealth] = useState(false)
    const [isLoadingHealth, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeApi.status.health()
        .then(res => {
            setHealth(true)
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

export const useDebugApiHealth = () => {
    const [nodeHealth, setNodeHealth] = useState<Health | null>(null)
    const [isLoadingNodeHealth, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.status.nodeHealth()
        .then(res => {
            setNodeHealth(res)
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

export const useApiNodeAddresses = () => {
    const [nodeAddresses, setNodeAddresses] = useState<any | null>(null)
    const [isLoadingNodeAddresses, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)

        const getAddresses = async () => {
            const ethereum = await beeDebugApi.connectivity.ethereumAddress()
            const overlay = await beeDebugApi.connectivity.overlayAddress()
            const pssPublicKey = await beeDebugApi.connectivity.pssPublicKey()
            return {ethereum, overlay, pssPublicKey}
        }
        getAddresses().then((data) => {
            setNodeAddresses(data)
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
    const [nodeTopology, setNodeTopology] = useState<Topology | null>(null)
    const [isLoadingNodeTopology, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.connectivity.topology()
        .then(res => {
            setNodeTopology(res)
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
            setChequebookAddress(res)
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
    const [nodePeers, setNodePeers] = useState<Peer[] | null>(null)
    const [isLoadingNodePeers, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.connectivity.listPeers()
        .then(res => {
            setNodePeers(res)
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
            setChequebookBalance(res)
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
            setPeerBalances(res)
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
            setPeerCheques(res)
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
    const [peerCheque, setPeerCheque] = useState<LastChequesForPeerResponse>()
    const [isLoadingPeerCheque, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setLoading(true)
        beeDebugApi.chequebook.getPeerLastCheques(peerId)
        .then(res => {
            setPeerCheque(res)
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
            setSettlements(res)
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
    const [peerRTP, setPeerRTP] = useState<PingResponse|null>(null)
    const [isPingingPeer, setPingingPeer] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => { 
        setPingingPeer(true)
        beeDebugApi.connectivity.ping(peerId)
        .then(res => {
            setPeerRTP(res)
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
            setPeerCashout(res)
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