import { debounce } from '@material-ui/core'
import { BigNumber as BN, Contract, providers, Wallet } from 'ethers'
import { bzzABI, BZZ_TOKEN_ADDRESS } from './bzz-abi'

const NETWORK_ID = 5

async function getNetworkChainId(url: string): Promise<number> {
  const provider = new providers.JsonRpcProvider(url, NETWORK_ID)
  await provider.ready
  const network = await provider.getNetwork()

  return network.chainId
}

async function eth_getBalance(address: string, provider: providers.JsonRpcProvider): Promise<string> {
  if (!address.startsWith('0x')) {
    address = `0x${address}`
  }
  const balance = await provider.getBalance(address)

  return balance.toString()
}

async function eth_getBlockByNumber(provider: providers.JsonRpcProvider): Promise<string> {
  const blockNumber = await provider.getBlockNumber()

  return blockNumber.toString()
}

async function eth_getBalanceERC20(
  address: string,
  provider: providers.JsonRpcProvider,
  tokenAddress = BZZ_TOKEN_ADDRESS,
): Promise<string> {
  if (!address.startsWith('0x')) {
    address = `0x${address}`
  }
  const contract = new Contract(tokenAddress, bzzABI, provider)
  const balance = await contract.balanceOf(address)

  return balance.toString()
}

interface TransferResponse {
  transaction: providers.TransactionResponse
  receipt: providers.TransactionReceipt
}

export async function estimateNativeTransferTransactionCost(
  privateKey: string,
  jsonRpcProvider: string,
): Promise<{ gasPrice: BN; totalCost: BN }> {
  const signer = await makeReadySigner(privateKey, jsonRpcProvider)
  const gasLimit = '21000'
  const gasPrice = await signer.getGasPrice()

  return { gasPrice, totalCost: gasPrice.mul(gasLimit) }
}

export async function sendNativeTransaction(
  privateKey: string,
  to: string,
  value: string,
  jsonRpcProvider: string,
  externalGasPrice?: BN,
): Promise<TransferResponse> {
  const signer = await makeReadySigner(privateKey, jsonRpcProvider)
  const gasPrice = externalGasPrice ?? (await signer.getGasPrice())
  const transaction = await signer.sendTransaction({
    to,
    value: BN.from(value),
    gasPrice,
    gasLimit: BN.from(21000),
    type: 0,
  })
  const receipt = await transaction.wait(1)

  return { transaction, receipt }
}

export async function sendBzzTransaction(
  privateKey: string,
  to: string,
  value: string,
  jsonRpcProvider: string,
): Promise<TransferResponse> {
  const signer = await makeReadySigner(privateKey, jsonRpcProvider)
  const gasPrice = await signer.getGasPrice()
  const bzz = new Contract(BZZ_TOKEN_ADDRESS, bzzABI, signer)
  const transaction = await bzz.transfer(to, value, { gasPrice })
  const receipt = await transaction.wait(1)

  return { transaction, receipt }
}

async function makeReadySigner(privateKey: string, jsonRpcProvider: string) {
  const provider = new providers.JsonRpcProvider(jsonRpcProvider, NETWORK_ID)
  await provider.ready
  const signer = new Wallet(privateKey, provider)

  return signer
}

export const Rpc = {
  getNetworkChainId,
  sendNativeTransaction,
  sendBzzTransaction,
  _eth_getBalance: eth_getBalance,
  _eth_getBalanceERC20: eth_getBalanceERC20,
  eth_getBalance: debounce(eth_getBalance, 1_000),
  eth_getBalanceERC20: debounce(eth_getBalanceERC20, 1_000),
  eth_getBlockByNumber,
}
