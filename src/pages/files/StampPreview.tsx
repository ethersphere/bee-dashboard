import { Grid, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { Capacity } from '../../components/Capacity'
import Container from '../../components/Container'
import { VerticalSpacing } from '../../components/VerticalSpacing'
import { EnrichedPostageBatch } from '../../providers/Stamps'

interface Props {
  stamp: EnrichedPostageBatch
}

export function StampPreview({ stamp }: Props): ReactElement {
  return (
    <>
      <Grid container alignItems="stretch" direction="row">
        <Grid item xs={12}>
          <Container>
            <Typography variant="subtitle2">
              You’re about to upload this file with the following postage stamp:
            </Typography>
          </Container>
        </Grid>
      </Grid>
      <VerticalSpacing px={2} />
      <Grid container alignItems="stretch" direction="row">
        <Grid item xs={6}>
          <Container>
            <Typography variant="subtitle2">{stamp.batchID}</Typography>
          </Container>
        </Grid>
        <Grid item xs={6}>
          <Container>
            <Capacity usage={stamp.usage} />
          </Container>
        </Grid>
      </Grid>
    </>
  )
}
