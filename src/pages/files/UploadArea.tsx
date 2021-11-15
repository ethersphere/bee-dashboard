import { Button, Typography } from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import { ReactElement } from 'react'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'

interface Props {
  setFiles: (files: File[]) => void
  maximumSizeInBytes: number
}

export function UploadArea(props: Props): ReactElement {
  const getDropzoneInputDomElement = () => document.querySelector('.MuiDropzoneArea-root input') as HTMLInputElement

  const onUploadFolderClick = () => {
    const element = getDropzoneInputDomElement()

    if (element) {
      element.setAttribute('directory', '')
      element.setAttribute('webkitdirectory', '')
      element.setAttribute('mozdirectory', '')
      element.click()
    }
  }

  const onUploadFileClick = () => {
    const element = getDropzoneInputDomElement()

    if (element) {
      element.removeAttribute('directory')
      element.removeAttribute('webkitdirectory')
      element.removeAttribute('mozdirectory')
      element.click()
    }
  }

  const handleChange = (files?: File[]) => {
    if (files) {
      props.setFiles(files)
    }
  }

  return (
    <>
      <DropzoneArea onChange={handleChange} filesLimit={1e9} maxFileSize={props.maximumSizeInBytes} />
      <ExpandableListItemActions>
        <Button variant="contained" onClick={() => onUploadFileClick()}>
          Upload File
        </Button>
        <Button variant="contained" onClick={() => onUploadFolderClick()}>
          Upload Folder
        </Button>
      </ExpandableListItemActions>
      <Typography variant="body2">
        You can click the buttons above or simply drag and drop to add a file or folder. To upload a website to Swarm,
        make sure that your folder contains an “index.html” file.
      </Typography>
    </>
  )
}
