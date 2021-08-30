import { ReactElement } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'

import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider } from 'notistack'

import BaseRouter from './routes'
import Dashboard from './layout/Dashboard'
import { theme } from './theme'
import { Provider as StampsProvider } from './providers/Stamps'
import { Provider as PlatformProvider } from './providers/Platform'
import { Provider as BeeProvider } from './providers/Bee'
import { Provider as SettingsProvider } from './providers/Settings'

const App = (): ReactElement => (
  <div className="App">
    <ThemeProvider theme={theme}>
      <SettingsProvider>
        <BeeProvider>
          <StampsProvider>
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
          </StampsProvider>
        </BeeProvider>
      </SettingsProvider>
    </ThemeProvider>
  </div>
)

export default App
