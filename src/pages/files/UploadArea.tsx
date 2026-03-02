import { BeeModes } from '@ethersphere/bee-js'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import PlusCircle from 'remixicon-react/AddCircleLineIcon'
import FilePlus from 'remixicon-react/FileAddLineIcon'
import FolderPlus from 'remixicon-react/FolderAddLineIcon'
import { makeStyles } from 'tss-react/mui'

import { DocumentationText } from '../../components/DocumentationText'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as BeeContext } from '../../providers/Bee'
import { Context, UploadOrigin } from '../../providers/File'
import { ROUTES } from '../../routes'
import { detectIndexHtml } from '../../utils/file'

interface Props {
  uploadOrigin: UploadOrigin
  showHelp: boolean
}

const MAX_FILE_SIZE = 1_000_000_000 // 1 GB

const useStyles = makeStyles()(theme => ({
  areaWrapper: { position: 'relative', marginBottom: theme.spacing(2) },
  dropzone: {
    background: theme.palette.background.default,
    outline: 'none',
    border: '2px dashed #ccc',
    borderRadius: 4,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  buttonWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  button: {
    zIndex: 2,
  },
}))

export function UploadArea({ uploadOrigin, showHelp }: Props): ReactElement {
  const { setFiles, setUploadOrigin } = useContext(Context)
  const { nodeInfo } = useContext(BeeContext)
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [strictWebsiteMode, setStrictWebsiteMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onDrop = (acceptedFiles: File[]) => {
    handleChange(acceptedFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    noClick: true,
  })

  const onUploadCollectionClick = () => {
    if (inputRef.current) {
      inputRef.current.setAttribute('directory', '')
      inputRef.current.setAttribute('webkitdirectory', '')
      inputRef.current.setAttribute('mozdirectory', '')
      inputRef.current.click()
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
    if (inputRef.current) {
      inputRef.current.removeAttribute('directory')
      inputRef.current.removeAttribute('webkitdirectory')
      inputRef.current.removeAttribute('mozdirectory')
      inputRef.current.click()
    }
  }

  const handleChange = (files?: File[]) => {
    if (files) {
      const FilePaths = files as FilePath[]
      const indexDocument = files.length === 1 ? files[0].name : detectIndexHtml(FilePaths) || undefined

      if (files.length && strictWebsiteMode && !indexDocument) {
        enqueueSnackbar('To upload a website, there must be an index.html or index.htm in the root of the folder.', {
          variant: 'error',
        })
        setFiles([])
        setStrictWebsiteMode(false)

        return
      }

      setFiles(FilePaths)

      if (files.length) {
        setUploadOrigin(uploadOrigin)
        navigate(ROUTES.UPLOAD_IN_PROGRESS)
      }
    }
  }

  const isUploadEnabled = nodeInfo?.beeMode !== BeeModes.ULTRA_LIGHT

  return (
    <>
      {isUploadEnabled && (
        <Box className={classes.areaWrapper}>
          <Box {...getRootProps()} className={classes.dropzone}>
            <input {...getInputProps()} ref={inputRef} />
            <Box className={classes.buttonWrapper}>
              <SwarmButton className={classes.button} onClick={onUploadFileClick} iconType={FilePlus}>
                Add File
              </SwarmButton>
              <SwarmButton className={classes.button} onClick={onUploadFolderClick} iconType={FolderPlus}>
                Add Folder
              </SwarmButton>
              <SwarmButton className={classes.button} onClick={onUploadWebsiteClick} iconType={PlusCircle}>
                Add Website
              </SwarmButton>
            </Box>
          </Box>
        </Box>
      )}
      {isUploadEnabled && showHelp && (
        <DocumentationText>
          You can click the buttons above or simply drag and drop to add a file or folder. To upload a website to Swarm,
          make sure that your folder contains an “index.html” file.
        </DocumentationText>
      )}
      {!isUploadEnabled && (
        <DocumentationText>
          Uploading files requires running a light node. Please{' '}
          <a
            href="https://docs.ethswarm.org/docs/desktop/configuration/#upgrading-from-an-ultra-light-to-a-light-node"
            target="_blank"
            rel="noreferrer"
          >
            upgrade
          </a>{' '}
          to continue.
        </DocumentationText>
      )}
    </>
  )
}
