import { createStyles, Theme, withStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'

interface StyledTabProps {
  label: string
}

export default withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 72,
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
  }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />)
