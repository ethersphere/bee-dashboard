import { Button } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { ReactElement } from 'react'
import { Download } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmButton } from '../../components/SwarmButton'

interface Props {
  onDownload: () => void
  onCancel: () => void
}

export function DownloadActionBar({ onDownload, onCancel }: Props): ReactElement {
  return (
    <ExpandableListItemActions>
      <SwarmButton onClick={onDownload} iconType={Download}>
        Download This File
      </SwarmButton>
      <Button onClick={onCancel} variant="contained" startIcon={<Clear />}>
        Cancel
      </Button>
    </ExpandableListItemActions>
  )
}
