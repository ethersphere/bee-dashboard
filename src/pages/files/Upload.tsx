import { ReactElement, useContext, useEffect, useState } from 'react'
import { beeApi } from '../../services/bee'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Button, Container, CircularProgress, FormHelperText } from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import ClipboardCopy from '../../components/ClipboardCopy'
import { PostageBatch } from '@ethersphere/bee-js'
import { Context } from '../../providers/Stamps'
import PeerDetailDrawer from '../../components/PeerDetail'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import SelectStamp from './SelectStamp'
import CreatePostageStamp from '../stamps/CreatePostageStampModal'

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

  const [file, setFile] = useState<File | null>(null)
  const [uploadReference, setUploadReference] = useState('')
  const [uploadError, setUploadError] = useState<Error | null>(null)
  const [isUploadingFile, setIsUploadingFile] = useState(false)

  const [selectedStamp, setSelectedStamp] = useState<PostageBatch | null>(null)

  const { isLoading, error, stamps } = useContext(Context)

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
    setUploadError(null)
    beeApi.files
      .uploadFile(selectedStamp.batchID, file)
      .then(hash => {
        setUploadReference(hash)
        setFile(null)
      })
      .catch(setUploadError) // FIXME: should instead trigger notification
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
          <Button
            disabled={!file && isUploadingFile && !selectedStamp}
            onClick={() => uploadFile()}
            className={classes.iconButton}
          >
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
  )
}
