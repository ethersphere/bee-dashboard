import { ReactElement } from 'react'
import FilesHandler from '../../components/FilesHandler/FilesHandler'
import FileList from '../../components/FileList/FileList'

export default function FM(): ReactElement {
  return (
    <div>
      <FilesHandler />
      <FileList />
    </div>
  )
}
