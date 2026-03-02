import { orange } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypeBackground {
    appBar: string
  }
  interface PaletteOptions {
    mode?: 'light' | 'dark'
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
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
  components: {
    MuiContainer: {
      styleOverrides: {
        root: { padding: '64px' },
        maxWidthXs: { padding: '64px' },
        maxWidthSm: { padding: '64px' },
        maxWidthMd: { padding: '64px' },
        maxWidthLg: { padding: '64px' },
        maxWidthXl: { padding: '64px' },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        startIcon: { marginLeft: '8px' },
        endIcon: { marginRight: '8px' },
        outlined: {
          border: 'none',
          borderRadius: '80px',
          color: '#dd7700',
          backgroundColor: '#fcf2e8',
        },
        outlinedSizeSmall: {
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#dd7700',
            color: 'white',
            boxShadow: 'none',
            '@media (hover: none)': {
              backgroundColor: '#dd7700',
              color: 'white',
              boxShadow: 'none',
            },
          },
        },
        outlinedSizeLarge: {
          padding: '32px',
          borderRadius: 0,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#dd7700',
            color: 'white',
            boxShadow: 'none',
            '@media (hover: none)': {
              backgroundColor: '#dd7700',
              color: 'white',
              boxShadow: 'none',
            },
          },
        },
        containedSizeLarge: {
          padding: '32px',
          borderRadius: 0,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#dd7700',
            color: 'white',
            boxShadow: 'none',
            '@media (hover: none)': {
              backgroundColor: '#dd7700',
              color: 'white',
              boxShadow: 'none',
            },
          },
        },
        containedSizeSmall: {
          padding: '8px 16px',
          borderRadius: 0,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#dd7700',
            color: 'white',
            boxShadow: 'none',
            '@media (hover: none)': {
              backgroundColor: '#dd7700',
              color: 'white',
              boxShadow: 'none',
            },
          },
        },
        contained: {
          padding: '16px',
          backgroundColor: 'white',
          boxShadow: 'none',
          borderRadius: 0,
          '&:hover': {
            backgroundColor: '#dd7700',
            color: 'white',
            boxShadow: 'none',
            '@media (hover: none)': {
              backgroundColor: '#dd7700',
              color: 'white',
              boxShadow: 'none',
            },
          },
          '&:focus': {
            backgroundColor: '#dd7700',
            color: 'white',
          },
          '&:active': {
            backgroundColor: '#dd7700',
            color: 'white',
          },
          '&:disabled': {
            backgroundColor: 'white',
          },
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#fcf2e8',
            color: '#dd7700',
            opacity: 1,
          },
          '&.Mui-selected': {
            fontWeight: 500,
          },
        },
        textColorInherit: {
          opacity: 0.5,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
        },
        indicator: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-valueLabel': {
            top: '-27px',
            '& span': {
              height: '20px',
              borderRadius: '0px',
              transform: 'none',
              '& span': {
                display: 'flex',
                alignItems: 'center',
                transform: 'none',
              },
            },
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
})
