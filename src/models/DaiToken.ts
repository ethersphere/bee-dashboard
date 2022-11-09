import { BigNumber } from 'bignumber.js'
import { Token } from './Token'

const DAI_DECIMAL_PLACES = 18

export class DaiToken extends Token {
  constructor(value: BigNumber | string | bigint) {
    super(value, DAI_DECIMAL_PLACES)
  }

  static fromDecimal(value: BigNumber | string | bigint): DaiToken {
    return Token.fromDecimal(value, DAI_DECIMAL_PLACES)
  }
}
