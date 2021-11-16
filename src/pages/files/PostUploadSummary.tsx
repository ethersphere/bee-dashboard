import { Button, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { Bookmark, RotateCcw } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'

interface Props {
  uploadReference: string
  onUploadNewClick: () => void
}

export function PostUploadSummary(props: Props): ReactElement {
  return (
    <>
      <ExpandableListItemKey label="Swarm hash" value={props.uploadReference} />
      <ExpandableListItemLink
        label="Share on Swarm Gateway"
        value={`https://gateway.ethswarm.org/access/${props.uploadReference}`}
      />
      <ExpandableListItemActions>
        <Button
          variant="contained"
          onClick={() => props.onUploadNewClick()}
          startIcon={<RotateCcw size="1rem" color="#dd7700" />}
        >
          Back to Upload
        </Button>
        <Button variant="contained" startIcon={<Bookmark size="1rem" color="#dd7700" />}>
          Connect With Identity
        </Button>
      </ExpandableListItemActions>
      <Typography>
        The Swarm Gateway is graciously provided by the Swarm Foundation. This service is under development and provided
        for testing purposes only. Learn more at{' '}
        <a href="https://gateway.ethswarm.org/">https://gateway.ethswarm.org/</a>.
      </Typography>
    </>
  )
}
