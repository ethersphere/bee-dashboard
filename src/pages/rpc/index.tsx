import { Box, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { Check } from 'react-feather'
import { useNavigate } from 'react-router'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context } from '../../providers/TopUp'
import { ROUTES } from '../../routes'
import { Rpc } from '../../utils/rpc'

export default function Index(): ReactElement {
  const { jsonRpcProvider, setJsonRpcProvider } = useContext(Context)

  const [provider, setProvider] = useState(jsonRpcProvider)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  async function onSubmit() {
    try {
      await Rpc.eth_getBlockByNumber(provider)
      enqueueSnackbar('Connected to RPC provider successfully.', { variant: 'success' })
      setJsonRpcProvider(provider)
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
          via the node&apos;s RPC endpoint. If you&apos;re not familiar with this, you may use{' '}
          <a href="https://getblock.io/" target="_blank" rel="noreferrer">
            https://getblock.io/
          </a>
          .
        </Typography>
      </Box>
      <Box mb={2}>
        <SwarmTextInput
          name="rpc-endpoint"
          label="RPC Endpoint"
          onChange={event => setProvider(event.target.value)}
          defaultValue={jsonRpcProvider}
        />
      </Box>
      <SwarmButton iconType={Check} onClick={onSubmit}>
        Connect
      </SwarmButton>
    </>
  )
}
