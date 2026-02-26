import { debounce } from '@material-ui/core'
import { BZZ, DAI, EthAddress, PrivateKey } from '@ethersphere/bee-js'
import { BigNumber as BN, Contract, providers, Wallet } from 'ethers'
import { BZZ_TOKEN_ADDRESS, bzzABI } from './bzz-abi'

const NETWORK_ID = 100

async function getNetworkChainId(url: string): Promise<number> {
  const provider = new providers.JsonRpcProvider(url, NETWORK_ID)
  await provider.ready
  const network = await provider.getNetwork()

  return network.chainId
}

async function eth_getBalance(address: EthAddress | string, provider: providers.JsonRpcProvider): Promise<DAI> {
  address = new EthAddress(address)

  const balance = await provider.getBalance(address.toHex())

  return DAI.fromWei(balance.toString())
}

async function eth_getBlockByNumber(provider: providers.JsonRpcProvider): Promise<string> {
  const blockNumber = await provider.getBlockNumber()

  return blockNumber.toString()
}

async function eth_getBalanceERC20(
  address: EthAddress | string,
  provider: providers.JsonRpcProvider,
  tokenAddress = BZZ_TOKEN_ADDRESS,
): Promise<BZZ> {
  address = new EthAddress(address)

  const contract = new Contract(tokenAddress, bzzABI, provider)
  const balance = await contract.balanceOf(address.toHex())

  return BZZ.fromPLUR(balance.toString())
}

interface TransferResponse {
  transaction: providers.TransactionResponse
  receipt: providers.TransactionReceipt
}

export async function estimateNativeTransferTransactionCost(
  privateKey: PrivateKey | string,
  jsonRpcProvider: string,
): Promise<{ gasPrice: DAI; totalCost: DAI }> {
  privateKey = new PrivateKey(privateKey)

  const signer = await makeReadySigner(privateKey, jsonRpcProvider)
  const gasLimit = '21000'
  const gasPrice = await signer.getGasPrice()

  return { gasPrice: DAI.fromWei(gasPrice.toString()), totalCost: DAI.fromWei(gasPrice.mul(gasLimit).toString()) }
}

export async function sendNativeTransaction(
  privateKey: PrivateKey | string,
  to: EthAddress | string,
  value: DAI,
  jsonRpcProvider: string,
  externalGasPrice?: DAI,
): Promise<TransferResponse> {
  privateKey = new PrivateKey(privateKey)
  to = new EthAddress(to)

  const signer = await makeReadySigner(privateKey, jsonRpcProvider)
  const gasPrice = externalGasPrice ?? DAI.fromWei((await signer.getGasPrice()).toString())
  const transaction = await signer.sendTransaction({
    to: to.toHex(),
    value: BN.from(value.toWeiString()),
    gasPrice: BN.from(gasPrice.toWeiString()),
    gasLimit: BN.from(21000),
    type: 0,
  })
  const receipt = await transaction.wait(1)

  return { transaction, receipt }
}

export async function sendBzzTransaction(
  privateKey: PrivateKey | string,
  to: EthAddress | string,
  value: BZZ,
  jsonRpcProvider: string,
): Promise<TransferResponse> {
  privateKey = new PrivateKey(privateKey)
  to = new EthAddress(to)

  const signer = await makeReadySigner(privateKey, jsonRpcProvider)
  const gasPrice = await signer.getGasPrice()
  const bzz = new Contract(BZZ_TOKEN_ADDRESS, bzzABI, signer)
  const transaction = await bzz.transfer(to.toChecksum(), value, { gasPrice })
  const receipt = await transaction.wait(1)

  return { transaction, receipt }
}

async function makeReadySigner(privateKey: PrivateKey, jsonRpcProvider: string) {
  const provider = new providers.JsonRpcProvider(jsonRpcProvider, NETWORK_ID)
  await provider.ready
  const signer = new Wallet(privateKey.toUint8Array(), provider)

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
