import { Bee, BeeDebug, Reference } from '@ethersphere/bee-js'

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

export const beeApi = {
  status: {
    health() {
      return beeJSClient().isConnected()
    },
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
      return beeJSDebugClient().getNodeAddresses()
    },
    listPeers() {
      return beeJSDebugClient().getPeers()
    },
    topology() {
      return beeJSDebugClient().getTopology()
    },
    ping(peerId: string) {
      return beeJSDebugClient().pingPeer(peerId)
    },
  },
  balance: {
    balances() {
      return beeJSDebugClient().getAllBalances()
    },
  },
  chequebook: {
    address() {
      return beeJSDebugClient().getChequebookAddress()
    },
    balance() {
      return beeJSDebugClient().getChequebookBalance()
    },
    getLastCheques() {
      return beeJSDebugClient().getLastCheques()
    },
    peerCashout(peerId: string) {
      return beeJSDebugClient().cashoutLastCheque(peerId)
    },
    getPeerLastCashout(peerId: string) {
      return beeJSDebugClient().getLastCashoutAction(peerId)
    },
    getPeerLastCheques(peerId: string) {
      return beeJSDebugClient().getLastChequesForPeer(peerId)
    },
    withdraw(amount: bigint) {
      return beeJSDebugClient().withdrawTokens(amount)
    },
    deposit(amount: bigint) {
      return beeJSDebugClient().depositTokens(amount)
    },
  },
  settlements: {
    getSettlements() {
      return beeJSDebugClient().getAllSettlements()
    },
  },
}
