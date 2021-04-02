import {
  AllSettlements,
  BalanceResponse,
  Bee,
  BeeDebug,
  CashoutResponse,
  ChequebookAddressResponse,
  ChequebookBalanceResponse,
  Data,
  DepositTokensResponse,
  FileData,
  Health,
  LastCashoutActionResponse,
  LastChequesForPeerResponse,
  LastChequesResponse,
  NodeAddresses,
  Peer,
  PingResponse,
  Reference,
  Topology,
  WithdrawTokensResponse,
} from '@ethersphere/bee-js'

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
    health(): Promise<boolean> {
      return beeJSClient().isConnected()
    },
  },
  files: {
    uploadFile(file: File): Promise<Reference> {
      return beeJSClient().uploadFile(file)
    },
    downloadFile(hash: string | Reference): Promise<FileData<Data>> {
      return beeJSClient().downloadFile(hash)
    },
  },
}

export const beeDebugApi = {
  status: {
    nodeHealth(): Promise<Health> {
      return beeJSDebugClient().getHealth()
    },
  },
  connectivity: {
    addresses(): Promise<NodeAddresses> {
      return beeJSDebugClient().getNodeAddresses()
    },
    listPeers(): Promise<Peer[]> {
      return beeJSDebugClient().getPeers()
    },
    topology(): Promise<Topology> {
      return beeJSDebugClient().getTopology()
    },
    ping(peerId: string): Promise<PingResponse> {
      return beeJSDebugClient().pingPeer(peerId)
    },
  },
  balance: {
    balances(): Promise<BalanceResponse> {
      return beeJSDebugClient().getAllBalances()
    },
  },
  chequebook: {
    address(): Promise<ChequebookAddressResponse> {
      return beeJSDebugClient().getChequebookAddress()
    },
    balance(): Promise<ChequebookBalanceResponse> {
      return beeJSDebugClient().getChequebookBalance()
    },
    getLastCheques(): Promise<LastChequesResponse> {
      return beeJSDebugClient().getLastCheques()
    },
    peerCashout(peerId: string): Promise<CashoutResponse> {
      return beeJSDebugClient().cashoutLastCheque(peerId)
    },
    getPeerLastCashout(peerId: string): Promise<LastCashoutActionResponse> {
      return beeJSDebugClient().getLastCashoutAction(peerId)
    },
    getPeerLastCheques(peerId: string): Promise<LastChequesForPeerResponse> {
      return beeJSDebugClient().getLastChequesForPeer(peerId)
    },
    withdraw(amount: bigint): Promise<WithdrawTokensResponse> {
      return beeJSDebugClient().withdrawTokens(amount)
    },
    deposit(amount: bigint): Promise<DepositTokensResponse> {
      return beeJSDebugClient().depositTokens(amount)
    },
  },
  settlements: {
    getSettlements(): Promise<AllSettlements> {
      return beeJSDebugClient().getAllSettlements()
    },
  },
}
