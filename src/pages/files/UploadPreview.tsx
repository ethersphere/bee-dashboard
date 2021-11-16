import { Button, Grid, Typography } from '@material-ui/core'
import { ReactElement, useEffect, useState } from 'react'
import Container from '../../components/Container'
import { FitImage } from '../../components/FitImage'

interface Props {
  files: File[]
  clearFiles: () => void
}

export function UploadPreview(props: Props): ReactElement {
  const [previewUri, setPreviewUri] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (props.files.length === 1) {
      // single image
      if (props.files[0].type.startsWith('image/')) {
        props.files[0].arrayBuffer().then(value => {
          const blob = new Blob([value])
          setPreviewUri(URL.createObjectURL(blob))
        })
        // single non-image
      } else {
        setPreviewUri('https://picsum.photos/300')
      }
      // collection
    } else {
      setPreviewUri('https://picsum.photos/300')
    }
  }, [props.files])

  const getPrimaryText = () => {
    if (props.files.length === 1) {
      return 'Filename: ' + props.files[0].name
    }

    return 'Folder name: ' + props.files[0].webkitRelativePath.split('/')[0]
  }

  const getKind = () => {
    if (props.files.length === 1) {
      return props.files[0].type
    }

    return 'Folder'
  }

  const getSize = () => {
    const bytes = props.files.reduce((total, item) => total + item.size, 0)

    if (bytes >= 1e6) {
      return (bytes / 1e6).toFixed(2) + ' Mb'
    }

    return (bytes / 1e3).toFixed(2) + ' Kb'
  }

  return (
    <>
      <Grid container alignItems="stretch" direction="row">
        <Grid item xs={4}>
          <FitImage maxHeight="250px" alt="Upload Preview" src={previewUri} />
        </Grid>
        <Grid item xs={8}>
          <Container maxHeight="250px">
            <Typography>{getPrimaryText()}</Typography>
            <Typography>Kind: {getKind()}</Typography>
            <Typography>Size: {getSize()}</Typography>
          </Container>
        </Grid>
      </Grid>
      <Button variant="contained" onClick={() => props.clearFiles()}>
        Cancel
      </Button>
    </>
  )
}
