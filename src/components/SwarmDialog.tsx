import { Box, Dialog, Grid } from '@material-ui/core'
import { ReactElement } from 'react'

interface Props {
  children: ReactElement | ReactElement[]
}

export function SwarmDialog({ children }: Props): ReactElement {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: { borderRadius: 0, background: '#efefef' },
      }}
    >
      <Box p={4} sx={{ maxWidth: '100%', width: '650px' }}>
        <Grid container direction="column">
          {children}
        </Grid>
      </Box>
    </Dialog>
  )
}
