import { BigNumber } from 'bignumber.js'
import { Token } from './Token'

export const BZZ_DECIMAL_PLACES = 16

export class BzzToken extends Token {
  constructor(value: BigNumber | string | bigint) {
    super(value, BZZ_DECIMAL_PLACES)
  }

  static fromDecimal(value: BigNumber | string | bigint): BzzToken {
    return Token.fromDecimal(value, BZZ_DECIMAL_PLACES)
  }
}
