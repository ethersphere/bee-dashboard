import { BeeResponseError, BZZ, DAI, WalletBalance } from '@ethersphere/bee-js'

import { extractBeeApiErrorMessage, getStampFundsShortageMessage, notifyStampFundsShortage } from '@/utils/bee-error'

function makeWalletBalance(bzz: string, dai: string): WalletBalance {
  return {
    bzzBalance: BZZ.fromDecimalString(bzz),
    nativeTokenBalance: DAI.fromDecimalString(dai),
    chainID: 100,
    chequebookContractAddress: '0x0',
    walletAddress: '0x0',
  }
}

describe('extractBeeApiErrorMessage', () => {
  it('should return the Bee node message from the response body', () => {
    const error = new BeeResponseError(
      'post',
      '/stamps/1/17',
      'Request failed with status code 400',
      { code: 400, message: 'out of funds' },
      400,
      'Bad Request',
    )

    expect(extractBeeApiErrorMessage(error)).toBe('out of funds')
  })

  it('should return a plain-text response body as-is', () => {
    const error = new BeeResponseError(
      'post',
      '/stamps/1/17',
      'Request failed with status code 402',
      'out of funds',
      402,
      'Payment Required',
    )

    expect(extractBeeApiErrorMessage(error)).toBe('out of funds')
  })

  it('should fall back to the error message when there is no response body', () => {
    const error = new BeeResponseError('post', '/stamps/1/17', 'Network Error', undefined, undefined, undefined)

    expect(extractBeeApiErrorMessage(error)).toBe('Network Error')
  })

  it('should handle plain errors', () => {
    expect(extractBeeApiErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('should handle non-error values', () => {
    expect(extractBeeApiErrorMessage('boom')).toBe('boom')
  })
})

describe('getStampFundsShortageMessage', () => {
  it('should report insufficient xBZZ with concrete amounts', () => {
    const cost = BZZ.fromDecimalString('0.6144')
    const message = getStampFundsShortageMessage(cost, makeWalletBalance('0.05', '1'))

    expect(message).toContain('Not enough xBZZ')
    expect(message).toContain('0.6144')
    expect(message).toContain('0.05')
  })

  it('should report missing xDAI for gas fees', () => {
    const cost = BZZ.fromDecimalString('0.1')
    const message = getStampFundsShortageMessage(cost, makeWalletBalance('1', '0'))

    expect(message).toContain('No xDAI')
  })

  it('should return null when the balance is sufficient', () => {
    const cost = BZZ.fromDecimalString('0.1')

    expect(getStampFundsShortageMessage(cost, makeWalletBalance('1', '1'))).toBeNull()
  })

  it('should return null when the balance is unknown', () => {
    expect(getStampFundsShortageMessage(BZZ.fromDecimalString('1'), null)).toBeNull()
  })
})

describe('notifyStampFundsShortage', () => {
  it('should show an error snackbar and return true on shortage', () => {
    const enqueueSnackbar = jest.fn()
    const aborted = notifyStampFundsShortage(
      BZZ.fromDecimalString('1'),
      makeWalletBalance('0.05', '1'),
      enqueueSnackbar,
    )

    expect(aborted).toBe(true)
    expect(enqueueSnackbar).toHaveBeenCalledWith(expect.stringContaining('Not enough xBZZ'), { variant: 'error' })
  })

  it('should not notify and return false when the balance is sufficient', () => {
    const enqueueSnackbar = jest.fn()
    const aborted = notifyStampFundsShortage(BZZ.fromDecimalString('0.1'), makeWalletBalance('1', '1'), enqueueSnackbar)

    expect(aborted).toBe(false)
    expect(enqueueSnackbar).not.toHaveBeenCalled()
  })
})
