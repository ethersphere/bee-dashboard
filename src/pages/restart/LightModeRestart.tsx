import { Box, Grid, Typography } from '@material-ui/core'
import { BeeModes } from '@upcoming/bee-js'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ChainSync } from '../../components/ChainSync'
import { Waiting } from '../../components/Waiting'
import { Context } from '../../providers/Settings'
import { ROUTES } from '../../routes'

export default function LightModeRestart(): ReactElement {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { beeApi } = useContext(Context)

  useEffect(() => {
    if (!beeApi) {
      return
    }

    const interval = setInterval(() => {
      beeApi
        .getNodeInfo()
        .then(nodeInfo => {
          if (nodeInfo.beeMode === BeeModes.LIGHT) {
            enqueueSnackbar('Upgraded to light node', { variant: 'success' })
            navigate(ROUTES.INFO)
          }
        })
        .catch(console.error) // eslint-disable-line
    }, 3_000)

    return () => clearInterval(interval)
  }, [beeApi, enqueueSnackbar, navigate])

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
      <Box mb={1}>
        <Typography>
          You will be redirected automatically once your node is up and running. This may take up to 10 minutes.
        </Typography>
      </Box>
      <ChainSync />
    </Grid>
  )
}
