import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import { ReactElement } from 'react'
import { FilePlus, FolderPlus } from 'react-feather'
import { SwarmButton } from '../../components/SwarmButton'

interface Props {
  setFiles: (files: File[]) => void
  maximumSizeInBytes: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    areaWrapper: { position: 'relative', marginBottom: theme.spacing(2) },
    dropzone: {
      background: theme.palette.background.default,
      color: 'transparent',
      zIndex: 1,
      '& svg': {
        opacity: 0,
      },
    },
    buttonWrapper: {
      top: '0',
      left: '0',
      position: 'absolute',
      display: 'flex',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
      zIndex: 2,
    },
  }),
)

export function UploadArea(props: Props): ReactElement {
  const classes = useStyles()

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
      <div className={classes.areaWrapper}>
        <DropzoneArea
          dropzoneClass={classes.dropzone}
          onChange={handleChange}
          filesLimit={1e9}
          maxFileSize={props.maximumSizeInBytes}
        />
        <div className={classes.buttonWrapper}>
          <SwarmButton className={classes.button} onClick={() => onUploadFileClick()} iconType={FilePlus}>
            Add File
          </SwarmButton>
          <SwarmButton className={classes.button} onClick={() => onUploadFolderClick()} iconType={FolderPlus}>
            Add Folder
          </SwarmButton>
        </div>
      </div>
      <Typography variant="body2">
        You can click the buttons above or simply drag and drop to add a file or folder. To upload a website to Swarm,
        make sure that your folder contains an “index.html” file.
      </Typography>
    </>
  )
}
