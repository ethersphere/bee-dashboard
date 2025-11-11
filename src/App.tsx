import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import { ReactElement } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import './App.css'
import Dashboard from './layout/Dashboard'
import { Provider as BeeProvider } from './providers/Bee'
import { Provider as FeedsProvider } from './providers/Feeds'
import { Provider as FileProvider } from './providers/File'
import { Provider as FileManagerProvider } from './providers/FileManager'
import { Provider as PlatformProvider } from './providers/Platform'
import { Provider as SettingsProvider } from './providers/Settings'
import { Provider as StampsProvider } from './providers/Stamps'
import { Provider as TopUpProvider } from './providers/TopUp'
import BaseRouter from './routes'
import { theme } from './theme'

interface Props {
  beeApiUrl?: string
  defaultRpcUrl?: string
  lockedApiSettings?: boolean
  isDesktop?: boolean
  desktopUrl?: string
  errorReporting?: (err: Error) => void
}

const App = ({
  beeApiUrl,
  defaultRpcUrl,
  lockedApiSettings,
  isDesktop,
  desktopUrl,
  errorReporting,
}: Props): ReactElement => {
  const mainApp = (
    <div className="App">
      <ThemeProvider theme={theme}>
        <SettingsProvider
          beeApiUrl={beeApiUrl}
          defaultRpcUrl={defaultRpcUrl}
          lockedApiSettings={lockedApiSettings}
          isDesktop={isDesktop}
          desktopUrl={desktopUrl}
        >
          <TopUpProvider>
            <BeeProvider>
              <StampsProvider>
                <FileProvider>
                  <FileManagerProvider>
                    <FeedsProvider>
                      <PlatformProvider>
                        <SnackbarProvider preventDuplicate anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                          <Router>
                            <>
                              <CssBaseline />
                              <Dashboard errorReporting={errorReporting}>
                                <BaseRouter />
                              </Dashboard>
                            </>
                          </Router>
                        </SnackbarProvider>
                      </PlatformProvider>
                    </FeedsProvider>
                  </FileManagerProvider>
                </FileProvider>
              </StampsProvider>
            </BeeProvider>
          </TopUpProvider>
        </SettingsProvider>
      </ThemeProvider>
    </div>
  )

  return mainApp
}

export default App
