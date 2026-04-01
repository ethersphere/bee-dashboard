import { Web } from '@mui/icons-material'
import { Box, Grid, Typography } from '@mui/material'
import { ReactElement, useMemo } from 'react'
import File from 'remixicon-react/FileLineIcon'
import Folder from 'remixicon-react/FolderLineIcon'

import { FitAudio } from '../../components/FitAudio'
import { FitImage } from '../../components/FitImage'
import { FitVideo } from '../../components/FitVideo'
import { shortenText } from '../../utils'
import { getHumanReadableFileSize, guessMime } from '../../utils/file'
import { shortenHash } from '../../utils/hash'

import { AssetIcon } from './AssetIcon'

interface Props {
  previewUri?: string
  metadata?: Metadata
}

const getPreviewElement = (previewUri?: string, metadata?: Metadata, type?: string) => {
  const isVideoType = Boolean(type && /.*\.(mp4|webm|ogv)$/i.test(type))
  const isAudioType = Boolean(type && /.*\.(mp3|ogg|oga|wav|webm|m4a|aac|flac)$/i.test(type))
  const isImageType = Boolean(type && /.*\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(type))

  if (metadata?.isVideo || isVideoType) {
    return <FitVideo src={previewUri} maxWidth="250px" maxHeight="175px" />
  }

  if (metadata?.isAudio || isAudioType) {
    return <FitAudio src={previewUri} maxWidth="250px" />
  }

  if (metadata?.isImage || isImageType) {
    return <FitImage maxWidth="250px" maxHeight="175px" alt="Upload Preview" src={previewUri} />
  }

  if (metadata?.isWebsite) {
    return <AssetIcon icon={<Web />} />
  }

  if (metadata?.type === 'folder') {
    return <AssetIcon icon={<Folder />} />
  }

  return <AssetIcon icon={<File />} />
}

export const getType = (metadata?: Metadata): string => {
  if (metadata?.isWebsite) return 'Website'

  if (metadata?.type === 'folder') return 'Folder'

  let metadataType = metadata?.type || 'unknown'
  let typeFromExtension: string | undefined

  if (metadataType === 'unknown' && metadata?.name) {
    const { mime } = guessMime(metadata.name)
    typeFromExtension = mime === 'application/octet-stream' ? 'file' : mime
  }

  return typeFromExtension || metadataType
}

// TODO: add optional prop for indexDocument when it is already known (e.g. downloading a manifest)
export function AssetPreview({ metadata, previewUri }: Props): ReactElement | null {
  const type = useMemo(() => getType(metadata), [metadata])
  const previewElement = useMemo(() => getPreviewElement(previewUri, metadata, type), [metadata, type, previewUri])

  return (
    <Box mb={4}>
      <Box bgcolor="background.paper">
        <Grid container direction="row">
          {previewElement}
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
