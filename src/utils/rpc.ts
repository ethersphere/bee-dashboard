import { JsonRpcProvider } from '@ethersproject/providers'
import { debounce } from '@material-ui/core'
import axios from 'axios'
import { BigNumber, Contract, providers, Wallet } from 'ethers'
import { bzzContractInterface } from './bzz-contract-interface'

export const JSON_RPC_PROVIDER = 'https://gno.getblock.io/mainnet/?api_key=d7b92d96-9784-49a8-a800-b3edd1647fc7'

async function eth_getBalance(address: string): Promise<string> {
  if (!address.startsWith('0x')) {
    address = `0x${address}`
  }
  const response = await axios(JSON_RPC_PROVIDER, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1,
    },
  })

  return response.data.result
}

async function eth_getBlockByNumber(provider = JSON_RPC_PROVIDER): Promise<string> {
  const response = await axios(provider, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
    },
  })

  return response.data.result
}

const partialERC20tokenABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
]

const provider = new providers.JsonRpcProvider(JSON_RPC_PROVIDER)

async function eth_getBalanceERC20(
  address: string,
  tokenAddress = '0xdbf3ea6f5bee45c02255b2c26a16f300502f68da',
): Promise<string> {
  if (!address.startsWith('0x')) {
    address = `0x${address}`
  }
  const contract = new Contract(tokenAddress, partialERC20tokenABI, provider)
  const balance = await contract.balanceOf(address)

  return balance.toString()
}

async function sendNativeTransaction(
  privateKey: string,
  address: string,
  amount: string,
  providerHost: string,
): Promise<providers.TransactionResponse> {
  const provider = new JsonRpcProvider(providerHost)
  await provider.ready
  const signer = new Wallet(privateKey, provider)
  const gasPrice = await signer.getGasPrice()

  return signer.sendTransaction({
    to: address,
    value: amount,
    gasPrice,
  })
}

async function sendBzzTransaction(
  privateKey: string,
  address: string,
  amount: string,
  providerHost: string,
): Promise<providers.TransactionResponse> {
  const provider = new JsonRpcProvider(providerHost)
  await provider.ready
  const signer = new Wallet(privateKey, provider)
  const bzz = new Contract('0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da', bzzContractInterface, signer)
  const gasPrice = await signer.getGasPrice()

  return bzz.transfer(address, BigNumber.from(amount), { gasPrice })
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
