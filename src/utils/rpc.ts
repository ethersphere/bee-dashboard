import { debounce } from '@material-ui/core'
import { Contract, providers, Wallet, BigNumber as BN } from 'ethers'
import { bzzABI } from './bzz-abi'

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
  tokenAddress = '0xdbf3ea6f5bee45c02255b2c26a16f300502f68da',
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
  const transaction = await signer.sendTransaction({ to, value, gasPrice })
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
  const bzz = new Contract('0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da', bzzABI, signer)
  const transaction = await bzz.transfer(to, value, { gasPrice })
  const receipt = await transaction.wait(1)

  return { transaction, receipt }
}

async function makeReadySigner(privateKey: string, jsonRpcProvider: string) {
  const provider = new providers.JsonRpcProvider(jsonRpcProvider, 100)
  await provider.ready
  const signer = new Wallet(privateKey, provider)

  return signer
}

export const Rpc = {
  sendNativeTransaction,
  sendBzzTransaction,
  _eth_getBalance: eth_getBalance,
  _eth_getBalanceERC20: eth_getBalanceERC20,
  eth_getBalance: debounce(eth_getBalance, 1_000),
  eth_getBalanceERC20: debounce(eth_getBalanceERC20, 1_000),
  eth_getBlockByNumber,
}
