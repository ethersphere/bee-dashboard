import { Box, Grid, Typography } from '@material-ui/core'
import { Web } from '@material-ui/icons'
import { ReactElement } from 'react'
import { File, Folder } from 'react-feather'
import { FitImage } from '../../components/FitImage'
import { shortenText } from '../../utils'
import { getHumanReadableFileSize } from '../../utils/file'
import { shortenHash } from '../../utils/hash'
import { AssetIcon } from './AssetIcon'

interface Props {
  previewUri?: string
  metadata?: Metadata
}

// TODO: add optional prop for indexDocument when it is already known (e.g. downloading a manifest)

export function AssetPreview({ metadata, previewUri }: Props): ReactElement | null {
  let previewComponent = <File />
  let type = metadata?.type

  if (metadata?.isWebsite) {
    previewComponent = <Web />
    type = 'Website'
  } else if (metadata?.type === 'folder') {
    previewComponent = <Folder />
    type = 'Folder'
  }

  return (
    <Box mb={4}>
      <Box bgcolor="background.paper">
        <Grid container direction="row">
          {previewUri ? (
            <FitImage maxWidth="250px" maxHeight="175px" alt="Upload Preview" src={previewUri} />
          ) : (
            <AssetIcon icon={previewComponent} />
          )}
          <Box p={2}>
            {metadata?.hash && <Typography>Swarm Hash: {shortenHash(metadata.hash)}</Typography>}
            {metadata?.name && metadata?.name !== metadata?.hash && (
              <Typography>
                {metadata?.type === 'folder' ? 'Folder Name' : 'Filename'}: {shortenText(metadata?.name)}
              </Typography>
            )}
            <Typography>Kind: {type}</Typography>
            {metadata?.size ? <Typography>Size: {getHumanReadableFileSize(metadata.size)}</Typography> : null}
          </Box>
        </Grid>
      </Box>
      {metadata?.type === 'folder' && metadata.count && (
        <Box mt={0.25} p={2} bgcolor="background.paper">
          <Grid container justifyContent="space-between" alignItems="center" direction="row">
            <Typography variant="subtitle2">Folder content</Typography>
            <Typography variant="subtitle2">{metadata.count} items</Typography>
          </Grid>
        </Box>
      )}
    </Box>
  )
}
