import { BZZ } from '@ethersphere/bee-js'
import { sendBzzTransaction } from './rpc'

const mockWait = jest.fn()
const mockTransfer = jest.fn()
const mockGetGasPrice = jest.fn()
const value = BZZ.fromDecimalString('1')
const privateKey = 'FFFF000000000000000000000000000000000000000000000000000000000000'
const jsonRpcProvider = 'http://mock-json-rpc-provider'

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers')

  class Contract {
    transfer = mockTransfer
    balanceOf = jest.fn()
  }

  class Wallet {
    getGasPrice = mockGetGasPrice
  }

  return {
    ...actual,
    Contract,
    Wallet,
    providers: {
      ...actual.providers,
      JsonRpcProvider: jest.fn(() => ({
        ready: Promise.resolve(),
        getBalance: jest.fn(),
        getBlockNumber: jest.fn(),
        getNetwork: jest.fn(),
      })),
    },
  }
})

describe('sendBzzTransaction', () => {
  const addresses = ['52908400098527886e0f7030069857d2e4169ee7', '0x52908400098527886e0f7030069857d2e4169ee7']

  beforeEach(() => {
    jest.clearAllMocks()
    mockWait.mockResolvedValue({ status: 1 })
    mockTransfer.mockResolvedValue({ wait: mockWait })
    mockGetGasPrice.mockResolvedValue('mock-gas-price')
  })

  it.each(addresses)('sendBzzTransaction to address: %s', async address => {
    await sendBzzTransaction(privateKey, address, value, jsonRpcProvider)
    const to = mockTransfer.mock.calls[0][0] as string
    expect(to.startsWith('0x')).toBe(true)
  })
})
