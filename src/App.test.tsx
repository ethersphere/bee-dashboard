import { render } from '@testing-library/react'
import App from './App'

// Mocks methods that are not implemented in JSDOM
// see https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// TODO: this is not a good test and should be removed. Keeping it in to make sure the whole app renders (to be used in CI)
test('should render the app', async () => {
  render(<App />)
})
