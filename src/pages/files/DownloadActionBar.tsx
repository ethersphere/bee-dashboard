import { Box, Grid } from '@material-ui/core'
import { ReactElement } from 'react'
import { Bookmark, Download, Link, X } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
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
    <Grid container justifyContent="space-between">
      <ExpandableListItemActions>
        {hasIndexDocument && (
          <SwarmButton onClick={onOpen} iconType={Link} disabled={loading}>
            View Website
          </SwarmButton>
        )}
        <SwarmButton onClick={onDownload} iconType={Download} disabled={loading} loading={loading}>
          Download
        </SwarmButton>
        <SwarmButton onClick={onCancel} iconType={X} disabled={loading} cancel>
          Close
        </SwarmButton>
      </ExpandableListItemActions>
      <Box mb={1} mr={1}>
        <SwarmButton onClick={onUpdateFeed} iconType={Bookmark} disabled={loading}>
          Update Feed
        </SwarmButton>
      </Box>
    </Grid>
  )
}
