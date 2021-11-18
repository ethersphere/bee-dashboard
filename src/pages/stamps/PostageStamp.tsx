import { Grid, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { Capacity } from '../../components/Capacity'
import Container from '../../components/Container'
import { EnrichedPostageBatch } from '../../providers/Stamps'

interface Props {
  stamp: EnrichedPostageBatch
  shorten?: boolean
}

export function PostageStamp({ stamp, shorten }: Props): ReactElement {
  return (
    <Grid container justifyContent="space-between" alignItems="center" direction="row">
      <Container>
        <Typography variant="subtitle2">{shorten ? stamp.batchID.slice(0, 8) : stamp.batchID}</Typography>
      </Container>
      <Container>
        <Capacity usage={stamp.usage} />
      </Container>
    </Grid>
  )
}
