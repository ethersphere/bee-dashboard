import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import { useSnackbar } from 'notistack'
import { ReactElement } from 'react'
import { FilePlus, Globe } from 'react-feather'
import { SwarmButton } from '../../components/SwarmButton'
import { detectIndexHtml } from '../../utils/file'
import { SwarmFile } from '../../utils/SwarmFile'

interface Props {
  setFiles: (files: SwarmFile[]) => void
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

export function UploadArea({ setFiles, maximumSizeInBytes }: Props): ReactElement {
  const classes = useStyles()

  const { enqueueSnackbar } = useSnackbar()

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

  const resetComponentOnAddingInvalidContent = (files: SwarmFile[]) => {
    setFiles(files)
    setTimeout(() => {
      setFiles([])
    }, 0)
  }

  const handleChange = (files?: File[]) => {
    if (files) {
      const swarmFiles = files.map(x => new SwarmFile(x))
      const indexDocument = files.length === 1 ? files[0].name : detectIndexHtml(swarmFiles) || undefined

      if (files.length && !indexDocument) {
        enqueueSnackbar('To upload a website, there must be an index.html or index.htm in the root of the folder.', {
          variant: 'error',
        })
        resetComponentOnAddingInvalidContent(swarmFiles)

        return
      }

      setFiles(swarmFiles)
    }
  }

  return (
    <>
      <div className={classes.areaWrapper}>
        <DropzoneArea
          dropzoneClass={classes.dropzone}
          onChange={handleChange}
          filesLimit={1e9}
          maxFileSize={maximumSizeInBytes}
          showPreviews={false}
        />
        <div className={classes.buttonWrapper}>
          <SwarmButton className={classes.button} onClick={onUploadFileClick} iconType={FilePlus}>
            Add File
          </SwarmButton>
          <SwarmButton className={classes.button} onClick={onUploadFolderClick} iconType={Globe}>
            Add Website
          </SwarmButton>
        </div>
      </div>
      <Typography>
        You can click the buttons above or simply drag and drop to add a file or folder. To upload a website to Swarm,
        make sure that your folder contains an “index.html” file.
      </Typography>
    </>
  )
}
