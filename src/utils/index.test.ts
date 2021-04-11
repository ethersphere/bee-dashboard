import BigNumber from 'bignumber.js'
import { fromBZZbaseUnit, isInteger, makeBigNumber } from './index'

describe('utils', () => {
  describe('fromBZZbaseUnit', () => {
    const values = [
      { bzz: 0, baseUnits: 0 },
      { bzz: 0.1, baseUnits: 1e15 },
      { bzz: 0.9, baseUnits: 9e15 },
    ]

    values.forEach(({ bzz, baseUnits }) => {
      test(`converting ${bzz} => ${baseUnits}`, () => {
        expect(fromBZZbaseUnit(baseUnits)).toBe(bzz)
      })
    })
  })

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
    ]
    const wrongValues = [new Function(), 0, 1]

    correctValues.forEach(v => {
      test(`testing ${v}`, () => {
        expect(BigNumber.isBigNumber(makeBigNumber(v))).toBe(true)
      })
    })

    wrongValues.forEach(v => {
      test(`testing ${v}`, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => makeBigNumber((v as unknown) as any)).toThrow()
      })
    })
  })
})
