/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios'

export function getJson<T extends Record<string, any>>(url: string): Promise<T> {
  return sendRequest(url, 'GET') as Promise<T>
}

export function postJson<T extends Record<string, any>>(url: string, data?: T): Promise<T> {
  return sendRequest(url, 'POST', data) as Promise<T>
}

export async function sendRequest(
  url: string,
  method: 'GET' | 'POST',
  data?: Record<string, unknown>,
): Promise<Record<string, any>> {
  const authorization = localStorage.getItem('apiKey')

  if (!authorization) {
    throw Error('API key not found in local storage')
  }
  const headers = {
    authorization,
  }
  const response = await axios(url, {
    method,
    headers,
    data,
  })

  return response.data
}

// TODO: replace this with bee-js once released
export async function getReadiness(beeDebugApi: string): Promise<boolean> {
  try {
    const response = await axios.get(`${beeDebugApi}/readiness`)

    return response.status === 200
  } catch {
    return false
  }
}
