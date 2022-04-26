import { extractSwarmHash, extractSwarmCid, extractEns, recognizeEnsOrSwarmHash } from './index'

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

describe('extractSwarmHash', () => {
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
