import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      height: '16px',
    },
  }),
)

interface Props {
  color?: string
}

const OrderIcon = ({ color }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 3H6C4.9 3 4 3.9 4 5V11H6V9H8V11H10V5C10 4.46957 9.78929 3.96086 9.41421 3.58579C9.03914 3.21071 8.53043 3 8 3ZM8 7H6V5H8M10 13V15L6.67 19H10V21H4V19L7.33 15H4V13"
          fill={color ? color : '#333333'}
        />
        <path
          d="M17.157 3.37659C16.9125 3.13547 16.581 3 16.2353 3C15.8896 3 15.5581 3.13547 15.3136 3.37659C15.0692 3.61772 14.9319 3.94477 14.9319 4.28577V15.8577H12.9767C12.7835 15.8579 12.5947 15.9146 12.4341 16.0205C12.2735 16.1265 12.1483 16.2771 12.0744 16.4532C12.0004 16.6293 11.9811 16.823 12.0187 17.01C12.0564 17.1969 12.1494 17.3687 12.2859 17.5035L15.5445 20.718C15.7278 20.8986 15.9762 21 16.2353 21C16.4944 21 16.7428 20.8986 16.9261 20.718L20.1847 17.5035C20.3212 17.3687 20.4142 17.1969 20.4519 17.01C20.4895 16.823 20.4701 16.6293 20.3962 16.4532C20.3223 16.2771 20.1971 16.1265 20.0365 16.0205C19.8759 15.9146 19.6871 15.8579 19.4939 15.8577H17.5387V4.28577C17.5387 3.94477 17.4014 3.61772 17.157 3.37659Z"
          fill={color ? color : '#333333'}
        />
      </svg>
    </div>
  )
}

export default OrderIcon
