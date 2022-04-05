import { Box, Card, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { ArrowUp, Send } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Token } from '../../models/Token'
import { Context } from '../../providers/Bee'
import { requestBzz } from '../../utils/bzz-faucet'
import { getJson, postJson } from '../../utils/net'
import { Rpc } from '../../utils/rpc'

export default function UpgradePage(): ReactElement {
  const { nodeInfo, chequebookAddress, nodeAddresses } = useContext(Context)

  const { enqueueSnackbar } = useSnackbar()

  const [balance, setBalance] = useState<string | null>(null)
  const [balanceBzz, setBalanceBzz] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [rpcProvider, setRpcProvider] = useState<string>('https://rpc.gnosischain.com/')

  const port = parseInt(window.location.host.split(':')[1], 10)

  useEffect(() => {
    getJson(`http://localhost:${port}/status`)
      .then(status => Rpc.eth_getBalance(status.address))
      .then(balance => setBalance(balance))

    getJson(`http://localhost:${port}/status`)
      .then(status => Rpc.eth_getBalanceERC20(status.address))
      .then(balanceBzz => setBalanceBzz(balanceBzz))
  }, [port])

  async function onFund() {
    setLoading(true)
    try {
      const { address } = await getJson(`http://localhost:${port}/status`)
      await fetch(`http://getxdai.co/${address}/0.1`, {
        method: 'POST',
      })
      const balance = await Rpc.eth_getBalance(address)
      setBalance(balance)
      const balanceBzz = await Rpc.eth_getBalance(address)
      setBalanceBzz(balanceBzz)
      enqueueSnackbar('Wallet funded successfully', { variant: 'success' })
    } finally {
      setLoading(false)
    }
  }

  async function onChequebookBzzFund() {
    if (chequebookAddress?.chequebookAddress) {
      setLoading(true)
      await requestBzz(chequebookAddress?.chequebookAddress).finally(() => setLoading(false))
      enqueueSnackbar('Successfully funded chequebook address', { variant: 'success' })
    }
  }

  async function onOverlayBzzFund() {
    if (nodeAddresses?.ethereum) {
      setLoading(true)
      await requestBzz(nodeAddresses?.ethereum).finally(() => setLoading(false))
      enqueueSnackbar('Successfully funded overlay address', { variant: 'success' })
    }
  }

  async function onUpgrade() {
    setLoading(true)
    try {
      await postJson(`http://localhost:${port}/config`, {
        'chain-enable': true,
        'swap-enable': true,
        'swap-endpoint': rpcProvider,
      })
      await postJson(`http://localhost:${port}/restart`)
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
                Your current balance is {new Token(balance || '0', 18).toSignificantDigits(4)} xDAI and{' '}
                {new Token(balanceBzz || '0', 16).toSignificantDigits(4)} xBZZ. Fund your node with xDAI so chequebook
                can be deployed.
              </Typography>
            </Box>
            <ExpandableListItemActions>
              <SwarmButton onClick={onFund} iconType={Send} loading={loading} disabled={loading} variant="outlined">
                Fund xDAI
              </SwarmButton>
              {chequebookAddress?.chequebookAddress &&
                chequebookAddress?.chequebookAddress !== '0x0000000000000000000000000000000000000000' && (
                  <SwarmButton
                    onClick={onChequebookBzzFund}
                    iconType={Send}
                    loading={loading}
                    disabled={loading}
                    variant="outlined"
                  >
                    Fund xBZZ (Chequebook)
                  </SwarmButton>
                )}
              <SwarmButton
                onClick={onOverlayBzzFund}
                iconType={Send}
                loading={loading}
                disabled={loading}
                variant="outlined"
              >
                Fund xBZZ (Overlay)
              </SwarmButton>
            </ExpandableListItemActions>
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
                defaultValue="https://rpc.gnosischain.com/"
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
