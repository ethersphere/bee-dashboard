import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import EditIcon from './icons/EditIcon'

const useStyles = makeStyles(() =>
  createStyles({
    editContainer: {
      position: 'relative',
      backgroundColor: '#333333',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '48px',
      height: '24px',
      clipPath: 'polygon(0% calc(0% + 6px), calc(0% + 6px) 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
  }),
)

interface Props {
  isError?: boolean
  isFocused?: boolean
}

const FileItemEdit = (props: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.editContainer}>
      <EditIcon />
    </div>
  )
}

export default FileItemEdit
