import { Avatar, Button, Chip, CircularProgress, Container, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { DropzoneArea } from 'material-ui-dropzone'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { Check, RotateCcw } from 'react-feather'
import UploadSizeAlert from '../../components/AlertUploadSize'
import ClipboardCopy from '../../components/ClipboardCopy'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemNote from '../../components/ExpandableListItemNote'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context, EnrichedPostageBatch } from '../../providers/Stamps'
import { detectIndexHtml, NameWithPath } from '../../utils/file'
import CreatePostageStamp from '../stamps/CreatePostageStampModal'
import SelectStamp from './SelectStamp'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: { marginTop: theme.spacing(2) },
    loadingProgress: { textAlign: 'center', padding: '50px' },
  }),
)

const MAX_FILE_SIZE = 1_000_000_000 // 1 gigabyte

export default function Files(): ReactElement {
  const classes = useStyles()
  const [dropzoneKey, setDropzoneKey] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [uploadReference, setUploadReference] = useState('')
  const [isUploading, setUploading] = useState(false)

  const [selectedStamp, setSelectedStamp] = useState<EnrichedPostageBatch | null>(null)

  const { isLoading, error, stamps, refresh } = useContext(Context)
  const { beeApi } = useContext(SettingsContext)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    refresh()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Choose a postage stamp that has the lowest usage
  useEffect(() => {
    if (!selectedStamp && stamps && stamps.length > 0) {
      const stamp = stamps.reduce((prev, curr) => (curr.usage < prev.usage ? curr : prev), stamps[0])

      setSelectedStamp(stamp)
    }
  }, [isLoading, error, stamps, selectedStamp])

  const uploadFiles = () => {
    if (!files.length || !selectedStamp) return

    if (!beeApi) return

    const indexDocument = detectIndexHtml(files as unknown as NameWithPath[]) || undefined

    setUploading(true)
    beeApi
      .uploadFiles(selectedStamp.batchID, files, { indexDocument })
      .then(hash => setUploadReference(hash.reference))
      .catch(e => enqueueSnackbar(`Error uploading: ${e.message}`, { variant: 'error' }))
      .finally(() => setUploading(false))
  }

  const uploadNew = () => {
    setTimeout(() => {
      setFiles([])
      setDropzoneKey(dropzoneKey + 1)
      setUploadReference('')
    }, 0)
  }

  const handleChange = (files?: File[]) => {
    setUploadReference('')

    if (files) {
      setFiles(files)
    }
  }

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

  return (
    <>
      <DropzoneArea
        key={'dropzone-' + dropzoneKey}
        onChange={handleChange}
        filesLimit={1e9}
        maxFileSize={MAX_FILE_SIZE}
      />
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
      <div className={classes.content}>
        {/* We have file and can upload display stamp selection */}
        {files.length && !isUploading && !uploadReference && (
          <>
            <ExpandableListItemNote>
              To upload the files to your node, you need a postage stamp. You can buy a new one or you can use an
              existing stamp (providing it’s sufficient for the files).
            </ExpandableListItemNote>
            {selectedStamp && (
              <ExpandableListItem
                label={
                  <>
                    Upload with Postage Stamp{' '}
                    <Chip
                      avatar={<Avatar>{selectedStamp.usageText}</Avatar>}
                      label={<Typography variant="body2">{selectedStamp.batchID.substr(0, 8)}[…]</Typography>}
                      deleteIcon={<ClipboardCopy value={selectedStamp.batchID} />}
                      onDelete={() => {} /* eslint-disable-line*/}
                      variant="outlined"
                    />
                  </>
                }
                value={<SelectStamp stamps={stamps} selectedStamp={selectedStamp} setSelected={setSelectedStamp} />}
              />
            )}
            {!selectedStamp && (
              <ExpandableListItemActions>
                <CreatePostageStamp />
              </ExpandableListItemActions>
            )}
          </>
        )}

        {/* We have at least one file and can display upload button */}
        {files.length && !uploadReference && (
          <>
            <ExpandableListItemActions>
              <Button
                variant="contained"
                disabled={!files.length && isUploading && !selectedStamp}
                onClick={() => uploadFiles()}
                startIcon={<Check size="1rem" />}
              >
                Upload
              </Button>
              {isUploading && (
                <Container className={classes.loadingProgress}>
                  <CircularProgress />
                </Container>
              )}
            </ExpandableListItemActions>
            <UploadSizeAlert files={files} />
          </>
        )}

        {/* File has already been uploaded */}
        {uploadReference && (
          <>
            <ExpandableListItemKey label="Swarm Reference" value={uploadReference} />
            <ExpandableListItemActions>
              <Button variant="contained" onClick={uploadNew} startIcon={<RotateCcw size="1rem" />}>
                Upload New File
              </Button>
            </ExpandableListItemActions>
          </>
        )}
      </div>
    </>
  )
}
