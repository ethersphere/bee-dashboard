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

const GroupingIcon = ({ color }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 0C1.44772 0 1 0.447715 1 1V3C1 3.55228 1.44772 4 2 4H14C14.5523 4 15 3.55228 15 3V1C15 0.447715 14.5523 0 14 0H2ZM4 1H2V3H4V1Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 5C1.44772 5 1 5.44772 1 6V8C1 8.55228 1.44772 9 2 9H14C14.5523 9 15 8.55228 15 8V6C15 5.44772 14.5523 5 14 5H2ZM4 6H2V8H4V6Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 10C1.44772 10 1 10.4477 1 11V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V11C15 10.4477 14.5523 10 14 10H2ZM4 11H2V13H4V11Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

export default GroupingIcon
