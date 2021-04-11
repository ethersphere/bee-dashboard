import { BigNumber } from 'bignumber.js'
import { isInteger, makeBigNumber } from '../utils'

const BZZ_DECIMALS = new BigNumber(16)

export class Token {
  private amount: BigNumber
  private readonly decimals: BigNumber

  constructor(amount: BigNumber | string | bigint, decimals: BigNumber | string | bigint = BZZ_DECIMALS) {
    const a = makeBigNumber(amount)
    const d = makeBigNumber(decimals)

    if (!isInteger(a) || !isInteger(d)) throw new TypeError('Not a valid token values')

    this.amount = a
    this.decimals = d
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
  static fromDecimal(
    amount: BigNumber | string | bigint,
    decimals: BigNumber | string | bigint = BZZ_DECIMALS,
  ): Token | never {
    const a = makeBigNumber(amount)
    const d = makeBigNumber(decimals)

    // No need to do any validation here, it is done when the new token is created
    const t = a.multipliedBy(new BigNumber(10).pow(d))

    return new Token(t, d)
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
