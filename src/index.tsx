import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const desktopEnabled = Boolean(process.env.REACT_APP_BEE_DESKTOP_ENABLED)
const desktopUrl = process.env.REACT_APP_BEE_DESKTOP_URL
const beeApiUrl = process.env.REACT_APP_BEE_API_URL
const beeDebugApiUrl = process.env.REACT_APP_BEE_DEBUG_API_URL

ReactDOM.render(
  <React.StrictMode>
    <App isDesktop={desktopEnabled} desktopUrl={desktopUrl} beeApiUrl={beeApiUrl} beeDebugApiUrl={beeDebugApiUrl} />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
