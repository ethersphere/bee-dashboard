import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import reportWebVitals from './reportWebVitals'

import './index.css'

const desktopEnabled = import.meta.env.VITE_BEE_DESKTOP_ENABLED === 'true'
const desktopUrl = import.meta.env.VITE_BEE_DESKTOP_URL
const beeApiUrl = import.meta.env.VITE_BEE_HOST
const defaultRpcUrl = import.meta.env.VITE_DEFAULT_RPC_URL

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App isDesktop={desktopEnabled} desktopUrl={desktopUrl} beeApiUrl={beeApiUrl} defaultRpcUrl={defaultRpcUrl} />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
