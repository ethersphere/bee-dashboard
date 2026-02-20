import { renderHook, waitFor } from '@testing-library/react'
import cors from 'cors'
import express from 'express'
import type { Server } from 'http'

import { useBeeDesktop } from '@/hooks/apiHooks'

interface AddressInfo {
  address: string
  family: string
  port: number
}

export function mockServer(data: Record<string | number | symbol, string | boolean>): Promise<Server> {
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

let serverCorrectURL: string

beforeAll(async () => {
  serverCorrect = await mockServer({ autoUpdateEnabled: true, version: '0.1.0' })
  const portServerCorrect = (serverCorrect.address() as AddressInfo).port
  serverCorrectURL = `http://localhost:${portServerCorrect}`
})

afterAll(async () => {
  await new Promise(resolve => serverCorrect.close(resolve))
})

describe('useBeeDesktop', () => {
  it('should not have error when connected to bee-desktop', async () => {
    const { result } = renderHook(() => useBeeDesktop(true, serverCorrectURL))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.desktopAutoUpdateEnabled).toBe(true)
    expect(result.current.beeDesktopVersion).toBe('0.1.0')
    expect(result.current.error).toBe(null)
  })
})
