import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import React, { ReactElement } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import './App.css'
import Dashboard from './layout/Dashboard'
import { Provider as BeeProvider } from './providers/Bee'
import { Provider as FeedsProvider } from './providers/Feeds'
import { Provider as FileProvider } from './providers/File'
import { Provider as PlatformProvider } from './providers/Platform'
import { Provider as SettingsProvider } from './providers/Settings'
import { Provider as StampsProvider } from './providers/Stamps'
import { Provider as TopUpProvider } from './providers/TopUp'
import { Provider as BalanceProvider } from './providers/WalletBalance'
import BaseRouter from './routes'
import { theme } from './theme'
import { config } from './config'
import ItsBroken from './layout/ItsBroken'
import { initSentry } from './utils/sentry'

interface Props {
  beeApiUrl?: string
  beeDebugApiUrl?: string
  lockedApiSettings?: boolean
  isBeeDesktop?: boolean
}

if (config.SENTRY_KEY) {
  // eslint-disable-next-line no-console
  initSentry().catch(e => console.error(e))
}

const App = ({ beeApiUrl, beeDebugApiUrl, lockedApiSettings, isBeeDesktop }: Props): ReactElement => {
  const mainApp = (
    <div className="App">
      <ThemeProvider theme={theme}>
        <SettingsProvider
          beeApiUrl={beeApiUrl}
          beeDebugApiUrl={beeDebugApiUrl}
          lockedApiSettings={lockedApiSettings}
          isBeeDesktop={isBeeDesktop}
        >
          <TopUpProvider>
            <BeeProvider>
              <BalanceProvider>
                <StampsProvider>
                  <FileProvider>
                    <FeedsProvider>
                      <PlatformProvider>
                        <SnackbarProvider preventDuplicate anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
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
              </BalanceProvider>
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
