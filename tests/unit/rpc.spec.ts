import { BZZ } from '@ethersphere/bee-js'

import { sendBzzTransaction } from '../../src/utils/rpc'

interface MockProvider {
  getFeeData: jest.Mock
  getNetwork: jest.Mock
}

const mockWait = jest.fn()
const mockTransfer = jest.fn()
const mockGetFeeData = jest.fn()
const mockGetNetwork = jest.fn()
const mockProvider: MockProvider = {
  getFeeData: mockGetFeeData,
  getNetwork: mockGetNetwork,
}

const value = BZZ.fromDecimalString('1')
const privateKey = 'FFFF000000000000000000000000000000000000000000000000000000000000'
const jsonRpcProvider = 'http://mock-json-rpc-provider'

jest.mock('../../src/utils/chain', () => {
  const actual = jest.requireActual('../../src/utils/chain')

  return {
    ...actual,
    newGnosisProvider: jest.fn(() => mockProvider),
  }
})

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers')

  class Contract {
    transfer = mockTransfer
    balanceOf = { staticCall: jest.fn() }
  }

  class Wallet {
    provider: MockProvider

    constructor(_privateKey: string, provider: MockProvider) {
      this.provider = provider
    }
  }

  return {
    ...actual,
    Contract,
    Wallet,
  }
})

describe('sendBzzTransaction', () => {
  const addresses = ['52908400098527886e0f7030069857d2e4169ee7', '0x52908400098527886e0f7030069857d2e4169ee7']

  beforeEach(() => {
    jest.clearAllMocks()
    mockWait.mockResolvedValue({ status: 1 })
    mockTransfer.mockResolvedValue({ wait: mockWait })
    mockGetFeeData.mockResolvedValue({ gasPrice: BigInt(1) })
    mockGetNetwork.mockResolvedValue({ chainId: BigInt(100) })
  })

  it.each(addresses)('sendBzzTransaction to address: %s', async (address: string) => {
    await sendBzzTransaction(privateKey, address, value, jsonRpcProvider)
    const to = mockTransfer.mock.calls[0][0] as string
    expect(to.startsWith('0x')).toBe(true)
  })
})
