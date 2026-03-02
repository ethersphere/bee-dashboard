const { detectIndexHtml } = require('@/utils/file')

const mockFileParams = {
  lastModified: 0,
  webkitRelativePath: '',
  size: 0,
  type: '',
  arrayBuffer: async () => new ArrayBuffer(0), // eslint-disable-line require-await
  bytes: async () => new Uint8Array(0), // eslint-disable-line require-await
  slice: () => new Blob(),
  stream: () => new ReadableStream(),
  text: async () => '', // eslint-disable-line require-await
}

describe('file utils', () => {
  it('detectIndexHtml should find index.html with multiple files', () => {
    expect(
      detectIndexHtml([
        { name: 'swarm.png', path: 'swarm.png', ...mockFileParams },
        { name: 'index.html', path: 'index.html', ...mockFileParams },
      ]),
    ).toEqual({ indexPath: 'index.html' })
  })

  it('detectIndexHtml should find index.htm with multiple files', () => {
    expect(
      detectIndexHtml([
        { name: 'index.htm', path: 'index.htm', ...mockFileParams },
        { name: 'swarm.png', path: 'swarm.png', ...mockFileParams },
      ]),
    ).toEqual({ indexPath: 'index.htm' })
  })

  it('detectIndexHtml should NOT detect single index.html file as website', () => {
    expect(detectIndexHtml([{ name: 'index.html', path: 'index.html', ...mockFileParams }])).toBe(false)
  })

  it('detectIndexHtml should NOT detect single index.htm file as website', () => {
    expect(detectIndexHtml([{ name: 'index.htm', path: 'index.htm', ...mockFileParams }])).toBe(false)
  })

  it('detectIndexHtml should find nested index.html', () => {
    expect(
      detectIndexHtml([
        { name: 'swarm.png', path: 'sample-folder/swarm.png', ...mockFileParams },
        { name: 'index.html', path: 'sample-folder/index.html', ...mockFileParams },
      ]),
    ).toEqual({ indexPath: 'sample-folder/index.html', commonPrefix: 'sample-folder/' })
  })

  it('detectIndexHtml should not find nested index.htm when ambigous', () => {
    expect(
      detectIndexHtml([
        { name: 'index.htm', path: 'sample-folder/index.htm', ...mockFileParams },
        { name: 'swarm.png', path: 'other-folder/swarm.png', ...mockFileParams },
      ]),
    ).toBe(false)
  })

  it('detectIndexHtml should not find deep index.html', () => {
    expect(
      detectIndexHtml([
        { name: 'index.html', path: 'sample-folder/index.html', ...mockFileParams },
        { name: 'swarm.png', path: 'swarm.png', ...mockFileParams },
      ]),
    ).toBe(false)
  })

  it('detectIndexHtml should return false when no matches appear', () => {
    expect(
      detectIndexHtml([
        { name: 'swarm.png', path: 'swarm.png', ...mockFileParams },
        { name: 'swarm.jpg', path: 'swarm.jpg', ...mockFileParams },
      ]),
    ).toBe(false)
  })
})
