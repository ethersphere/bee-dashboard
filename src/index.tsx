import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'

const desktopEnabled = process.env.REACT_APP_BEE_DESKTOP_ENABLED === 'true'
const desktopUrl = process.env.REACT_APP_BEE_DESKTOP_URL
const beeApiUrl = process.env.REACT_APP_BEE_HOST
const defaultRpcUrl = process.env.REACT_APP_DEFAULT_RPC_URL

ReactDOM.render(
  <React.StrictMode>
    <App isDesktop={desktopEnabled} desktopUrl={desktopUrl} beeApiUrl={beeApiUrl} defaultRpcUrl={defaultRpcUrl} />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
