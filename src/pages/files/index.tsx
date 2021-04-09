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

  const [inputMode, setInputMode] = useState<'browse' | 'upload'>('browse')
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState<Error | null>(null)
  const { health, isLoadingHealth } = useApiHealth()
  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()

  const [file, setFile] = useState<File | null>(null)
  const [uploadReference, setUploadReference] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)

  const uploadFile = () => {
    if (file === null) return
    setUploadingFile(true)
    beeApi.files
      .uploadFile(file)
      .then(hash => {
        setUploadReference(hash)
        setFile(null)
      })
      .catch(() => {
        // FIXME: handle the error
      })
      .finally(() => {
        setUploadingFile(false)
      })
  }

  const handleChange = (files?: File[]) => {
    if (files) {
      setFile(files[0])
      setUploadReference('')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchInput(e.target.value)

    if (Utils.Hex.isHexString(e.target.value, 64)) setSearchError(null)
    else setSearchError(new Error('Incorrect format of swarm hash'))
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
        <Button color="primary" style={{ marginRight: '7px' }} onClick={() => setInputMode('browse')}>
          Browse
        </Button>
        <Button color="primary" onClick={() => setInputMode('upload')}>
          Upload
        </Button>
      </div>
      {inputMode === 'browse' && (
        <>
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Enter hash e.g. 0773a91efd6547c754fc1d95fb1c62c7d1b47f959c2caa685dfec8736da95c1c"
              inputProps={{ 'aria-label': 'search swarm nodes' }}
              value={searchInput}
              onChange={handleSearchChange}
            />
            <IconButton
              href={`${apiHost}/files/${searchInput}`}
              target="_blank"
              disabled={searchError !== null || !searchInput}
              className={classes.iconButton}
              aria-label="search"
            >
              <Search />
            </IconButton>
          </Paper>
          {searchError && <FormHelperText error>{searchError.message}</FormHelperText>}
        </>
      )}
      {inputMode === 'upload' && (
        <div>
          <div>
            <DropzoneArea onChange={handleChange} filesLimit={1} />
            <div style={{ marginTop: '15px' }}>
              <Button disabled={!file} onClick={() => uploadFile()} className={classes.iconButton}>
                Upload
              </Button>
              {uploadingFile && (
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
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
