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
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemNote from '../../components/ExpandableListItemNote'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'

const MAX_FILE_SIZE = 1_000_000_000 // 1 gigabyte

export default function Files(): ReactElement {
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
      .finally(() => {
        setIsUploadingFile(false)
      })
  }

  const uploadNew = () => {
    setTimeout(() => {
      setFile(null)
      setDropzoneKey(dropzoneKey + 1)
      setUploadReference('')
    }, 0)
  }

  const handleChange = (files?: File[]) => {
    if (files) {
      setFile(files[0])
    }
  }

  return (
    <div>
      <DropzoneArea
        key={'dropzone-' + dropzoneKey}
        onChange={handleChange}
        filesLimit={1}
        maxFileSize={MAX_FILE_SIZE}
      />
      {file && (
        <div style={{ marginTop: '15px' }}>
          {!isUploadingFile && !uploadReference && (
            <>
              <ExpandableListItemNote>
                To upload this file to your node, you need a postage stamp. You can buy a new batch specifically for
                this file and provide the desired depth and amount or you can use an existing batch (providing it’s
                sufficient for this file).
              </ExpandableListItemNote>
              {selectedStamp && (
                <ExpandableListItem
                  label={
                    <>
                      Upload with Postage Stamp{' '}
                      <Chip
                        avatar={<Avatar>{selectedStamp.usageText}</Avatar>}
                        label={<PeerDetailDrawer peerId={selectedStamp.batchID} characterLength={6} />}
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
          {!uploadReference && (
            <>
              {' '}
              {selectedStamp && (
                <ExpandableListItemActions>
                  <Button
                    variant="contained"
                    disabled={!file && isUploadingFile && !selectedStamp}
                    onClick={() => uploadFile()}
                  >
                    Upload
                  </Button>
                  {isUploadingFile && (
                    <Container style={{ textAlign: 'center', padding: '50px' }}>
                      <CircularProgress />
                    </Container>
                  )}
                </ExpandableListItemActions>
              )}
              {<UploadSizeAlert file={file} />}
            </>
          )}
          {uploadReference && (
            <>
              <ExpandableListItemKey label="Swarm Reference" value={uploadReference} />
              <ExpandableListItemActions>
                <Button variant="contained" onClick={uploadNew}>
                  Upload New File
                </Button>
              </ExpandableListItemActions>
            </>
          )}
        </div>
      )}
    </div>
  )
}
