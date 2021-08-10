import { ReactElement, useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'

import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider } from 'notistack'

import BaseRouter from './routes/routes'
import { lightTheme, darkTheme } from './theme'
import { Provider as StampsProvider } from './providers/Stamps'
import { Provider as PlatfomrProvider } from './providers/Platform'

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
        <StampsProvider>
          <PlatfomrProvider>
            <SnackbarProvider>
              <>
                <CssBaseline />
                <Router>
                  <BaseRouter />
                </Router>
              </>
            </SnackbarProvider>
          </PlatfomrProvider>
        </StampsProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
