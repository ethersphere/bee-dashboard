import { ReactElement, useContext, useEffect, useState } from 'react'
import { beeApi } from '../../services/bee'

import { Button, Container, CircularProgress } from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import ClipboardCopy from '../../components/ClipboardCopy'
import { PostageBatch } from '@ethersphere/bee-js'
import { Context } from '../../providers/Stamps'
import PeerDetailDrawer from '../../components/PeerDetail'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import SelectStamp from './SelectStamp'
import CreatePostageStamp from '../stamps/CreatePostageStampModal'
import { useSnackbar } from 'notistack'

export default function Files(): ReactElement {
  const [file, setFile] = useState<File | null>(null)
  const [uploadReference, setUploadReference] = useState('')
  const [isUploadingFile, setIsUploadingFile] = useState(false)

  const [selectedStamp, setSelectedStamp] = useState<PostageBatch | null>(null)

  const { isLoading, error, stamps } = useContext(Context)
  const { enqueueSnackbar } = useSnackbar()

  // Choose a postage stamp that has the lowest utilization
  useEffect(() => {
    if (!selectedStamp && stamps && stamps.length > 0) {
      const stamp = stamps.reduce((prev, curr) => {
        if (curr.utilization < prev.utilization) return curr

        return prev
      }, stamps[0])

      setSelectedStamp(stamp)
    }
  }, [isLoading, error, stamps, selectedStamp])

  const uploadFile = () => {
    if (file === null || selectedStamp === null) return
    setIsUploadingFile(true)
    beeApi.files
      .uploadFile(selectedStamp.batchID, file)
      .then(hash => {
        setUploadReference(hash)
        setFile(null)
      })
      .catch(e => enqueueSnackbar(`Error uploading: ${e.message}`, { variant: 'error' }))
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

  return (
    <div>
      <div>
        <DropzoneArea onChange={handleChange} filesLimit={1} />
        <div style={{ marginTop: '15px' }}>
          {selectedStamp && (
            <div style={{ display: 'flex' }}>
              <small>
                with Postage Stamp{' '}
                <Chip
                  avatar={<Avatar>{selectedStamp.utilization}</Avatar>}
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
