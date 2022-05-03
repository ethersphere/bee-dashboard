import { Contract, ethers, providers } from 'ethers'
import { JSON_RPC_PROVIDER } from './rpc'

const contractInterface = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapExactETHForTokens',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
]

export async function swap(privateKey: string, xdai: string, minimumBzz: string): Promise<string[]> {
  const contracts = {
    UniswapV2Factory: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
    UniswapV2Router02: '0x1C232F01118CB8B424793ae03F870aa7D0ac7f77',
  }
  const provider = new providers.JsonRpcProvider(JSON_RPC_PROVIDER)
  const signer = new ethers.Wallet(privateKey, provider)
  const gasLimit = 1000000
  const contract = new Contract(contracts.UniswapV2Router02, contractInterface, signer)
  const WRAPPED_XDAI_CONTRACT = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'
  const BZZ_ON_XDAI_CONTRACT = '0xdbf3ea6f5bee45c02255b2c26a16f300502f68da'
  const response = await contract.swapExactETHForTokens(
    minimumBzz,
    [WRAPPED_XDAI_CONTRACT, BZZ_ON_XDAI_CONTRACT],
    await signer.getAddress(),
    Date.now(),
    {
      value: xdai,
      gasLimit,
    },
  )

  return response
}
