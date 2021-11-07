import BigNumber from 'bignumber.js'
import { isInteger, makeBigNumber } from './index'

describe('utils', () => {
  describe('isInteger', () => {
    const correctValues = [
      BigInt(0),
      BigInt(1),
      BigInt(-1),
      new BigNumber('1'),
      new BigNumber('0'),
      new BigNumber('-1'),
    ]
    const wrongValues = ['1', new BigNumber('-0.1'), new BigNumber(NaN), new BigNumber(Infinity)]

    correctValues.forEach(v => {
      test(`testing ${v}`, () => {
        expect(isInteger(v)).toBe(true)
      })
    })

    wrongValues.forEach(v => {
      test(`testing ${v}`, () => {
        expect(isInteger(v)).toBe(false)
      })
    })
  })

  describe('makeBigNumber', () => {
    const correctValues = [
      BigInt(0),
      BigInt(1),
      BigInt(-1),
      '1',
      '0',
      '-1',
      '0.1',
      new BigNumber('1'),
      new BigNumber('0'),
      new BigNumber('-1'),
      0,
      1,
      -1,
    ]
    const wrongValues = [new Function()] // eslint-disable-line no-new-func

    correctValues.forEach(v => {
      test(`testing ${v}`, () => {
        expect(BigNumber.isBigNumber(makeBigNumber(v))).toBe(true)
      })
    })

    wrongValues.forEach(v => {
      test(`testing ${v}`, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => makeBigNumber(v as unknown as any)).toThrow()
      })
    })
  })
})
