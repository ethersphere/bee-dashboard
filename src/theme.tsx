import { createMuiTheme } from '@material-ui/core/styles'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    appBar: string
  }
}

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: '#fafafa',
    },
    primary: {
      main: '#6a6a6a',
    },
    secondary: {
      main: '#333333',
    },
  },
  typography: {
    fontFamily: ['Work Sans', 'Montserrat', 'Nunito', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
})

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    primary: {
      main: '#dd7700',
    },
    secondary: {
      main: '#1f2937',
    },
  },
  typography: {
    fontFamily: ['Work Sans', 'Montserrat', 'Nunito', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
})
