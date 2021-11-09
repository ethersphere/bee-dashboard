import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import React, { ReactElement } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import Dashboard from './layout/Dashboard'
import { Provider as BeeProvider } from './providers/Bee'
import { Provider as FileProvider } from './providers/File'
import { Provider as PlatformProvider } from './providers/Platform'
import { Provider as SettingsProvider } from './providers/Settings'
import { Provider as StampsProvider } from './providers/Stamps'
import BaseRouter from './routes'
import { theme } from './theme'

interface Props {
  beeUrl?: string
}

const App = ({ beeUrl }: Props): ReactElement => (
  <div className="App">
    <ThemeProvider theme={theme}>
      <SettingsProvider beeApiUrl={beeUrl}>
        <BeeProvider>
          <StampsProvider>
            <FileProvider>
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
            </FileProvider>
          </StampsProvider>
        </BeeProvider>
      </SettingsProvider>
    </ThemeProvider>
  </div>
)

export default App
