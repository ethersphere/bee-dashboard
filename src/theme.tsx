import { orange } from '@material-ui/core/colors'
import { createTheme, Theme } from '@material-ui/core/styles'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    appBar: string
  }
}

// Overwriting default components styles
const componentsOverrides = (theme: Theme) => ({
  MuiListItem: {
    button: {
      '&:hover': {
        backgroundColor: '#fcf2e8',
        color: theme.palette.primary.main,
        // https://github.com/mui-org/material-ui/issues/22543
        '@media (hover: none)': {
          backgroundColor: '#fcf2e8',
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiContainer: {
    root: { padding: theme.spacing(8) },
    maxWidthXs: { padding: theme.spacing(8) },
    maxWidthSm: { padding: theme.spacing(8) },
    maxWidthMd: { padding: theme.spacing(8) },
    maxWidthLg: { padding: theme.spacing(8) },
    maxWidthXl: { padding: theme.spacing(8) },
  },
  MuiButton: {
    startIcon: { marginLeft: theme.spacing(1) },
    endIcon: { marginRight: theme.spacing(1) },
    outlined: {
      border: 'none',
      borderRadius: theme.spacing(10),
      color: theme.palette.primary.main,
      backgroundColor: '#fcf2e8',
    },
    outlinedSizeSmall: {
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
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
    outlinedSizeLarge: {
      padding: theme.spacing(4),
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
    containedSizeLarge: {
      padding: theme.spacing(4),
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
    containedSizeSmall: {
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
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
      padding: theme.spacing(2),
      backgroundColor: 'white',
      boxShadow: 'none',
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
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: '#fcf2e8',
        color: theme.palette.primary.main,
        opacity: 1,
      },
      '&$selected': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    textColorInherit: {
      opacity: 0.5,
    },
  },
  MuiTabs: {
    root: {
      borderBottom: 'none',
    },
    indicator: {
      backgroundColor: 'transparent',
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

export const theme = createTheme({
  palette: {
    type: 'light',
    background: {
      default: '#ededed',
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
    fontFamily: ['iAWriterQuattroV', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '0.9rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.85rem',
    },
    body2: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontWeight: 500,
      fontSize: '0.85rem',
    },
    button: {
      textTransform: 'none',
    },
  },
})

theme.overrides = componentsOverrides(theme)
theme.props = propsOverrides
