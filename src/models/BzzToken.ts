import { BigNumber } from 'bignumber.js'
import { Token } from './Token'

export class BzzToken extends Token {
  constructor(amount: BigNumber | string | bigint) {
    super(amount, 16)
  }
}
