import BigNumber from 'bignumber.js'
import { extractSwarmHash, isInteger, makeBigNumber } from './index'

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

  describe('extractSwarmHash', () => {
    test('should return 64 hash', () => {
      expect(extractSwarmHash('7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81ac3')).toBe(
        '7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81ac3',
      )
    })

    test('should return 128 hash', () => {
      expect(
        extractSwarmHash(
          'd1829242c4d08e9f914fedfb1f68aacd62826d75370a9a57a80c9e6e6a49983c767c013be9aa4319e34fd8323ef0f2a57426b30e66c87e219f6f6359e2595e7f',
        ),
      ).toBe(
        'd1829242c4d08e9f914fedfb1f68aacd62826d75370a9a57a80c9e6e6a49983c767c013be9aa4319e34fd8323ef0f2a57426b30e66c87e219f6f6359e2595e7f',
      )
    })

    test('should return 64 hash from url', () => {
      expect(
        extractSwarmHash('http://localhost:1633/bzz/7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81ac3/'),
      ).toBe('7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81ac3')
    })

    test('should return 128 hash from url', () => {
      expect(
        extractSwarmHash(
          'http://localhost:1633/bzz/d1829242c4d08e9f914fedfb1f68aacd62826d75370a9a57a80c9e6e6a49983c767c013be9aa4319e34fd8323ef0f2a57426b30e66c87e219f6f6359e2595e7f/',
        ),
      ).toBe(
        'd1829242c4d08e9f914fedfb1f68aacd62826d75370a9a57a80c9e6e6a49983c767c013be9aa4319e34fd8323ef0f2a57426b30e66c87e219f6f6359e2595e7f',
      )
    })

    test('should return null when nothing is found', () => {
      expect(extractSwarmHash('Bee Dashboard')).toBe(null)
    })

    test('should return null when length is incorrect', () => {
      expect(extractSwarmHash('7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81a')).toBe(null)
    })

    test('should return null when alphanumeric', () => {
      expect(extractSwarmHash('gkQ6duo5iHJ099g908P0t17ZWFf8Ke2klrywLP5BGtLkcaEC5W0kLEfbe4wUnDI6')).toBe(null)
    })
  })
})
