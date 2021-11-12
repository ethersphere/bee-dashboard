import { detectIndexHtml } from './file'

describe('file utils', () => {
  it('detectIndexHtml should find index.html', () => {
    expect(
      detectIndexHtml([
        { name: 'swarm.png', path: 'swarm.png' },
        { name: 'index.html', path: 'index.html' },
      ]),
    ).toBe('index.html')
  })

  it('detectIndexHtml should find index.htm', () => {
    expect(
      detectIndexHtml([
        { name: 'index.htm', path: 'index.htm' },
        { name: 'swarm.png', path: 'swarm.png' },
      ]),
    ).toBe('index.htm')
  })

  it('detectIndexHtml should find nested index.html', () => {
    expect(
      detectIndexHtml([
        { name: 'swarm.png', path: 'sample-folder/swarm.png' },
        { name: 'index.html', path: 'sample-folder/index.html' },
      ]),
    ).toBe('index.html')
  })

  it('detectIndexHtml should not find nested index.htm when ambigous', () => {
    expect(
      detectIndexHtml([
        { name: 'index.htm', path: 'sample-folder/index.htm' },
        { name: 'swarm.png', path: 'other-folder/swarm.png' },
      ]),
    ).toBe(false)
  })

  it('detectIndexHtml should not find deep index.html', () => {
    expect(
      detectIndexHtml([
        { name: 'index.html', path: 'sample-folder/index.html' },
        { name: 'swarm.png', path: 'swarm.png' },
      ]),
    ).toBe(false)
  })

  it('detectIndexHtml should return false when no matches appear', () => {
    expect(
      detectIndexHtml([
        { name: 'swarm.png', path: 'swarm.png' },
        { name: 'swarm.jpg', path: 'swarm.jpg' },
      ]),
    ).toBe(false)
  })
})
