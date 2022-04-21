/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios'

export function getJson(url: string): Promise<Record<string, any>> {
  return sendRequest(url, 'GET')
}

export function postJson(url: string, data?: Record<string, any>): Promise<Record<string, unknown>> {
  return sendRequest(url, 'POST', data)
}

async function sendRequest(
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
