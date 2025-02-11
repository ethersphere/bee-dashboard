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

const FileDescriptionIcon = ({ color }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.27778 16.8L12 20L14.7222 16.8H17.4444C18.3023 16.8 19 16.0824 19 15.2V5.6C19 4.7176 18.3023 4 17.4444 4H6.55556C5.69767 4 5 4.7176 5 5.6V15.2C5 16.0824 5.69767 16.8 6.55556 16.8H9.27778ZM8.11111 8H15.8889V9.6H8.11111V8ZM8.11111 11.2H13.5556V12.8H8.11111V11.2Z"
          fill={color ? color : '#333333'}
        />
      </svg>
    </div>
  )
}

export default FileDescriptionIcon
