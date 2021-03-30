import React, { useEffect, useState, createContext } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import './App.css';

import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import BaseRouter from './routes/routes';

import { lightTheme, darkTheme } from './theme';

declare global {
  interface Window {
      ethereum: any;
      web3: any;
  }
}


function App() {
  const [themeMode, toggleThemeMode] = useState('light');

  const ThemeContext = createContext(themeMode);

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
        <ThemeContext.Provider value={themeMode}>
          <CssBaseline />
          <Router>
            <BaseRouter />
          </Router>
        </ThemeContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
