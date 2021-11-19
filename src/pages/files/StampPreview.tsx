import { Box, Grid, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import Container from '../../components/Container'
import { PaperGridContainer } from '../../components/PaperGridContainer'
import { EnrichedPostageBatch } from '../../providers/Stamps'
import { PostageStamp } from '../stamps/PostageStamp'

interface Props {
  stamp: EnrichedPostageBatch
}

export function StampPreview({ stamp }: Props): ReactElement {
  return (
    <Box mb={4}>
      <Box mb={0.25}>
        <PaperGridContainer>
          <Grid item xs={12}>
            <Container>
              <Typography variant="subtitle2">
                You’re about to upload this file with the following postage stamp:
              </Typography>
            </Container>
          </Grid>
        </PaperGridContainer>
      </Box>
      <PaperGridContainer>
        <PostageStamp stamp={stamp} shorten={true} />
      </PaperGridContainer>
    </Box>
  )
}
