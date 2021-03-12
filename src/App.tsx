import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import BaseRouter from './routes/routes';


declare global {
  interface Window {
      ethereum: {};
      web3: {};
  }
}

const lightTheme = createMuiTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: '#0d1117', //'#111827',
      paper: '#161b22', //'#1f2937',
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#5e72e4' //'#3f51b5',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#1f2937',
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});


function App() {
  const [themeMode, toggleThemeMode] = useState('light');

  useEffect(() => {
    let theme = localStorage.getItem('theme')

    if (theme) {
      toggleThemeMode(String(localStorage.getItem('theme')))
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      toggleThemeMode('dark')
    }

    const changeHandle = (e: any) => toggleThemeMode(e.matches ? "dark" : "light")

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeHandle);

    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', changeHandle)
  
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
