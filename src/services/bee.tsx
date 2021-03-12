import axios, { AxiosInstance } from 'axios';
import { Bee } from "@ethersphere/bee-js";

const beeJSClient = (useGatewayHost?: boolean) => {
    let apiHost
  
    if (useGatewayHost) {
      apiHost = process.env.REACT_APP_SWARM_GATEWAY_HOST
    } else if (sessionStorage.getItem('api_host')) {
      apiHost = String(sessionStorage.getItem('api_host') || '')
    } else {
      apiHost = process.env.REACT_APP_BEE_HOST
    }

    return new Bee(`${apiHost}`)
}

const beeApiClient = (): AxiosInstance => {
    let apiHost
  
    if (sessionStorage.getItem('api_host')) {
      apiHost = String(sessionStorage.getItem('api_host') || '')
    } else {
      apiHost = process.env.REACT_APP_BEE_HOST
    }

    return axios.create({
        baseURL: apiHost
    })
}

const beeDebugApiClient = (): AxiosInstance => {
    let debugApiHost
  
    if (sessionStorage.getItem('debug_api_host')) {
      debugApiHost = String(sessionStorage.getItem('debug_api_host') || '')
    } else {
      debugApiHost = process.env.REACT_APP_BEE_DEBUG_HOST
    }

    return axios.create({
        baseURL: debugApiHost
    })
}

export const beeApi = {
    status: {
        health() {
            return beeApiClient().get('/')
        }
    },
    files: {
        uploadFile(file: any) {
            return beeJSClient().uploadFile(file)
        },
        uploadData(file: any) { 
            return beeJSClient().uploadData(file)
        },
        downloadFile(hash: string, useGatewayHost?: boolean) {
            return beeJSClient(useGatewayHost).downloadFile(hash)
        },
        downloadData(hash: string) {
            return beeJSClient().downloadData(hash)
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