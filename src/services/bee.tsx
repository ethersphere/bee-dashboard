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
            return beeDebugApiClient().get(`/addresses`)
        },
        listPeers() {
            return beeDebugApiClient().get(`/peers`)
        },
        blockListedPeers() {
            return beeDebugApiClient().get(`/blocklist`)
        },
        removePeer(peerId: string) {
            return beeDebugApiClient().delete(`/peers/${peerId}`)
        },
        topology() {
            return beeDebugApiClient().get(`/topology`)
        },
        ping(peerId: string) {
            return beeDebugApiClient().post(`/pingpong/${peerId}`)
        }
    },
    balance: {
        balances() {
            return beeDebugApiClient().get(`/balances`)
        },
        peerBalance(peerId: string) {
            return beeDebugApiClient().get(`/balances/${peerId}`)
        },
        consumed() {
            return beeDebugApiClient().get(`/consumed`)
        },
        peerConsumed(peerId: string) {
            return beeDebugApiClient().get(`/consumed/${peerId}`)
        }
    },
    chequebook: {
        address() {
            return beeDebugApiClient().get(`/chequebook/address`)
        },
        balance() {
            return beeDebugApiClient().get(`/chequebook/balance`)
        },
        getLastCheques() {
            return beeDebugApiClient().get(`/chequebook/cheque`)
        },
        peerCashout(peerId: string) {
            return beeDebugApiClient().post(`/chequebook/cashout/${peerId}`)
        },
        getPeerLastCashout(peerId: string) {
            return beeDebugApiClient().get(`/chequebook/cashout/${peerId}`)
        },
        getPeerLastCheques(peerId: string) {
            return beeDebugApiClient().get(`/chequebook/cashout/${peerId}`)
        },
    },
    settlements: {
        getSettlements() {
            return beeDebugApiClient().get(`/settlements`)
        },
        peerSettlement(peerId: string) {
            return beeDebugApiClient().get(`/settlements/${peerId}`)
        }
    }
}