import BigNumber from 'bignumber.js'
import { Token } from './Token'

describe('models/Token', () => {
  describe('Token.fromDecimal', () => {
    const values = [
      { bzz: '0', baseUnits: 0 },
      { bzz: '0.1', baseUnits: BigInt('1000000000000000') },
      { bzz: '9.9', baseUnits: BigInt('99000000000000000') },
    ]

    values.forEach(({ bzz, baseUnits }) => {
      test(`converting ${bzz} => ${baseUnits}`, () => {
        expect(Token.fromDecimal(bzz).toBigNumber.eq(baseUnits.toString())).toBe(true)
      })
    })
  })

  describe('new Token', () => {
    const cs = ['0', '1234567890', '99000000000000000']
    const correctValues = [...cs, ...cs.map(BigInt), ...cs.map(v => new BigNumber(v))]

    correctValues.forEach(v => {
      test(`New Token ${v} of type ${typeof v}`, () => {
        const t = new Token(v)

        expect(t.toBigNumber.eq(v.toString())).toBe(true)
      })
    })
  })
})
