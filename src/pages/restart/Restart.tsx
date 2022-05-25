import { Box, Typography } from '@material-ui/core'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Loading } from '../../components/Loading'
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
    <>
      <Box mb={4}>
        <Loading />
      </Box>
      <Typography>You will be redirected automatically once your node is up and running.</Typography>
    </>
  )
}
