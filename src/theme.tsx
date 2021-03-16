import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    appBar: string
  }
}

export const lightTheme = createMuiTheme({
    palette: {
        type: "light",
        background: {
            default: '#f3f4f6',
        }
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
  
export const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      background: {
        default: '#0d1117', //'#111827',
        paper: '#161b22', //'#1f2937',
        appBar: '#3c40c6',
      },
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#5e72e4' //'#3f51b5',
        // dark: will be calculated from palette.primary.main,
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