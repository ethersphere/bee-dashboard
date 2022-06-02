import { BeeModes } from '@ethersphere/bee-js'
import { Box, Typography } from '@material-ui/core'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Loading } from '../../components/Loading'
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
    <>
      <Box mb={4}>
        <Loading />
      </Box>
      <Typography>Your node is being upgraded to light mode... postage syncing may take up to 10 minutes.</Typography>
    </>
  )
}
