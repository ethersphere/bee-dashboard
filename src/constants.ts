// These values can for now be constants because their change in the app reloads the page
export const apiHost = sessionStorage.getItem('api_host') || process.env.REACT_APP_BEE_HOST || 'http://localhost:1633'
export const debugApiHost =
  sessionStorage.getItem('debug_api_host') || process.env.REACT_APP_BEE_DEBUG_HOST || 'http://localhost:1635'
