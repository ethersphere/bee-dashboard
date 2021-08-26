import type { Token } from './models/Token'

export interface ChequebookBalance {
  totalBalance: Token
  availableBalance: Token
}

export interface Balance {
  peer: string
  balance: Token
}

export interface Settlement {
  peer: string
  received: Token
  sent: Token
}

export interface Settlements {
  totalReceived: Token
  totalSent: Token
  settlements: Settlement[]
}
