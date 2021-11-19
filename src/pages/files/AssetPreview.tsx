import { Box, Grid, Typography } from '@material-ui/core'
import { ReactElement, useEffect, useState } from 'react'
import Container from '../../components/Container'
import { FitImage } from '../../components/FitImage'
import { PaperGridContainer } from '../../components/PaperGridContainer'
import { detectIndexHtml, getHumanReadableFileSize, NameWithPath } from '../../utils/file'
import { FileIcon } from './FileIcon'
import { FolderIcon } from './FolderIcon'
import { WebsiteIcon } from './WebsiteIcon'

interface Props {
  files: File[]
}

export function AssetPreview(props: Props): ReactElement {
  const [previewComponent, setPreviewComponent] = useState<ReactElement | undefined>(undefined)
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
        setPreviewUri(undefined)
        setPreviewComponent(<FileIcon />)
      }
      // collection
    } else if (detectIndexHtml(props.files as unknown as NameWithPath[])) {
      setPreviewUri(undefined)
      setPreviewComponent(<WebsiteIcon />)
    } else {
      setPreviewUri(undefined)
      setPreviewComponent(<FolderIcon />)
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
    <Box mb={4}>
      <PaperGridContainer>
        <Grid container alignItems="stretch" direction="row">
          {previewComponent ? (
            previewComponent
          ) : (
            <FitImage maxWidth="250px" maxHeight="175px" alt="Upload Preview" src={previewUri} />
          )}
          <Container>
            <Typography>{getPrimaryText()}</Typography>
            <Typography>Kind: {getKind()}</Typography>
            <Typography>Size: {getSize()}</Typography>
          </Container>
        </Grid>
      </PaperGridContainer>
      {isFolder() && (
        <PaperGridContainer>
          <Container>
            <Typography variant="subtitle2">Folder content</Typography>
          </Container>
          <Container textAlign="right">
            <Typography variant="subtitle2">{props.files.length} items</Typography>
          </Container>
        </PaperGridContainer>
      )}
    </Box>
  )
}
