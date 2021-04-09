import { toBZZbaseUnit, fromBZZbaseUnit, assertSafeBZZ } from './index'

describe('utils', () => {
  const values = [
    { bzz: 0, baseUnits: 0 },
    { bzz: 1, baseUnits: 1e15 },
  ]

  describe('toBZZbaseUnit', () => {
    values.forEach(({ bzz, baseUnits }) => {
      test(`converting ${bzz} => ${baseUnits}`, () => {
        expect(toBZZbaseUnit(bzz)).toBe(baseUnits)
      })
    })
  })

  describe('fromBZZbaseUnit', () => {
    values.forEach(({ bzz, baseUnits }) => {
      test(`converting ${bzz} => ${baseUnits}`, () => {
        expect(fromBZZbaseUnit(baseUnits)).toBe(bzz)
      })
    })
  })

  describe('assertSafeBZZ', () => {
    const correctNums = [0, 1, 9, -0.324, -1.534315351351353]
    const wrongNums = [10, -10]

    const correctValues = [...correctNums, ...correctNums.map(String), '.5']
    const wrongValues = [...wrongNums, ...wrongNums.map(String), new Function(), {}, undefined]

    correctValues.forEach(v => {
      test(`expect ${v} to pass`, () => {
        expect(assertSafeBZZ(v))
      })
    })

    wrongValues.forEach(v => {
      test(`expect ${v} to throw`, () => {
        expect(() => assertSafeBZZ(v)).toThrow()
      })
    })
  })
})
