import { Box, Card, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { ArrowUp, Send } from 'react-feather'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context } from '../../providers/Bee'
import { Rpc } from '../../utils/rpc'

export default function UpgradePage(): ReactElement {
  const { nodeInfo } = useContext(Context)

  const { enqueueSnackbar } = useSnackbar()

  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [rpcProvider, setRpcProvider] = useState<string>('https://dai.poa.network/')

  useEffect(() => {
    fetch('http://localhost:5000/status')
      .then(response => response.json())
      .then(status => Rpc.eth_getBalance(status.address))
      .then(balance => setBalance(balance))
  }, [])

  async function onFund() {
    setLoading(true)
    try {
      const { address } = await fetch('http://localhost:5000/status').then(response => response.json())
      await fetch(`http://getxdai.co/${address}/0.01`, {
        method: 'POST',
      })
      const balance = await Rpc.eth_getBalance(address)
      setBalance(balance)
      enqueueSnackbar('Wallet funded successfully', { variant: 'success' })
    } finally {
      setLoading(false)
    }
  }

  async function onUpgrade() {
    setLoading(true)
    try {
      await fetch('http://localhost:5000/config', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          'chain-enable': true,
          'swap-enable': true,
          'swap-endpoint': rpcProvider,
        }),
      })
      await fetch('http://localhost:5000/restart', {
        method: 'POST',
      })
      enqueueSnackbar('Restarting Bee in Light Mode...', { variant: 'success' })
    } finally {
      setLoading(false)
    }
  }

  if (!nodeInfo) {
    return <Loading />
  }

  return (
    <div>
      <HistoryHeader>Upgrade</HistoryHeader>
      <Box mb={4}>
        <Card variant="outlined">
          <Box p={2}>
            <Box mb={2}>
              <Typography variant="h1">Wallet</Typography>
            </Box>
            <Box mb={4}>
              <Typography>
                Your current balance is {balance}. Fund your node with XDAI so chequebook can be deployed.
              </Typography>
            </Box>
            <SwarmButton
              onClick={onFund}
              iconType={Send}
              loading={loading}
              disabled={Boolean(balance) || loading}
              variant="outlined"
            >
              Fund
            </SwarmButton>
          </Box>
        </Card>
      </Box>
      <Box mb={4}>
        <Card variant="outlined">
          <Box p={2}>
            <Box mb={2}>
              <Typography variant="h1">RPC Provider</Typography>
            </Box>
            <Box mb={2}>
              <SwarmTextInput
                label="RPC Provider"
                name="rpc-provider"
                defaultValue="https://dai.poa.network/"
                onChange={event => {
                  setRpcProvider(event.target.value)
                }}
              />
            </Box>
          </Box>
        </Card>
      </Box>
      <Card variant="outlined">
        <Box p={2}>
          <Typography variant="h1">Upgrade Node</Typography>
          {!balance && (
            <Box mt={2}>
              <Typography>Fund your node to unlock upgrading.</Typography>
            </Box>
          )}
          <Box mt={4}>
            <SwarmButton
              onClick={onUpgrade}
              iconType={ArrowUp}
              loading={loading}
              disabled={loading || !balance}
              variant="outlined"
            >
              Switch to Light Mode
            </SwarmButton>
          </Box>
        </Box>
      </Card>
    </div>
  )
}
