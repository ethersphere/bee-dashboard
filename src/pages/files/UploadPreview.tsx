import { createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import { ReactElement, useEffect, useState } from 'react'
import Container from '../../components/Container'
import { FitImage } from '../../components/FitImage'
import { VerticalSpacing } from '../../components/VerticalSpacing'
import { detectIndexHtml, getHumanReadableFileSize, NameWithPath } from '../../utils/file'

interface Props {
  files: File[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    folderContent: { marginBottom: theme.spacing(4) },
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

    if (detectIndexHtml(props.files as unknown as NameWithPath[])) {
      return 'Website'
    }

    return 'Folder'
  }

  const isFolder = () => ['Folder', 'Website'].includes(getKind())

  const getSize = () => {
    const bytes = props.files.reduce((total, item) => total + item.size, 0)

    return getHumanReadableFileSize(bytes)
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
        <>
          <VerticalSpacing px={2} />
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
        </>
      )}
    </>
  )
}
