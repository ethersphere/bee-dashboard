import { BeeModes } from '@ethersphere/bee-js'
import { Box, Grid, Typography } from '@material-ui/core'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Waiting } from '../../components/Waiting'
import { Context } from '../../providers/Bee'
import { ROUTES } from '../../routes'

export default function Settings(): ReactElement {
  const [startedAt] = useState(Date.now())
  const { apiHealth, nodeInfo } = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    if (Date.now() - startedAt < 45_000) {
      return
    }

    if (apiHealth && nodeInfo?.beeMode === BeeModes.LIGHT) {
      navigate(ROUTES.INFO)
    }
  }, [startedAt, navigate, nodeInfo, apiHealth])

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Box mb={9}>
        <Waiting />
      </Box>
      <Box mb={1}>
        <Typography>
          <strong>Upgrading Bee</strong>
        </Typography>
      </Box>
      <Typography>
        You will be redirected automatically once your node is up and running. This may take up to 10 minutes.
      </Typography>
    </Grid>
  )
}
