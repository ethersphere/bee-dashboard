import { Button, CircularProgress, Container } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import { DropzoneArea } from 'material-ui-dropzone'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import UploadSizeAlert from '../../components/AlertUploadSize'
import ClipboardCopy from '../../components/ClipboardCopy'
import PeerDetailDrawer from '../../components/PeerDetail'
import { Context, EnrichedPostageBatch } from '../../providers/Stamps'
import { Context as SettingsContext } from '../../providers/Settings'
import CreatePostageStamp from '../stamps/CreatePostageStampModal'
import SelectStamp from './SelectStamp'

const MAX_FILE_SIZE = 1_000_000_000 // 1 gigabyte

export default function Files(): ReactElement {
  const [dropzoneKey, setDropzoneKey] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [uploadReference, setUploadReference] = useState('')
  const [isUploadingFile, setIsUploadingFile] = useState(false)

  const [selectedStamp, setSelectedStamp] = useState<EnrichedPostageBatch | null>(null)

  const { isLoading, error, stamps } = useContext(Context)
  const { beeApi } = useContext(SettingsContext)
  const { enqueueSnackbar } = useSnackbar()

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
      .then(hash => {
        window.setTimeout(() => {
          setFile(null)
          setUploadReference(hash.reference)
          setDropzoneKey(dropzoneKey + 1)
        }, 0)
      })
      .catch(e => enqueueSnackbar(`Error uploading: ${e.message}`, { variant: 'error' }))
      .finally(() => {
        setIsUploadingFile(false)
      })
  }

  const handleChange = (files?: File[]) => {
    if (files) {
      setFile(files[0])
    }
  }

  return (
    <div>
      <div>
        <DropzoneArea
          key={'dropzone-' + dropzoneKey}
          onChange={handleChange}
          filesLimit={1}
          maxFileSize={MAX_FILE_SIZE}
        />
        <div style={{ marginTop: '15px' }}>
          {selectedStamp && (
            <div style={{ display: 'flex' }}>
              <small>
                with Postage Stamp{' '}
                <Chip
                  avatar={<Avatar>{selectedStamp.usageText}</Avatar>}
                  label={<PeerDetailDrawer peerId={selectedStamp.batchID} characterLength={6} />}
                  deleteIcon={<ClipboardCopy value={selectedStamp.batchID} />}
                  onDelete={() => {} /* eslint-disable-line*/}
                  variant="outlined"
                />
              </small>
              <SelectStamp stamps={stamps} selectedStamp={selectedStamp} setSelected={setSelectedStamp} />
            </div>
          )}
          {!selectedStamp && <CreatePostageStamp />}
          <Button disabled={!file && isUploadingFile && !selectedStamp} onClick={() => uploadFile()}>
            Upload
          </Button>
          {file && <UploadSizeAlert file={file} />}
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
        </div>
      </div>
    </div>
  )
}
