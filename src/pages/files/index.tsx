import { ReactElement, useState } from 'react'
import { beeApi } from '../../services/bee'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Paper, InputBase, IconButton, Button, Container, CircularProgress, FormHelperText } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { DropzoneArea } from 'material-ui-dropzone'
import ClipboardCopy from '../../components/ClipboardCopy'

import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { useApiHealth, useDebugApiHealth } from '../../hooks/apiHooks'
import { apiHost } from '../../constants'
import { Utils } from '@ethersphere/bee-js'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
)

export default function Files(): ReactElement {
  const classes = useStyles()

  const [inputMode, setInputMode] = useState<'download' | 'upload'>('download')
  const [referenceInput, setReferenceInput] = useState('')
  const [referenceError, setReferenceError] = useState<Error | null>(null)
  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  const [file, setFile] = useState<File | null>(null)
  const [uploadReference, setUploadReference] = useState('')
  const [uploadError, setUploadError] = useState<Error | null>(null)
  const [isUploadingFile, setIsUploadingFile] = useState(false)

  const uploadFile = () => {
    if (file === null) return
    setIsUploadingFile(true)
    setUploadError(null)
    beeApi.files
      .uploadFile(file)
      .then(hash => {
        setUploadReference(hash)
        setFile(null)
      })
      .catch(setUploadError)
      .finally(() => {
        setIsUploadingFile(false)
      })
  }

  const handleChange = (files?: File[]) => {
    if (files) {
      setFile(files[0])
      setUploadReference('')
    }
  }

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReferenceInput(e.target.value)

    if (Utils.Hex.isHexString(e.target.value, 64)) setReferenceError(null)
    else setReferenceError(new Error('Incorrect format of swarm hash'))
  }

  if (isLoadingHealth || isLoadingNodeHealth) {
    return (
      <Container style={{ textAlign: 'center', padding: '50px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!health || nodeHealth?.status !== 'ok') return <TroubleshootConnectionCard />

  return (
    <Container maxWidth="sm">
      <div style={{ marginBottom: '7px' }}>
        <Button color="primary" style={{ marginRight: '7px' }} onClick={() => setInputMode('download')}>
          Download
        </Button>
        <Button color="primary" onClick={() => setInputMode('upload')}>
          Upload
        </Button>
      </div>
      {inputMode === 'download' && (
        <>
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Enter swarm reference e.g. 0773a91efd6547c754fc1d95fb1c62c7d1b47f959c2caa685dfec8736da95c1c"
              inputProps={{ 'aria-label': 'retriefe file from swarm' }}
              value={referenceInput}
              onChange={handleReferenceChange}
            />
            <IconButton
              href={`${apiHost}/files/${referenceInput}`}
              target="_blank"
              disabled={referenceError !== null || !referenceInput}
              className={classes.iconButton}
              aria-label="download"
            >
              <Search />
            </IconButton>
          </Paper>
          {referenceError && <FormHelperText error>{referenceError.message}</FormHelperText>}
        </>
      )}
      {inputMode === 'upload' && (
        <div>
          <div>
            <DropzoneArea onChange={handleChange} filesLimit={1} />
            <div style={{ marginTop: '15px' }}>
              <Button disabled={!file && isUploadingFile} onClick={() => uploadFile()} className={classes.iconButton}>
                Upload
              </Button>
              {isUploadingFile && (
                <Container style={{ textAlign: 'center', padding: '50px' }}>
                  <CircularProgress />
                </Container>
              )}
              {uploadReference && (
                <div style={{ marginBottom: '15px', display: 'flex' }}>
                  <span>{uploadReference}</span>
                  <ClipboardCopy value={uploadReference} />
                </div>
              )}
              {uploadError && <FormHelperText error>{uploadError.message}</FormHelperText>}
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
