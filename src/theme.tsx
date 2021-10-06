import { createMuiTheme, Theme } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    appBar: string
  }
}

// Overwriting default components styles
const componentsOverrides = (theme: Theme) => ({
  MuiContainer: {
    root: { padding: theme.spacing(8) },
    maxWidthXs: { padding: theme.spacing(8) },
    maxWidthSm: { padding: theme.spacing(8) },
    maxWidthMd: { padding: theme.spacing(8) },
    maxWidthLg: { padding: theme.spacing(8) },
    maxWidthXl: { padding: theme.spacing(8) },
  },
  MuiButton: {
    label: { margin: theme.spacing(2) },
    startIcon: { marginLeft: theme.spacing(1) },
    endIcon: { marginRight: theme.spacing(1) },
    containedSizeLarge: {
      padding: 0,
      borderRadius: 0,
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        boxShadow: 'none',
        // https://github.com/mui-org/material-ui/issues/22543
        '@media (hover: none)': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          boxShadow: 'none',
        },
      },
    },
    contained: {
      backgroundColor: 'white',
      boxShadow: 'none',
      padding: 0,
      borderRadius: 0,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        boxShadow: 'none',
        // https://github.com/mui-org/material-ui/issues/22543
        '@media (hover: none)': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          boxShadow: 'none',
        },
      },
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
      '&:active': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
      '&:disabled': {
        backgroundColor: 'white',
      },
    },
  },
  MuiTab: {
    root: {
      backgroundColor: 'transparent',
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: theme.palette.secondary,
        opacity: 1,
      },
      '&$selected': {
        color: theme.palette.secondary,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: theme.palette.secondary,
      },
    },
  },
  MuiTabs: {
    root: {
      borderBottom: 'none',
    },
    indicator: {
      backgroundColor: theme.palette.primary.main,
    },
  },
})

const propsOverrides = {
  MuiTab: {
    disableRipple: true,
  },
  MuiButtonBase: {
    disableRipple: true,
  },
}

export const theme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: '#efefef',
    },
    primary: {
      light: '#fcf2e8',
      main: '#dd7700',
      dark: orange[800],
    },
    secondary: {
      main: '#333333',
    },
  },
  typography: {
    fontFamily: ['Work Sans', 'Montserrat', 'Nunito', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: '1.3rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
    body2: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
})

theme.overrides = componentsOverrides(theme)
theme.props = propsOverrides
