import { Button } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { ReactElement } from 'react'
import { Download } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'

interface Props {
  onDownload: () => void
  onCancel: () => void
}

export function DownloadActionBar({ onDownload, onCancel }: Props): ReactElement {
  return (
    <ExpandableListItemActions>
      <Button onClick={() => onDownload()} variant="contained" startIcon={<Download />}>
        Download This File
      </Button>
      <Button onClick={() => onCancel()} variant="contained" startIcon={<Clear />}>
        Cancel
      </Button>
    </ExpandableListItemActions>
  )
}
