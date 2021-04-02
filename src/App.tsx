import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import BaseRouter from './routes/routes';
import AppThemeProvider from './providers/Theme'

function App() {
  return (
    <div className="App">
      <AppThemeProvider.Provider>
        <AppThemeProvider.Consumer>
          {({theme}) => (
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Router>
                <BaseRouter />
              </Router>
            </ThemeProvider>
            )
          }
        </AppThemeProvider.Consumer>
      </AppThemeProvider.Provider>
    </div>
  );
}

export default App;
