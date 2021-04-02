import axios, { AxiosInstance } from 'axios';
import { Bee, BeeDebug, Reference } from "@ethersphere/bee-js";

const beeJSClient = () => {
    let apiHost = process.env.REACT_APP_BEE_HOST || 'http://localhost:1633'
  
    if (sessionStorage.getItem('api_host')) {
      apiHost = String(sessionStorage.getItem('api_host'))
    }

    return new Bee(apiHost)
}

const beeJSDebugClient = () => {
    let debugApiHost = process.env.REACT_APP_BEE_DEBUG_HOST || 'http://localhost:1635'
  
    if (sessionStorage.getItem('debug_api_host')) {
      debugApiHost = String(sessionStorage.getItem('debug_api_host'))
    }

    return new BeeDebug(debugApiHost)
}

const beeDebugApiClient = (): AxiosInstance => {
    let debugApiHost = process.env.REACT_APP_BEE_DEBUG_HOST || 'http://localhost:1635'
  
    if (sessionStorage.getItem('debug_api_host')) {
      debugApiHost = String(sessionStorage.getItem('debug_api_host'))
    }

    return axios.create({
        baseURL: debugApiHost
    })
}

export const beeApi = {
    status: {
        health() {
            return beeJSClient().isConnected()
        }
    },
    files: {
        uploadFile(file: File) {
            return beeJSClient().uploadFile(file)
        },
        downloadFile(hash: string | Reference) {
            return beeJSClient().downloadFile(hash)
        },
    },
}

export const beeDebugApi = {
    status: {
        nodeHealth() {
            return beeJSDebugClient().getHealth()
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
            return beeDebugApiClient().get(`/chequebook/cheque/${peerId}`)
        },
        withdraw(amount: bigint) {
            return beeDebugApiClient().post(`/chequebook/withdraw?amount=${amount}`)
        },
        deposit(amount: bigint) {
            return beeDebugApiClient().post(`/chequebook/deposit?amount=${amount}`)
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