import {
  extractEns,
  extractSwarmCid,
  extractSwarmHash,
  isInteger,
  makeBigNumber,
  recognizeEnsOrSwarmHash,
} from '@/utils'

const { BigNumber } = require('bignumber.js')

interface TestObject {
  input: string
  expectedOutput: string | undefined
}

const correctHashes: TestObject[] = [
  // non-encrypted
  {
    input: 'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
    expectedOutput: 'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  {
    input: 'http://gateway.org/bzz/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
    expectedOutput: 'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  {
    input: 'https://gateway.org/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
    expectedOutput: 'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  {
    input: 'http://gateway.org/bzz/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f/',
    expectedOutput: 'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  {
    input: 'https://gateway.org/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f/',
    expectedOutput: 'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  // encrypted
  {
    input:
      'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
    expectedOutput:
      'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  {
    input:
      'http://gateway.org/bzz/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
    expectedOutput:
      'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  {
    input:
      'https://gateway.org/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
    expectedOutput:
      'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  {
    input:
      'http://gateway.org/bzz/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f/',
    expectedOutput:
      'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
  {
    input:
      'https://gateway.org/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f/',
    expectedOutput:
      'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fb7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3f',
  },
]

const wrongHashes: string[] = [
  // one character too long
  'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fa',
  'http://gateway.org/bzz/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fa',
  'https://gateway.org/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fa',
  'http://gateway.org/bzz/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fa/',
  'https://gateway.org/b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d3fa/',

  // a bit shorter
  'b7e53783114e4555384d7fd7154eb8c2e3f7c749c176dcb8f4015b08161b3d',
]

const correctCids: TestObject[] = [
  {
    input: 'https://bah5acgza5afd34lfvo7sowxfjahj4ujeduxgg2ge5u3zo4kcjlzjzi23fhka.bzz.link',
    expectedOutput: 'e80a3df165abbf275ae5480e9e51241d2e6368c4ed379771424af29ca35b29d4',
  },
  {
    input: 'https://bah5acgza2lzgtqfztvn3xtnzhv7qvbmblljd7bi52l5jiueretcad55vookq.bzz.link',
    expectedOutput: 'd2f269c0b99d5bbbcdb93d7f0a85815ad23f851dd2fa94509124c401f7b57395',
  },
]

const wrongCids: string[] = [
  'https://bah5acgza5afd34lfvo7sowxfjahj4ujeduxgg2ge5u3zo4kcjlzjzi23fhka.another.domain',
  'http://bah5acgza2lzgtqfztvn3xtnzhv7qvbmblljd7bi52l5jiueretcad55vookq.bzz.link',
  'https://not_cid.bzz.link',
  'https://bah5acgza5afd34lfvo7sowxfjahj4ujeduxgg2ge5u3zo4kcjlzjzi23fhka.subdomain.bzz.link',
  'https://bah5acgza5afd34lfvo7sowxfjahj4ujeduxgg2ge5u3zo4kcjlzjzi23fhka.subdomain.bzz.link',
  'https://bah5acgza2lzgtqfztvn3xtnzhv7qvbmblljd7bi52l5jiueretcad55vook.bzz.link',
  'https://aah5acgza2lzgtqfztvn3xtnzhv7qvbmblljd7bi52l5jiueretcad55vookq.bzz.link',
]

const correctEns: TestObject[] = [
  {
    input: 'test.eth',
    expectedOutput: 'test.eth',
  },
  {
    input: 't-est.eth',
    expectedOutput: 't-est.eth',
  },
  {
    input: 'http://test.eth/whatever',
    expectedOutput: 'test.eth',
  },
  {
    input: 'https://alice.test.eth?whatever',
    expectedOutput: 'alice.test.eth',
  },
  {
    input: 'swarm.example.eth/?id=1&page=2',
    expectedOutput: 'swarm.example.eth',
  },
  {
    input: 'http://swarm.example.eth#up',
    expectedOutput: 'swarm.example.eth',
  },
  {
    input: 'http://site.eth:8008',
    expectedOutput: 'site.eth',
  },
]

const wrongEns: string[] = ['http://test.ethereum/whatever']

describe('utils', () => {
  describe('extractSwarmCid', () => {
    test('should correctly extract hash', () => {
      correctCids.forEach(({ input, expectedOutput }) => {
        const hash = extractSwarmCid(input)
        expect(hash).toBe(expectedOutput)
      })
    })
    test('should not extract cid from incorrect urls', () => {
      wrongCids.forEach(url => {
        const hash = extractSwarmCid(url)
        expect(hash).toBe(undefined)
      })
    })
  })

  describe('extractEns', () => {
    test('should correctly extract ens domain', () => {
      correctEns.forEach(({ input, expectedOutput }) => {
        const hash = extractEns(input)
        expect(hash).toBe(expectedOutput)
      })
    })
    test('should not extract ens from incorrect inputs', () => {
      wrongEns.forEach(url => {
        const hash = extractEns(url)
        expect(hash).toBe(undefined)
      })
    })
  })

  describe('recognizeEnsOrSwarmHash', () => {
    test('should correctly extract hash or ens', () => {
      ;[...correctHashes, ...correctCids, ...correctEns].forEach(({ input, expectedOutput }) => {
        const hash = recognizeEnsOrSwarmHash(input)
        expect(hash).toBe(expectedOutput)
      })
    })
    test('should not extract hash or ens from incorrect inputs but instead return them', () => {
      ;[...wrongHashes, ...wrongCids, ...wrongEns].forEach(url => {
        const hash = recognizeEnsOrSwarmHash(url)
        expect(hash).toBe(url)
      })
    })
  })

  describe('isInteger', () => {
    const correctValues = [
      BigInt(0),
      BigInt(1),
      BigInt(-1),
      new BigNumber('1'),
      new BigNumber('0'),
      new BigNumber('-1'),
    ]
    const wrongValues = ['1', new BigNumber('-0.1'), new BigNumber(NaN), new BigNumber(Infinity)]

    correctValues.forEach(v => {
      test(`testing ${v}`, () => {
        expect(isInteger(v)).toBe(true)
      })
    })

    wrongValues.forEach(v => {
      test(`testing ${v}`, () => {
        expect(isInteger(v)).toBe(false)
      })
    })
  })

  describe('makeBigNumber', () => {
    const correctValues = [
      BigInt(0),
      BigInt(1),
      BigInt(-1),
      '1',
      '0',
      '-1',
      '0.1',
      new BigNumber('1'),
      new BigNumber('0'),
      new BigNumber('-1'),
      0,
      1,
      -1,
    ]
    const wrongValues = [new Function()]

    correctValues.forEach(v => {
      test(`testing ${v}`, () => {
        expect(BigNumber.isBigNumber(makeBigNumber(v))).toBe(true)
      })
    })

    wrongValues.forEach(v => {
      test(`testing ${v}`, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => makeBigNumber(v as unknown as any)).toThrow()
      })
    })
  })

  describe('extractSwarmHash', () => {
    test('should return 64 hash', () => {
      expect(extractSwarmHash('7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81ac3')).toBe(
        '7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81ac3',
      )
    })

    test('should return 128 hash', () => {
      expect(
        extractSwarmHash(
          'd1829242c4d08e9f914fedfb1f68aacd62826d75370a9a57a80c9e6e6a49983c767c013be9aa4319e34fd8323ef0f2a57426b30e66c87e219f6f6359e2595e7f',
        ),
      ).toBe(
        'd1829242c4d08e9f914fedfb1f68aacd62826d75370a9a57a80c9e6e6a49983c767c013be9aa4319e34fd8323ef0f2a57426b30e66c87e219f6f6359e2595e7f',
      )
    })

    test('should return 64 hash from url', () => {
      expect(
        extractSwarmHash('http://localhost:1633/bzz/7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81ac3/'),
      ).toBe('7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81ac3')
    })

    test('should return 128 hash from url', () => {
      expect(
        extractSwarmHash(
          'http://localhost:1633/bzz/d1829242c4d08e9f914fedfb1f68aacd62826d75370a9a57a80c9e6e6a49983c767c013be9aa4319e34fd8323ef0f2a57426b30e66c87e219f6f6359e2595e7f/',
        ),
      ).toBe(
        'd1829242c4d08e9f914fedfb1f68aacd62826d75370a9a57a80c9e6e6a49983c767c013be9aa4319e34fd8323ef0f2a57426b30e66c87e219f6f6359e2595e7f',
      )
    })

    test('should return undefined when nothing is found', () => {
      expect(extractSwarmHash('Bee Dashboard')).toBe(undefined)
    })

    test('should return undefined when length is incorrect', () => {
      expect(extractSwarmHash('7f0fe712cdd78bdea52d040369eb32b6af5ecd01fa5ae49b7506412abdd81a')).toBe(undefined)
    })

    test('should return undefined when alphanumeric', () => {
      expect(extractSwarmHash('gkQ6duo5iHJ099g908P0t17ZWFf8Ke2klrywLP5BGtLkcaEC5W0kLEfbe4wUnDI6')).toBe(undefined)
    })

    test('should correctly extract hash', () => {
      correctHashes.forEach(({ input, expectedOutput }) => {
        const hash = extractSwarmHash(input)
        expect(hash).toBe(expectedOutput)
      })
    })
    test('should not extract hash from incorrect inputs', () => {
      wrongHashes.forEach(input => {
        const hash = extractSwarmHash(input)
        expect(hash).toBe(undefined)
      })
    })
  })
})
