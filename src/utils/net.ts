/* eslint-disable @typescript-eslint/no-explicit-any */

export function getJson(url: string): Promise<Record<string, any>> {
  return sendRequest(url, 'GET')
}

export function postJson(url: string, data?: Record<string, any>): Promise<Record<string, unknown>> {
  return sendRequest(url, 'POST', data)
}

async function sendRequest(
  url: string,
  method: 'GET' | 'POST',
  body?: Record<string, unknown>,
): Promise<Record<string, any>> {
  const authorization = localStorage.getItem('apiKey')

  if (!authorization) {
    throw Error('API key not found in local storage')
  }
  const headers = {
    'content-type': 'application/json',
    authorization,
  }
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await response.json()

  return json
}
