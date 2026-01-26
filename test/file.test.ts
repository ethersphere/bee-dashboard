import { detectIndexHtml } from './file'

describe('file utils', () => {
  it('detectIndexHtml should find index.html with multiple files', () => {
    expect(
      detectIndexHtml([
        { name: 'swarm.png', path: 'swarm.png' },
        { name: 'index.html', path: 'index.html' },
      ]),
    ).toEqual({ indexPath: 'index.html' })
  })

  it('detectIndexHtml should find index.htm with multiple files', () => {
    expect(
      detectIndexHtml([
        { name: 'index.htm', path: 'index.htm' },
        { name: 'swarm.png', path: 'swarm.png' },
      ]),
    ).toEqual({ indexPath: 'index.htm' })
  })

  it('detectIndexHtml should NOT detect single index.html file as website', () => {
    expect(
      detectIndexHtml([
        { name: 'index.html', path: 'index.html' },
      ]),
    ).toBe(false)
  })

  it('detectIndexHtml should NOT detect single index.htm file as website', () => {
    expect(
      detectIndexHtml([
        { name: 'index.htm', path: 'index.htm' },
      ]),
    ).toBe(false)
  })

  it('detectIndexHtml should find nested index.html', () => {
    expect(
      detectIndexHtml([
        { name: 'swarm.png', path: 'sample-folder/swarm.png' },
        { name: 'index.html', path: 'sample-folder/index.html' },
      ]),
    ).toEqual({ indexPath: 'sample-folder/index.html', commonPrefix: 'sample-folder/' })
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
