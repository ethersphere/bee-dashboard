export const bzzContractInterface = [
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
