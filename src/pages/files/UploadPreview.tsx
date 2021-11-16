import { Button, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { ReactElement, useEffect, useState } from 'react'
import Container from '../../components/Container'
import { FitImage } from '../../components/FitImage'

interface Props {
  files: File[]
  clearFiles: () => void
  showCancel: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    folderContent: { marginTop: theme.spacing(0.25), marginBottom: theme.spacing(6) }, // TODO use theme spacing
  }),
)

export function UploadPreview(props: Props): ReactElement {
  const [previewUri, setPreviewUri] = useState<string | undefined>(undefined)

  const classes = useStyles()

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

  const isFolder = () => getKind() === 'Folder'

  const getSize = () => {
    const bytes = props.files.reduce((total, item) => total + item.size, 0)

    if (bytes >= 1e6) {
      return (bytes / 1e6).toFixed(2) + ' MB'
    }

    return (bytes / 1e3).toFixed(2) + ' kB'
  }

  return (
    <>
      <Grid container alignItems="stretch" direction="row">
        <Grid item xs={4}>
          <FitImage maxHeight="250px" alt="Upload Preview" src={previewUri} />
        </Grid>
        <Grid item xs={8}>
          <Container maxHeight="250px">
            <>
              <Typography>{getPrimaryText()}</Typography>
              <Typography>Kind: {getKind()}</Typography>
              <Typography>Size: {getSize()}</Typography>
            </>
          </Container>
        </Grid>
      </Grid>
      {isFolder() && (
        <Grid container alignItems="stretch" direction="row">
          <Grid item xs={6} className={classes.folderContent}>
            <Container>
              <Typography variant="subtitle2">Folder content</Typography>
            </Container>
          </Grid>
          <Grid item xs={6} className={classes.folderContent}>
            <Container textAlign="right">
              <Typography variant="subtitle2">{props.files.length} items</Typography>
            </Container>
          </Grid>
        </Grid>
      )}
      {props.showCancel && (
        <Button variant="contained" onClick={() => props.clearFiles()} startIcon={<Clear />}>
          Cancel
        </Button>
      )}
    </>
  )
}
