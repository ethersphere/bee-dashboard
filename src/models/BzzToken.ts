import { BigNumber } from 'bignumber.js'
import { Token } from './Token'

export class BzzToken extends Token {
  constructor(value: BigNumber | string | bigint) {
    super(value, 16)
  }

  static fromDecimal(value: BigNumber | string | bigint): BzzToken {
    return Token.fromDecimal(value, 16)
  }
}
