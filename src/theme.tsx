import { createMuiTheme, Theme } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    appBar: string
  }
}

// Overwriting default components styles
const componentsOverrides = (theme: Theme) => ({
  MuiDrawer: {
    paper: {
      width: 300,
      backgroundColor: '#212121',
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
  MuiListItem: {
    root: {
      borderLeft: '4px solid rgba(0,0,0,0)',
      '&$selected, &$selected:hover': {
        borderLeft: '4px solid #dd7700',
        backgroundColor: '#2c2c2c',
        color: '#f9f9f9',
      },
    },
    button: {
      paddingLeft: 32,
      paddingRight: 32,
      '&:hover': {
        backgroundColor: '#2c2c2c',
        color: '#f9f9f9',

        // https://github.com/mui-org/material-ui/issues/22543
        '@media (hover: none)': {
          backgroundColor: '#2c2c2c',
          color: '#f9f9f9',
        },
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
}

export const theme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: '#fafafa',
    },
    primary: {
      light: orange.A200,
      main: '#dd7700',
      dark: orange[800],
    },
    secondary: {
      main: '#333333',
    },
  },
  typography: {
    fontFamily: ['Work Sans', 'Montserrat', 'Nunito', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
})

theme.overrides = componentsOverrides(theme)
theme.props = propsOverrides
