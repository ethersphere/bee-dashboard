import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import BaseRouter from './routes/routes';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [themeMode, toggleThemeMode] = useState('light');

  useEffect(() => {
    let theme = localStorage.getItem('theme')

    if (theme) {
      toggleThemeMode(String(localStorage.getItem('theme')))
    } else if (window?.matchMedia('(prefers-color-scheme: dark)')?.matches) {
      toggleThemeMode('dark')
    }

    window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', e => {
      toggleThemeMode(e?.matches ? "dark" : "light")
    });

    return () => window?.matchMedia('(prefers-color-scheme: dark)')?.removeEventListener('change', e => {
      toggleThemeMode(e?.matches ? "dark" : "light")
    })

  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <Router>
          <BaseRouter />
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
