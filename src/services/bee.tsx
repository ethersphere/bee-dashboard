import { Bee, BeeDebug } from "@ethersphere/bee-js";

const beeJSClient = (): Bee => {
    let apiHost = process.env.REACT_APP_BEE_HOST
  
    if (sessionStorage.getItem('api_host')) {
      apiHost = String(sessionStorage.getItem('api_host'))
    }

    return new Bee(`${apiHost}`)
}

const beeDebugJSClient = (): BeeDebug => {
    let debugApiHost = process.env.REACT_APP_BEE_DEBUG_HOST
  
    if (sessionStorage.getItem('debug_api_host')) {
      debugApiHost = String(sessionStorage.getItem('debug_api_host'))
    }

    return new BeeDebug(`${debugApiHost}`)
}

export const beeApi = {
    status: {
        health() {
            return beeJSClient().isConnected()
        }
    },
    files: {
        uploadFile(file: any) {
            return beeJSClient().uploadFile(file)
        },
        uploadData(file: any) { 
            return beeJSClient().uploadData(file)
        },
        downloadFile(hash: string) {
            return beeJSClient().downloadFile(hash)
        },
        downloadData(hash: string) {
            return beeJSClient().downloadData(hash)
        },
    },
}

export const beeDebugApi = {
    status: {
        nodeHealth() {
            return beeDebugJSClient().getHealth()
        },
        nodeReadiness() {
            return beeDebugJSClient().getReadiness()
        },
    },
    connectivity: {
        overlayAddress() {
            return beeDebugJSClient().getOverlayAddress()
        },
        ethereumAddress() {
            return beeDebugJSClient().getEthAddress()
        },
        pssPublicKey() {
            return beeDebugJSClient().getPssPublicKey()
        },
        listPeers() {
            return beeDebugJSClient().getPeers()
        },
        blockListedPeers() {
            return beeDebugJSClient().getBlocklist()
        },
        removePeer(peerId: string) {
            return beeDebugJSClient().removePeer(peerId)
        },
        topology() {
            return beeDebugJSClient().getTopology()
        },
        ping(peerId: string) {
            return beeDebugJSClient().pingPeer(peerId)
        }
    },
    balance: {
        balances() {
            return beeDebugJSClient().getAllBalances()
        },
        peerBalance(peerId: string) {
            return beeDebugJSClient().getPeerBalance(peerId)
        },
        consumed() {
            return beeDebugJSClient().getPastDueConsumptionBalances()
        },
        peerConsumed(peerId: string) {
            return beeDebugJSClient().getPastDueConsumptionPeerBalance(peerId)
        }
    },
    chequebook: {
        address() {
            return beeDebugJSClient().getChequebookAddress()
        },
        balance() {
            return beeDebugJSClient().getChequebookBalance()
        },
        getLastCheques() {
            return beeDebugJSClient().getLastCheques()
        },
        peerCashout(peerId: string) {
            return beeDebugJSClient().cashoutLastCheque(peerId)
        },
        getPeerLastCashout(peerId: string) {
            return beeDebugJSClient().getLastCashoutAction(peerId)
        },
        getPeerLastCheques(peerId: string) {
            return beeDebugJSClient().getLastChequesForPeer(peerId)
        },
        withdraw(amount: bigint) {
            return beeDebugJSClient().withdrawTokens(amount)
        },
        deposit(amount: bigint) {
            return beeDebugJSClient().depositTokens(amount)
        },
    },
    settlements: {
        getSettlements() {
            return beeDebugJSClient().getAllSettlements()
        },
        peerSettlement(peerId: string) {
            return beeDebugJSClient().getSettlements(peerId)
        }
    }
}