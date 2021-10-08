import { Button, CircularProgress, Container, Avatar, Chip, Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { DropzoneArea } from 'material-ui-dropzone'
import { useSnackbar } from 'notistack'
import { RotateCcw, Check } from 'react-feather'
import { ReactElement, useContext, useEffect, useState } from 'react'
import UploadSizeAlert from '../../components/AlertUploadSize'
import ClipboardCopy from '../../components/ClipboardCopy'
import { Context, EnrichedPostageBatch } from '../../providers/Stamps'
import { Context as SettingsContext } from '../../providers/Settings'
import CreatePostageStamp from '../stamps/CreatePostageStampModal'
import SelectStamp from './SelectStamp'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemNote from '../../components/ExpandableListItemNote'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'

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
  const [file, setFile] = useState<File | null>(null)
  const [uploadReference, setUploadReference] = useState('')
  const [isUploadingFile, setIsUploadingFile] = useState(false)

  const [selectedStamp, setSelectedStamp] = useState<EnrichedPostageBatch | null>(null)

  const { isLoading, error, stamps, refresh } = useContext(Context)
  const { beeApi } = useContext(SettingsContext)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    refresh()
  }, [])

  // Choose a postage stamp that has the lowest usage
  useEffect(() => {
    if (!selectedStamp && stamps && stamps.length > 0) {
      const stamp = stamps.reduce((prev, curr) => {
        if (curr.usage < prev.usage) return curr

        return prev
      }, stamps[0])

      setSelectedStamp(stamp)
    }
  }, [isLoading, error, stamps, selectedStamp])

  const uploadFile = () => {
    if (file === null || selectedStamp === null) return

    if (!beeApi) return

    setIsUploadingFile(true)
    beeApi
      .uploadFile(selectedStamp.batchID, file)
      .then(hash => setUploadReference(hash.reference))
      .catch(e => enqueueSnackbar(`Error uploading: ${e.message}`, { variant: 'error' }))
      .finally(() => setIsUploadingFile(false))
  }

  const uploadNew = () => {
    setTimeout(() => {
      setFile(null)
      setDropzoneKey(dropzoneKey + 1)
      setUploadReference('')
    }, 0)
  }

  const handleChange = (files?: File[]) => {
    setUploadReference('')

    if (files) {
      setFile(files[0])
    }
  }

  return (
    <>
      <DropzoneArea
        key={'dropzone-' + dropzoneKey}
        onChange={handleChange}
        filesLimit={1}
        maxFileSize={MAX_FILE_SIZE}
      />
      <div className={classes.content}>
        {/* We have file and can upload display stamp selection */}
        {file && !isUploadingFile && !uploadReference && (
          <>
            <ExpandableListItemNote>
              To upload this file to your node, you need a postage stamp. You can buy a new one or you can use an
              existing stamp (providing it’s sufficient for this file).
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

        {/* We have file and can upload display upload button */}
        {file && !uploadReference && (
          <>
            <ExpandableListItemActions>
              <Button
                variant="contained"
                disabled={!file && isUploadingFile && !selectedStamp}
                onClick={() => uploadFile()}
                startIcon={<Check size="1rem" />}
              >
                Upload
              </Button>
              {isUploadingFile && (
                <Container className={classes.loadingProgress}>
                  <CircularProgress />
                </Container>
              )}
            </ExpandableListItemActions>
            <UploadSizeAlert file={file} />
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
