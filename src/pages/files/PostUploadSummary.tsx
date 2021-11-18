import { Box, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { CornerUpLeft } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'
import { SwarmButton } from '../../components/SwarmButton'

interface Props {
  uploadReference: string
  onUploadNewClick: () => void
}

export function PostUploadSummary(props: Props): ReactElement {
  return (
    <>
      <Box mb={4}>
        <ExpandableListItemKey label="Swarm hash" value={props.uploadReference} />
        <ExpandableListItemLink
          label="Share on Swarm Gateway"
          value={`https://gateway.ethswarm.org/access/${props.uploadReference}`}
        />
      </Box>
      <Box mb={2}>
        <ExpandableListItemActions>
          <SwarmButton onClick={() => props.onUploadNewClick()} iconType={CornerUpLeft}>
            Back to Upload
          </SwarmButton>
        </ExpandableListItemActions>
      </Box>
      <Typography>
        The Swarm Gateway is graciously provided by the Swarm Foundation. This service is under development and provided
        for testing purposes only. Learn more at{' '}
        <a href="https://gateway.ethswarm.org/">https://gateway.ethswarm.org/</a>.
      </Typography>
    </>
  )
}
