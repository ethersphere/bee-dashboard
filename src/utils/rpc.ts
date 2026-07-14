import { BZZ, DAI, EthAddress, PrivateKey } from '@ethersphere/bee-js'
import { debounce } from '@mui/material'
import { Contract, FeeData, JsonRpcProvider, TransactionReceipt, TransactionResponse, Wallet } from 'ethers'

import { BZZ_TOKEN_ADDRESS, bzzABI } from './bzzAbi'
import { ethAddressString, newGnosisProvider, newGnosisProviderForValidation } from './chain'

const chainIdCache = new Map<string, bigint>()

async function getNetworkChainId(url: string): Promise<bigint> {
  const cached = chainIdCache.get(url)

  if (cached !== undefined) return cached
  const provider = newGnosisProviderForValidation(url)

  try {
    const network = await provider.getNetwork()
    chainIdCache.set(url, network.chainId)

    return network.chainId
  } catch (error) {
    throw new Error(`RPC endpoint not reachable at ${url}`, { cause: error })
  }
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

function resolveFeeOverrides(feeData: FeeData, legacyGasPrice?: bigint) {
  return feeData.maxFeePerGas && feeData.maxPriorityFeePerGas
    ? { maxFeePerGas: feeData.maxFeePerGas, maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, type: 2 as const }
    : { gasPrice: legacyGasPrice ?? feeData.gasPrice ?? BigInt(0), type: 0 as const }
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
  const effectiveGasPrice = feeData.maxFeePerGas ?? feeData.gasPrice ?? BigInt(0)

  return {
    gasPrice: DAI.fromWei(effectiveGasPrice.toString()),
    totalCost: DAI.fromWei((effectiveGasPrice * gasLimit).toString()),
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
  const legacyGasPrice = BigInt((externalGasPrice ?? DAI.fromWei(feedData.gasPrice?.toString() || '0')).toWeiString())
  const transaction = await signer.sendTransaction({
    to: to.toChecksum(),
    value: BigInt(value.toWeiString()),
    gasLimit: BigInt(21000),
    ...resolveFeeOverrides(feedData, legacyGasPrice),
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
  const bzz = new Contract(BZZ_TOKEN_ADDRESS, bzzABI, signer)
  const transaction = await bzz.transfer(to.toChecksum(), value.toPLURBigInt(), {
    ...resolveFeeOverrides(feeData),
    gasLimit: BigInt(100_000),
  })
  const receipt = await transaction.wait(1)

  if (!receipt) {
    throw new Error('Invalid receipt!')
  }

  return { transaction, receipt }
}

async function makeReadySigner(privateKey: PrivateKey, jsonRpcProviderUrl: string) {
  const provider = newGnosisProvider(jsonRpcProviderUrl)

  try {
    await provider.getNetwork()
  } catch (error) {
    throw new Error(`RPC endpoint not reachable at ${jsonRpcProviderUrl}`, { cause: error })
  }

  return new Wallet(privateKey.toString(), provider)
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
