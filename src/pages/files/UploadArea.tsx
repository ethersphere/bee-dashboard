import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import PlusCircle from 'remixicon-react/AddCircleLineIcon'
import FilePlus from 'remixicon-react/FileAddLineIcon'
import FolderPlus from 'remixicon-react/FolderAddLineIcon'
import { useNavigate } from 'react-router-dom'
import { DocumentationText } from '../../components/DocumentationText'
import { SwarmButton } from '../../components/SwarmButton'
import { Context, UploadOrigin } from '../../providers/File'
import { ROUTES } from '../../routes'
import { detectIndexHtml } from '../../utils/file'

interface Props {
  uploadOrigin: UploadOrigin
  showHelp: boolean
}

const MAX_FILE_SIZE = 1_000_000_000 // 1 gigabyte

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    areaWrapper: { position: 'relative', marginBottom: theme.spacing(2) },
    dropzone: {
      background: theme.palette.background.default,
      outline: 'none',
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

export function UploadArea({ uploadOrigin, showHelp }: Props): ReactElement {
  const { setFiles, setUploadOrigin } = useContext(Context)
  const classes = useStyles()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [strictWebsiteMode, setStrictWebsiteMode] = useState(false)
  const [version, setVersion] = useState(0)

  const getDropzoneInputDomElement = () => document.querySelector('.MuiDropzoneArea-root input') as HTMLInputElement

  const onUploadCollectionClick = () => {
    const element = getDropzoneInputDomElement()

    if (element) {
      element.setAttribute('directory', '')
      element.setAttribute('webkitdirectory', '')
      element.setAttribute('mozdirectory', '')
      element.click()
    }
  }

  const onUploadWebsiteClick = () => {
    onUploadCollectionClick()
    setStrictWebsiteMode(true)
  }

  const onUploadFolderClick = () => {
    onUploadCollectionClick()
    setStrictWebsiteMode(false)
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

  const resetComponentOnAddingInvalidContent = () => {
    setTimeout(() => {
      setVersion(x => x + 1)
      setFiles([])
    }, 0)
  }

  const handleChange = (files?: File[]) => {
    if (files) {
      const FilePaths = files as FilePath[]
      const indexDocument = files.length === 1 ? files[0].name : detectIndexHtml(FilePaths) || undefined

      if (files.length && strictWebsiteMode && !indexDocument) {
        enqueueSnackbar('To upload a website, there must be an index.html or index.htm in the root of the folder.', {
          variant: 'error',
        })
        resetComponentOnAddingInvalidContent()

        return
      }

      setFiles(FilePaths)

      if (files.length) {
        setUploadOrigin(uploadOrigin)
        navigate(ROUTES.UPLOAD_IN_PROGRESS)
      }
    }
  }

  return (
    <>
      <div className={classes.areaWrapper}>
        <DropzoneArea
          key={version}
          dropzoneClass={classes.dropzone}
          onChange={handleChange}
          filesLimit={1e9}
          maxFileSize={MAX_FILE_SIZE}
          showPreviews={false}
        />
        <div className={classes.buttonWrapper}>
          <SwarmButton className={classes.button} onClick={onUploadFileClick} iconType={FilePlus}>
            Add File
          </SwarmButton>
          <SwarmButton className={classes.button} onClick={onUploadFolderClick} iconType={FolderPlus}>
            Add Folder
          </SwarmButton>
          <SwarmButton className={classes.button} onClick={onUploadWebsiteClick} iconType={PlusCircle}>
            Add Website
          </SwarmButton>
        </div>
      </div>
      {showHelp && (
        <DocumentationText>
          You can click the buttons above or simply drag and drop to add a file or folder. To upload a website to Swarm,
          make sure that your folder contains an “index.html” file.
        </DocumentationText>
      )}
    </>
  )
}
