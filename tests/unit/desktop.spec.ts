import { extractEnsResolverUrl } from '@/utils/desktop'

describe('extractEnsResolverUrl', () => {
  test('extracts a bare url', () => {
    expect(extractEnsResolverUrl('https://rpc.example.com')).toBe('https://rpc.example.com')
  })

  test('extracts a url prefixed with tld and contract address', () => {
    expect(extractEnsResolverUrl('eth:0x0000000000000000000000000000000000000000@https://rpc.example.com')).toBe(
      'https://rpc.example.com',
    )
  })

  test('returns null for an invalid contract address masquerading as one', () => {
    expect(extractEnsResolverUrl('foo:bar@https://rpc.example.com')).toBeNull()
  })

  test('returns null for a non-url value', () => {
    expect(extractEnsResolverUrl('not a url')).toBeNull()
  })
})
