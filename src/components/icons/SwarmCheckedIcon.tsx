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

const SwarmCheckedIcon = (props: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.99996 2.23723L3.99996 0L-4.17233e-05 2.23723V6.7117L3.99996 8.94893L7.99996 6.7117V2.23723ZM2 4.72611L3.33333 6L6 3.45223L5.53 3L3.33333 5.09873L2.47 4.27389L2 4.72611Z"
          fill={props.color}
        />
      </svg>
    </div>
  )
}

export default SwarmCheckedIcon
