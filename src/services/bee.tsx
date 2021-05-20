import {
  Address,
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
import { apiHost, debugApiHost } from '../constants'

const beeJSClient = () => new Bee(apiHost)

const beeJSDebugClient = () => new BeeDebug(debugApiHost)

export const beeApi = {
  status: {
    health(): Promise<boolean> {
      return beeJSClient().isConnected()
    },
  },
  files: {
    uploadFile(postageBatchId: Address, file: File): Promise<Reference> {
      return beeJSClient().uploadFile(postageBatchId, file)
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
