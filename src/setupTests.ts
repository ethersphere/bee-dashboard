import { TextDecoder, TextEncoder } from 'util'

import '@testing-library/jest-dom'

Object.assign(global, { TextDecoder, TextEncoder })
