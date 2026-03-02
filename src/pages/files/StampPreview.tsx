import { Box, Typography } from '@mui/material'
import { ReactElement } from 'react'

import { EnrichedPostageBatch } from '../../providers/Stamps'
import { PostageStamp } from '../stamps/PostageStamp'

interface Props {
  stamp: EnrichedPostageBatch
}

export function StampPreview({ stamp }: Props): ReactElement {
  return (
    <Box mb={4}>
      <Box mb={0.25} p={2} bgcolor="background.paper">
        <Typography variant="subtitle2">Associated postage stamp:</Typography>
      </Box>
      <Box bgcolor="background.paper">
        <PostageStamp stamp={stamp} shorten={true} />
      </Box>
    </Box>
  )
}
