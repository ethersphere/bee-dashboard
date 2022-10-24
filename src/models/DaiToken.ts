import { BigNumber } from 'bignumber.js'
import { Token } from './Token'

export class DaiToken extends Token {
  constructor(value: BigNumber | string | bigint) {
    super(value, 18)
  }

  static fromDecimal(value: BigNumber | string | bigint): DaiToken {
    return Token.fromDecimal(value, 18)
  }
}
