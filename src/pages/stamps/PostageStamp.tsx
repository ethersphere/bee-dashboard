import { Box, Grid, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { Capacity } from '../../components/Capacity'
import { EnrichedPostageBatch } from '../../providers/Stamps'

interface Props {
  stamp: EnrichedPostageBatch
  shorten?: boolean
}

export function PostageStamp({ stamp, shorten }: Props): ReactElement {
  return (
    <Box p={2} width="100%">
      <Grid container justifyContent="space-between" alignItems="center" direction="row">
        <Typography variant="subtitle2">{shorten ? stamp.batchID.slice(0, 8) : stamp.batchID}</Typography>
        <Capacity width="100px" usage={stamp.usage} />
      </Grid>
    </Box>
  )
}
