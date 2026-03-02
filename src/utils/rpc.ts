import { BZZ, DAI, EthAddress, PrivateKey } from '@ethersphere/bee-js'
import { debounce } from '@mui/material'
import { Contract, JsonRpcProvider, TransactionReceipt, TransactionResponse, Wallet } from 'ethers'

import { BZZ_TOKEN_ADDRESS, bzzABI } from './bzzAbi'
import { ethAddressString, newGnosisProvider } from './chain'

async function getNetworkChainId(url: string): Promise<bigint> {
  const provider = newGnosisProvider(url)
  const network = await provider.getNetwork()

  return network.chainId
}

async function eth_getBalance(address: EthAddress | string, provider: JsonRpcProvider): Promise<DAI> {
  const addressString = ethAddressString(address)
  const balance = await provider.getBalance(addressString)

  return DAI.fromWei(balance.toString())
}

async function eth_getBlockByNumber(provider: JsonRpcProvider): Promise<string> {
  const blockNumber = await provider.getBlockNumber()

  return blockNumber.toString()
}

async function eth_getBalanceERC20(
  address: EthAddress | string,
  provider: JsonRpcProvider,
  tokenAddress = BZZ_TOKEN_ADDRESS,
): Promise<BZZ> {
  const addressString = ethAddressString(address)
  const contract = new Contract(tokenAddress, bzzABI, provider)
  // Use staticCall directly to bypass argument resolution
  const balance = await contract.balanceOf.staticCall(addressString)

  return BZZ.fromPLUR(balance.toString())
}

interface TransferResponse {
  transaction: TransactionResponse
  receipt: TransactionReceipt
}

export async function estimateNativeTransferTransactionCost(
  privateKey: PrivateKey | string,
  jsonRpcProviderUrl: string,
): Promise<{ gasPrice: DAI; totalCost: DAI }> {
  privateKey = new PrivateKey(privateKey)

  const signer = await makeReadySigner(privateKey, jsonRpcProviderUrl)

  if (!signer.provider) {
    throw new Error('Signer provider is invalid!')
  }

  const gasLimit = BigInt(21000)
  const feeData = await signer.provider.getFeeData()
  const gasPrice = feeData.gasPrice || BigInt(0)

  return {
    gasPrice: DAI.fromWei(gasPrice.toString()),
    totalCost: DAI.fromWei((gasPrice * gasLimit).toString()),
  }
}

export async function sendNativeTransaction(
  privateKey: PrivateKey | string,
  to: EthAddress | string,
  value: DAI,
  jsonRpcProviderUrl: string,
  externalGasPrice?: DAI,
): Promise<TransferResponse> {
  privateKey = new PrivateKey(privateKey)
  to = new EthAddress(to)

  const signer = await makeReadySigner(privateKey, jsonRpcProviderUrl)

  if (!signer.provider) {
    throw new Error('Signer provider is invalid!')
  }

  const feedData = await signer.provider.getFeeData()
  const gasPrice = externalGasPrice ?? DAI.fromWei(feedData.gasPrice?.toString() || '0')
  const transaction = await signer.sendTransaction({
    to: to.toHex(),
    value: BigInt(value.toWeiString()),
    gasPrice: BigInt(gasPrice.toWeiString()),
    gasLimit: BigInt(21000),
    type: 0,
  })
  const receipt = await transaction.wait(1)

  if (!receipt) {
    throw new Error('Invalid receipt!')
  }

  return { transaction, receipt }
}

export async function sendBzzTransaction(
  privateKey: PrivateKey | string,
  to: EthAddress | string,
  value: BZZ,
  jsonRpcProviderUrl: string,
): Promise<TransferResponse> {
  privateKey = new PrivateKey(privateKey)
  to = new EthAddress(to)

  const signer = await makeReadySigner(privateKey, jsonRpcProviderUrl)

  if (!signer.provider) {
    throw new Error('Signer provider is invalid!')
  }

  const feeData = await signer.provider.getFeeData()
  const gasPrice = feeData.gasPrice || BigInt(0)
  const bzz = new Contract(BZZ_TOKEN_ADDRESS, bzzABI, signer)
  const transaction = await bzz.transfer(to, value, { gasPrice })
  const receipt = await transaction.wait(1)

  if (!receipt) {
    throw new Error('Invalid receipt!')
  }

  return { transaction, receipt }
}

async function makeReadySigner(privateKey: PrivateKey, jsonRpcProviderUrl: string) {
  const provider = newGnosisProvider(jsonRpcProviderUrl)
  await provider.getNetwork()
  const signer = new Wallet(privateKey.toString(), provider)

  return signer
}

export interface Rpc {
  getNetworkChainId: (url: string) => Promise<bigint>
  sendNativeTransaction: (
    privateKey: PrivateKey | string,
    to: EthAddress | string,
    value: DAI,
    jsonRpcProviderUrl: string,
    externalGasPrice?: DAI,
  ) => Promise<TransferResponse>
  sendBzzTransaction: (
    privateKey: PrivateKey | string,
    to: EthAddress | string,
    value: BZZ,
    jsonRpcProviderUrl: string,
  ) => Promise<TransferResponse>
  _eth_getBalance: (address: EthAddress | string, provider: JsonRpcProvider) => Promise<DAI>
  _eth_getBalanceERC20: (address: EthAddress | string, provider: JsonRpcProvider, tokenAddress?: string) => Promise<BZZ>
  eth_getBalance: (address: EthAddress | string, provider: JsonRpcProvider) => Promise<DAI>
  eth_getBalanceERC20: (address: EthAddress | string, provider: JsonRpcProvider, tokenAddress: string) => Promise<BZZ>
  eth_getBlockByNumber: (provider: JsonRpcProvider) => Promise<string>
}

export const RPC: Rpc = {
  getNetworkChainId,
  sendNativeTransaction,
  sendBzzTransaction,
  _eth_getBalance: eth_getBalance,
  _eth_getBalanceERC20: eth_getBalanceERC20,
  eth_getBalance: debounce(eth_getBalance, 1_000),
  eth_getBalanceERC20: debounce(eth_getBalanceERC20, 1_000),
  eth_getBlockByNumber,
}
