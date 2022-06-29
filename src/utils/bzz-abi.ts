export const BZZ_TOKEN_ADDRESS = '0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da'
export const bzzABI = [
  {
    type: 'function',
    stateMutability: 'view',
    payable: false,
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    name: 'balanceOf',
    inputs: [
      {
        type: 'address',
        name: '_owner',
      },
    ],
    constant: true,
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    payable: false,
    outputs: [
      {
        type: 'bool',
        name: '',
      },
    ],
    name: 'transfer',
    inputs: [
      {
        type: 'address',
        name: '_to',
      },
      {
        type: 'uint256',
        name: '_value',
      },
    ],
    constant: false,
  },
]
