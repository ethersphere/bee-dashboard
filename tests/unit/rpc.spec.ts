import { BZZ, DAI } from '@ethersphere/bee-js'

import { sendBzzTransaction, sendNativeTransaction } from '../../src/utils/rpc'

interface MockProvider {
  getFeeData: jest.Mock
  getNetwork: jest.Mock
}

const mockWait = jest.fn()
const mockTransfer = jest.fn()
const mockGetFeeData = jest.fn()
const mockGetNetwork = jest.fn()
const mockSendTransaction = jest.fn()
const mockProvider: MockProvider = {
  getFeeData: mockGetFeeData,
  getNetwork: mockGetNetwork,
}

const bzzValue = BZZ.fromDecimalString('1')
const daiValue = DAI.fromDecimalString('1')
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
    sendTransaction = mockSendTransaction

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
    await sendBzzTransaction(privateKey, address, bzzValue, jsonRpcProvider)
    const to = mockTransfer.mock.calls[0][0] as string
    expect(to.startsWith('0x')).toBe(true)
  })

  it('passes BZZ value as bigint (not BZZ object)', async () => {
    await sendBzzTransaction(privateKey, '0x52908400098527886e0f7030069857d2e4169ee7', bzzValue, jsonRpcProvider)
    const transferredValue = mockTransfer.mock.calls[0][1]
    expect(typeof transferredValue).toBe('bigint')
    expect(transferredValue).toBe(bzzValue.toPLURBigInt())
  })
})

describe('sendNativeTransaction', () => {
  const addresses = ['52908400098527886e0f7030069857d2e4169ee7', '0x52908400098527886e0f7030069857d2e4169ee7']

  beforeEach(() => {
    jest.clearAllMocks()
    mockWait.mockResolvedValue({ status: 1 })
    mockSendTransaction.mockResolvedValue({ wait: mockWait })
    mockGetFeeData.mockResolvedValue({ gasPrice: BigInt(1) })
    mockGetNetwork.mockResolvedValue({ chainId: BigInt(100) })
  })

  it.each(addresses)('sendNativeTransaction to address: %s passes 0x-prefixed address', async (address: string) => {
    await sendNativeTransaction(privateKey, address, daiValue, jsonRpcProvider)
    const tx = mockSendTransaction.mock.calls[0][0] as { to: string }
    expect(tx.to.startsWith('0x')).toBe(true)
  })

  it('passes DAI value as bigint', async () => {
    await sendNativeTransaction(privateKey, '0x52908400098527886e0f7030069857d2e4169ee7', daiValue, jsonRpcProvider)
    const tx = mockSendTransaction.mock.calls[0][0] as { value: bigint }
    expect(typeof tx.value).toBe('bigint')
    expect(tx.value).toBe(BigInt(daiValue.toWeiString()))
  })

  it('uses externalGasPrice when provided', async () => {
    const externalGasPrice = DAI.fromWei('9999')
    await sendNativeTransaction(
      privateKey,
      '0x52908400098527886e0f7030069857d2e4169ee7',
      daiValue,
      jsonRpcProvider,
      externalGasPrice,
    )
    const tx = mockSendTransaction.mock.calls[0][0] as { gasPrice: bigint }
    expect(tx.gasPrice).toBe(BigInt(externalGasPrice.toWeiString()))
  })
})
