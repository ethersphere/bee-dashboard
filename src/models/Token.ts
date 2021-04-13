import { BigNumber } from 'bignumber.js'
import { isInteger, makeBigNumber } from '../utils'

const POSSIBLE_DECIMALS = [18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
type digits = typeof POSSIBLE_DECIMALS[number]

const BZZ_DECIMALS = 16

export class Token {
  private amount: BigNumber
  private readonly decimals: digits

  constructor(amount: BigNumber | string | bigint, decimals: digits = BZZ_DECIMALS) {
    const a = makeBigNumber(amount)

    if (!isInteger(a) || !POSSIBLE_DECIMALS.includes(decimals)) throw new TypeError('Not a valid token values')

    this.amount = a
    this.decimals = decimals
  }

  /**
   * Construct new Token from a digit representation
   *
   * @param amount    Amount of a token in the digits (1 token = 10^decimals)
   * @param decimals  Number of decimals for the token (must be integer)
   *
   * @throws {TypeError} If the decimals is not an integer or the amount after conversion is not an integer
   *
   * @returns new Token
   */
  static fromDecimal(amount: BigNumber | string | bigint, decimals: digits = BZZ_DECIMALS): Token | never {
    const a = makeBigNumber(amount)

    // No need to do any validation here, it is done when the new token is created
    const t = a.multipliedBy(new BigNumber(10).pow(decimals))

    return new Token(t, decimals)
  }

  get toBigInt(): bigint {
    return BigInt(this.amount.toFixed(0))
  }

  get toString(): string {
    return this.amount.toFixed(0)
  }

  get toBigNumber(): BigNumber {
    return new BigNumber(this.amount)
  }

  get toDecimal(): BigNumber {
    return this.amount.dividedBy(new BigNumber(10).pow(this.decimals))
  }
}
