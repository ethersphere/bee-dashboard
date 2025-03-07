import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
    },
  }),
)

interface Props {
  color?: string
}

const OverMinRangeIcon = ({ color }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <svg width="7" height="16" viewBox="0 0 7 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 15.9583L0.0722656 16L7.00047 12V4L0.0722656 0L0 0.0417226L0 15.9583Z"
          fill={color ? color : '#DE7700'}
        />
      </svg>
    </div>
  )
}

export default OverMinRangeIcon
