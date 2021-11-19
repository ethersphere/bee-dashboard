import { Box, Grid, Typography } from '@material-ui/core'
import { Web } from '@material-ui/icons'
import { ReactElement, useEffect, useState } from 'react'
import { File, Folder } from 'react-feather'
import { FitImage } from '../../components/FitImage'
import { detectIndexHtml, getHumanReadableFileSize, NameWithPath } from '../../utils/file'
import { AssetIcon } from './AssetIcon'

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
        setPreviewComponent(<AssetIcon icon={<File />} />)
      }
      // collection
    } else if (detectIndexHtml(props.files as unknown as NameWithPath[])) {
      setPreviewUri(undefined)
      setPreviewComponent(<AssetIcon icon={<Web />} />)
    } else {
      setPreviewUri(undefined)
      setPreviewComponent(<AssetIcon icon={<Folder />} />)
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
      <Box bgcolor="background.paper">
        <Grid container direction="row">
          {previewComponent ? (
            previewComponent
          ) : (
            <FitImage maxWidth="250px" maxHeight="175px" alt="Upload Preview" src={previewUri} />
          )}
          <Box p={2}>
            <Typography>{getPrimaryText()}</Typography>
            <Typography>Kind: {getKind()}</Typography>
            <Typography>Size: {getSize()}</Typography>
          </Box>
        </Grid>
      </Box>
      {isFolder() && (
        <Box mt={0.25} p={2} bgcolor="background.paper">
          <Grid container justifyContent="space-between" alignItems="center" direction="row">
            <Typography variant="subtitle2">Folder content</Typography>
            <Typography variant="subtitle2">{props.files.length} items</Typography>
          </Grid>
        </Box>
      )}
    </Box>
  )
}
