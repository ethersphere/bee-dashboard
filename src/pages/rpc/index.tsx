import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import Check from 'remixicon-react/CheckLineIcon'
import { useNavigate } from 'react-router'
import { providers } from 'ethers'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context } from '../../providers/TopUp'
import { ROUTES } from '../../routes'
import { Rpc } from '../../utils/rpc'

export default function Index(): ReactElement {
  const { providerUrl, setProviderUrl } = useContext(Context)
  const [localProviderUrl, setLocalProviderUrl] = useState(providerUrl)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  async function onSubmit() {
    try {
      await Rpc.eth_getBlockByNumber(new providers.JsonRpcProvider(localProviderUrl))
      enqueueSnackbar('Connected to RPC provider successfully.', { variant: 'success' })
      setProviderUrl(localProviderUrl)
      navigate(ROUTES.CONFIRMATION)
    } catch (error) {
      enqueueSnackbar('Could not connect to RPC provider.', { variant: 'error' })
    }
  }

  return (
    <>
      <HistoryHeader>Connect to the blockchain</HistoryHeader>
      <Box mb={1}>
        <Typography style={{ fontWeight: 'bold' }}>Set up RPC endpoint</Typography>
      </Box>
      <Box mb={4}>
        <Typography>
          To connect to and retrieve data from the blockchain, you&apos;ll need to connect to a publicly-provided node
          via the node&apos;s RPC endpoint. If you&apos;re not familiar with this, please read{' '}
          <a
            href="https://medium.com/ethereum-swarm/upgrading-swarm-deskotp-app-beta-from-an-ultra-light-to-a-light-node-65d52cab7f2c"
            target="_blank"
            rel="noreferrer"
          >
            this guide.
          </a>
          .
        </Typography>
      </Box>
      <Box mb={2}>
        <SwarmTextInput
          name="rpc-endpoint"
          label="RPC Endpoint"
          onChange={event => setLocalProviderUrl(event.target.value)}
          defaultValue={providerUrl}
        />
      </Box>
      <SwarmButton iconType={Check} onClick={onSubmit}>
        Connect
      </SwarmButton>
    </>
  )
}
