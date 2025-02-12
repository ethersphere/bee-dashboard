import { createStyles, makeStyles } from '@material-ui/core'

import type { ReactElement } from 'react'
import FileUpload from './FileUpload/FileUpload'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      paddingTop: '10px',
      paddingBottom: '10px',
      height: '65px',
      boxSizing: 'border-box',
      fontSize: '12px',
      display: 'flex',
      gap: '10px',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    flex: {
      display: 'flex',
      height: '100%',
    },
  }),
)

const FilesHandler = (): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.flex}></div>
      <div className={classes.flex}>
        <FileUpload />
      </div>
    </div>
  )
}

export default FilesHandler
