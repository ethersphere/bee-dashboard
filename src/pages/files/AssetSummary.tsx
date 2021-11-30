import { Box, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'

interface Props {
  hash: string
}

export function AssetSummary({ hash }: Props): ReactElement {
  return (
    <>
      <Box mb={4}>
        <ExpandableListItemKey label="Swarm hash" value={hash} />
        <ExpandableListItemLink label="Share on Swarm Gateway" value={`https://gateway.ethswarm.org/access/${hash}`} />
      </Box>
      <Typography>
        The Swarm Gateway is graciously provided by the Swarm Foundation. This service is under development and provided
        for testing purposes only. Learn more at{' '}
        <a href="https://gateway.ethswarm.org/">https://gateway.ethswarm.org/</a>.
      </Typography>
    </>
  )
}
