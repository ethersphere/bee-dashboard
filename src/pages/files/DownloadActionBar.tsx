import { Button } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { ReactElement } from 'react'
import { Download, Link } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmButton } from '../../components/SwarmButton'

interface Props {
  onOpen: () => void
  onDownload: () => void
  onCancel: () => void
  hasIndexDocument: boolean
  loading: boolean
}

export function DownloadActionBar({ onOpen, onDownload, onCancel, hasIndexDocument, loading }: Props): ReactElement {
  return (
    <ExpandableListItemActions>
      {hasIndexDocument && (
        <SwarmButton onClick={onOpen} iconType={Link} disabled={loading}>
          View Website
        </SwarmButton>
      )}
      <SwarmButton onClick={onDownload} iconType={Download} disabled={loading} loading={loading}>
        Download
      </SwarmButton>
      <Button onClick={onCancel} variant="contained" startIcon={<Clear />} disabled={loading}>
        Close
      </Button>
    </ExpandableListItemActions>
  )
}
