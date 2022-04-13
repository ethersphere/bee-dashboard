import { renderHook } from '@testing-library/react-hooks'
import express from 'express'
import cors from 'cors'
import type { Server } from 'http'
import { useIsBeeDesktop } from './apiHooks'

interface AddressInfo {
  address: string
  family: string
  port: number
}

export function mockServer(data: Record<string | number | symbol, string>): Promise<Server> {
  const app = express()
  app.use(cors())

  app.get('/info', (req, res) => {
    res.send(data)
  })

  return new Promise(resolve => {
    const server = app.listen(() => {
      resolve(server)
    })
  })
}

let serverCorrect: Server
let serverWrong: Server

let serverCorrectURL: string
let serverWrongURL: string

beforeAll(async () => {
  serverCorrect = await mockServer({ name: 'bee-desktop' })
  const portServerCorrect = (serverCorrect.address() as AddressInfo).port
  serverCorrectURL = `http://localhost:${portServerCorrect}`

  serverWrong = await mockServer({ foo: 'bar' })
  const portServerWrong = (serverWrong.address() as AddressInfo).port
  serverWrongURL = `http://localhost:${portServerWrong}`
})

afterAll(async () => {
  await new Promise(resolve => serverCorrect.close(resolve))
  await new Promise(resolve => serverWrong.close(resolve))
})

describe('useIsBeeDesktop', () => {
  it('should fail when connected to wrong server', async () => {
    const { result, waitFor } = renderHook(() => useIsBeeDesktop({ BEE_DESKTOP_URL: serverWrongURL }))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isBeeDesktop).toBe(false)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.isBeeDesktop).toBe(false)
  })

  it('should return isBeeDesktop true when connected to bee-desktop', async () => {
    const { result, waitFor } = renderHook(() => useIsBeeDesktop({ BEE_DESKTOP_URL: serverCorrectURL }))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isBeeDesktop).toBe(false)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.isBeeDesktop).toBe(true)
  })
})
