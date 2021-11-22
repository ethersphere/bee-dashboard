import { Box, Grid, Typography } from '@material-ui/core'
import { Web } from '@material-ui/icons'
import { ReactElement, useEffect, useState } from 'react'
import { File, Folder } from 'react-feather'
import { FitImage } from '../../components/FitImage'
import { detectIndexHtml, getHumanReadableFileSize } from '../../utils/file'
import { SwarmFile } from '../../utils/SwarmFile'
import { AssetIcon } from './AssetIcon'

interface Props {
  files: SwarmFile[]
}

export function AssetPreview({ files }: Props): ReactElement {
  const [previewComponent, setPreviewComponent] = useState<ReactElement | undefined>(undefined)
  const [previewUri, setPreviewUri] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (files.length === 1) {
      // single image
      if (files[0].type.startsWith('image/')) {
        files[0].arrayBuffer().then(value => {
          const blob = new Blob([value])
          setPreviewUri(URL.createObjectURL(blob))
        })
        // single non-image
      } else {
        setPreviewUri(undefined)
        setPreviewComponent(<AssetIcon icon={<File />} />)
      }
      // collection
    } else if (detectIndexHtml(files)) {
      setPreviewUri(undefined)
      setPreviewComponent(<AssetIcon icon={<Web />} />)
    } else {
      setPreviewUri(undefined)
      setPreviewComponent(<AssetIcon icon={<Folder />} />)
    }
  }, [files])

  const getPrimaryText = () => {
    if (files.length === 1) {
      return 'Filename: ' + files[0].name
    }

    return 'Folder name: ' + files[0].path.split('/')[0]
  }

  const getKind = () => {
    if (files.length === 1) {
      return files[0].type
    }

    if (detectIndexHtml(files)) {
      return 'Website'
    }

    return 'Folder'
  }

  const isFolder = () => ['Folder', 'Website'].includes(getKind())

  const getSize = () => {
    const bytes = files.reduce((total, item) => total + item.size, 0)

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
            <Typography variant="subtitle2">{files.length} items</Typography>
          </Grid>
        </Box>
      )}
    </Box>
  )
}