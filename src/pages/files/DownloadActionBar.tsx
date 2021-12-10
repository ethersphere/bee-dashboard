import { Box, Button, Grid } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { ReactElement } from 'react'
import { Bookmark, Download, Link } from 'react-feather'
import { SwarmButton } from '../../components/SwarmButton'

interface Props {
  onOpen: () => void
  onCancel: () => void
  onDownload: () => void
  onUpdateFeed: () => void
  hasIndexDocument: boolean
  loading: boolean
}

export function DownloadActionBar({
  onOpen,
  onCancel,
  onDownload,
  onUpdateFeed,
  hasIndexDocument,
  loading,
}: Props): ReactElement {
  return (
    <Grid container>
      {hasIndexDocument && (
        <Box mb={1} mr={1}>
          <SwarmButton onClick={onOpen} iconType={Link} disabled={loading}>
            View Website
          </SwarmButton>
        </Box>
      )}
      <Box mb={1} mr={1}>
        <SwarmButton onClick={onDownload} iconType={Download} disabled={loading} loading={loading}>
          Download
        </SwarmButton>
      </Box>
      <Box mb={1} mr={1}>
        <Button onClick={onCancel} variant="contained" startIcon={<Clear />} disabled={loading}>
          Close
        </Button>
      </Box>
      <Box mb={1} mr={1}>
        <SwarmButton onClick={onUpdateFeed} iconType={Bookmark}>
          Update Feed
        </SwarmButton>
      </Box>
    </Grid>
  )
}
