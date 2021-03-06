import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Bee } from "@ethersphere/bee-js"

const bee = new Bee(`${process.env.REACT_APP_BEE_HOST}`)

const beeApiClient = (): AxiosInstance => {
    return axios.create({
        baseURL: process.env.REACT_APP_BEE_HOST
    })
}

const beeDebugApiClient = (): AxiosInstance => {
    return axios.create({
        baseURL: process.env.REACT_APP_BEE_DEBUG_HOST
    })
}

interface File {
    id: String;
    file: BinaryType;
}

interface Peer {
    id: String;
    name: String;
}

export const beeApi = {
    files: {
        upload(file: File) {
            return beeApiClient().post(`/files`, file)
        },
        uploadData(file: File) { 
            return bee.uploadData(file.file)
        },
        download(hash: string) {
            return beeApiClient().get<File>(`/files/${hash}`)
        },
        downloadData(hash: string) {
            return bee.downloadData(hash)
        },
    },
}

export const beeDebugApi = {
    status: {
        nodeHealth() {
            return beeDebugApiClient().get(`/health`)
        },
        nodeReadiness() {
            return beeDebugApiClient().get(`/readiness`)
        },
    },
    connectivity: {
        addresses() {
            return beeDebugApiClient().get<Peer>(`/addresses`)
        },
        listPeers() {
            return beeDebugApiClient().get<Peer>(`/peers`)
        },
        blockListedPeers() {
            return beeDebugApiClient().get<Peer>(`/blocklist`)
        },
        removePeer(peerId: string) {
            return beeDebugApiClient().delete<Peer>(`/peers/${peerId}`)
        },
        topology() {
            return beeDebugApiClient().get<Peer>(`/topology`)
        },
        ping(peerId: string) {
            return beeDebugApiClient().post<Peer>(`/pingpong/${peerId}`)
        }
    },
    balance: {
        balances() {
            return beeDebugApiClient().get<Peer>(`/balances`)
        },
        peerBalance(peerId: string) {
            return beeDebugApiClient().get<Peer>(`/balances/${peerId}`)
        },
        consumed() {
            return beeDebugApiClient().get<Peer>(`/consumed`)
        },
        peerConsumed(peerId: string) {
            return beeDebugApiClient().get<Peer>(`/consumed/${peerId}`)
        }
    },
    chequebook: {
        address() {
            return beeDebugApiClient().get<Peer>(`/chequebook/address`)
        },
        balance() {
            return beeDebugApiClient().get(`/chequebook/balance`)
        },
        getLastCheques() {
            return beeDebugApiClient().get(`/chequebook/cheque`)
        },
        peerCashout(peerId: string) {
            return beeDebugApiClient().post<Peer>(`/chequebook/cashout/${peerId}`)
        },
        getPeerLastCashout(peerId: string) {
            return beeDebugApiClient().get<Peer>(`/chequebook/cashout/${peerId}`)
        },
        getPeerLastCheques(peerId: string) {
            return beeDebugApiClient().get<Peer>(`/chequebook/cashout/${peerId}`)
        },
    },
}