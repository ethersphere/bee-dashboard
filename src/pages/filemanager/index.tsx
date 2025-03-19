import { ReactElement } from 'react'
import { createStyles, makeStyles } from '@material-ui/core'
import FilesHandler from '../../components/FilesHandler/FilesHandler'
import FileList from '../../components/FileList/FileList'

const useStyles = makeStyles(() => createStyles({}))
export default function FM(): ReactElement {
  return (
    <div>
      <FilesHandler />
      <FileList />
    </div>
  )
}
