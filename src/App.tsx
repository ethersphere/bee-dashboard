import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import React, { ReactElement } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import './App.css'
import Dashboard from './layout/Dashboard'
import { Provider as BeeProvider } from './providers/Bee'
import { Provider as FeedsProvider } from './providers/Feeds'
import { Provider as FileProvider } from './providers/File'
import { Provider as PlatformProvider } from './providers/Platform'
import { Provider as SettingsProvider } from './providers/Settings'
import { Provider as StampsProvider } from './providers/Stamps'
import { Provider as TopUpProvider } from './providers/TopUp'
import BaseRouter from './routes'
import { theme } from './theme'
import { config } from './config'
import { getBeeDesktopLogs, getBeeLogs } from './utils/desktop'
import packageJson from '../package.json'
import ItsBroken from './layout/ItsBroken'

interface Props {
  beeApiUrl?: string
  beeDebugApiUrl?: string
  lockedApiSettings?: boolean
}

if (config.SENTRY_KEY) {
  ;(async () => {
    let tunnelAvailable = false

    try {
      const result = await fetch(`${config.BEE_DESKTOP_URL}/sentry`, { method: 'OPTIONS' })

      if (result.status === 204) {
        tunnelAvailable = true
      }
    } catch (e) {
      // There was an error, so tunnel is not available ==> NOOP
    }

    Sentry.init({
      dsn: config.SENTRY_KEY,
      release: packageJson.version,
      tunnel: tunnelAvailable ? `${config.BEE_DESKTOP_URL}/sentry` : undefined,
      integrations: [new BrowserTracing({ tracingOrigins: ['localhost'] })],
      tracesSampleRate: 1.0,
      beforeSend: async (event, hint) => {
        hint.attachments = []

        try {
          // This will fail if we are not running in Bee Desktop, but that is alright
          hint.attachments.push({ filename: 'bee-desktop.log', data: await getBeeDesktopLogs() })
          // eslint-disable-next-line no-empty
        } catch (e) {}

        try {
          // This will fail if we are not running in Bee Desktop, but that is alright
          hint.attachments.push({ filename: 'bee.log', data: await getBeeLogs() })
          // eslint-disable-next-line no-empty
        } catch (e) {}

        return event
      },
    })
    // eslint-disable-next-line no-console
  })().catch(e => console.error(`Sentry init error `, e))
}

const App = ({ beeApiUrl, beeDebugApiUrl, lockedApiSettings }: Props): ReactElement => {
  const mainApp = (
    <div className="App">
      <ThemeProvider theme={theme}>
        <SettingsProvider beeApiUrl={beeApiUrl} beeDebugApiUrl={beeDebugApiUrl} lockedApiSettings={lockedApiSettings}>
          <TopUpProvider>
            <BeeProvider>
              <StampsProvider>
                <FileProvider>
                  <FeedsProvider>
                    <PlatformProvider>
                      <SnackbarProvider>
                        <Router>
                          <>
                            <CssBaseline />
                            <Dashboard>
                              <BaseRouter />
                            </Dashboard>
                          </>
                        </Router>
                      </SnackbarProvider>
                    </PlatformProvider>
                  </FeedsProvider>
                </FileProvider>
              </StampsProvider>
            </BeeProvider>
          </TopUpProvider>
        </SettingsProvider>
      </ThemeProvider>
    </div>
  )

  // Displays Report Dialog when some component crashes
  if (config.SENTRY_KEY) {
    return (
      <Sentry.ErrorBoundary
        showDialog
        fallback={({ error, componentStack, resetError }) => <ItsBroken message={error.message} />}
      >
        {mainApp}
      </Sentry.ErrorBoundary>
    )
  }

  return mainApp
}

export default App
