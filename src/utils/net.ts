/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios'
import { AuthError } from './AuthError'

export function getJson<T extends Record<string, any>>(url: string): Promise<T> {
  return sendRequest(url, 'GET') as Promise<T>
}

export function postJson<T extends Record<string, any>>(url: string, data?: Record<string, any>): Promise<T> {
  return sendRequest(url, 'POST', data) as Promise<T>
}

export async function sendRequest(
  url: string,
  method: 'GET' | 'POST',
  data?: Record<string, unknown>,
): Promise<Record<string, any>> {
  const authorization = localStorage.getItem('apiKey')

  if (!authorization) {
    throw Error('API key not found in local storage. Please reopen via Swarm Desktop > Open Web UI.')
  }
  const headers = {
    authorization,
  }
  const response = await axios(url, {
    method,
    headers,
    data,
  }).catch(error => {
    if (error?.response?.status === 401) {
      throw new AuthError()
    }

    if (error?.response?.data) {
      throw Error(`Request ${method} ${url} failed: ${JSON.stringify(error.response.data)}`)
    }
    throw error
  })

  return response.data
}
