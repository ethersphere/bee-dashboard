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

const EditIcon = ({ color }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.4264 6L16 8.57363L14.038 10.5365L11.4644 7.96283L13.4264 6ZM4 18H6.57363L12.825 11.7486L10.2514 9.17501L4 15.4264V18Z"
          fill={color ? color : 'white'}
        />
        <path d="M11 16H19V18H9L11 16Z" fill={color ? color : 'white'} />
      </svg>
    </div>
  )
}

export default EditIcon
