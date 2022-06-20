import { Box, Grid, Typography } from '@material-ui/core'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Waiting } from '../../components/Waiting'
import { Context } from '../../providers/Bee'
import { ROUTES } from '../../routes'

export default function Settings(): ReactElement {
  const [waited, setWaited] = useState(false)
  const { apiHealth } = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    if (waited) {
      return
    }

    const timeout = setTimeout(() => setWaited(true), 5_000)

    return () => clearTimeout(timeout)
  }, [waited])

  useEffect(() => {
    if (!waited) {
      return
    }

    if (apiHealth) {
      navigate(ROUTES.INFO)
    }
  }, [navigate, waited, apiHealth])

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Box mb={9}>
        <Waiting />
      </Box>
      <Box mb={1}>
        <Typography>
          <strong>Starting Bee</strong>
        </Typography>
      </Box>
      <Typography>You will be redirected automatically once your node is up and running.</Typography>
    </Grid>
  )
}
