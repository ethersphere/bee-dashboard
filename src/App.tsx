import { ReactElement, useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'

import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider } from 'notistack'

import BaseRouter from './routes/routes'
import { lightTheme, darkTheme } from './theme'
import { Provider as StampsProvider } from './providers/Stamps'
import { Provider as PlatformProvider } from './providers/Platform'
import { Provider as BeeProvider } from './providers/Bee'

const App = (): ReactElement => {
  const [themeMode, toggleThemeMode] = useState('light')

  useEffect(() => {
    const theme = localStorage.getItem('theme')

    if (theme) {
      toggleThemeMode(String(localStorage.getItem('theme')))
    } else if (window?.matchMedia('(prefers-color-scheme: dark)')?.matches) {
      toggleThemeMode('dark')
    }

    window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', e => {
      toggleThemeMode(e?.matches ? 'dark' : 'light')
    })

    return () =>
      window?.matchMedia('(prefers-color-scheme: dark)')?.removeEventListener('change', e => {
        toggleThemeMode(e?.matches ? 'dark' : 'light')
      })
  }, [])

  return (
    <div className="App">
      <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        <BeeProvider>
          <StampsProvider>
            <PlatformProvider>
              <SnackbarProvider>
                <>
                  <CssBaseline />
                  <Router>
                    <BaseRouter />
                  </Router>
                </>
              </SnackbarProvider>
            </PlatformProvider>
          </StampsProvider>
        </BeeProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
