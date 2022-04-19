import { Box, Card, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { ArrowUp, Send } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Token } from '../../models/Token'
import { Context as BalanceContext } from '../../providers/Balance'
import { Context as BeeContext } from '../../providers/Bee'
import { requestBzz } from '../../utils/bzz-faucet'
import { getBeeEthereumAddress, getGasFromFaucet, restartBeeNode, upgradeToLightNode } from '../../utils/desktop'

const DEFAULT_RPC_PROVIDER = 'https://xdai.fairdatasociety.org/'

export default function UpgradePage(): ReactElement {
  const { nodeInfo, chequebookAddress, nodeAddresses } = useContext(BeeContext)
  const { bzz, xdai } = useContext(BalanceContext)

  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState<boolean>(false)
  const [rpcProvider, setRpcProvider] = useState<string>(DEFAULT_RPC_PROVIDER)

  async function onFund() {
    setLoading(true)
    try {
      const address = await getBeeEthereumAddress()
      await getGasFromFaucet(address)
      enqueueSnackbar('Wallet funded successfully', { variant: 'success' })
    } finally {
      setLoading(false)
    }
  }

  async function onChequebookBzzFund() {
    if (chequebookAddress?.chequebookAddress) {
      setLoading(true)
      try {
        await requestBzz(chequebookAddress?.chequebookAddress).finally(() => setLoading(false))
        enqueueSnackbar('Successfully funded chequebook address', { variant: 'success' })
      } finally {
        setLoading(false)
      }
    }
  }

  async function onOverlayBzzFund() {
    if (nodeAddresses?.ethereum) {
      setLoading(true)
      try {
        await requestBzz(nodeAddresses?.ethereum).finally(() => setLoading(false))
        enqueueSnackbar('Successfully funded overlay address', { variant: 'success' })
      } finally {
        setLoading(false)
      }
    }
  }

  async function onUpgrade() {
    setLoading(true)
    try {
      await upgradeToLightNode(rpcProvider)
      await restartBeeNode()
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
                Your current balance is {new Token(xdai || '0', 18).toSignificantDigits(4)} xDAI and{' '}
                {new Token(bzz || '0', 16).toSignificantDigits(4)} xBZZ. Fund your node with xDAI so chequebook can be
                deployed.
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
                defaultValue={DEFAULT_RPC_PROVIDER}
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
          <Box mt={4}>
            <SwarmButton onClick={onUpgrade} iconType={ArrowUp} loading={loading} disabled={loading} variant="outlined">
              Switch to Light Mode
            </SwarmButton>
          </Box>
        </Box>
      </Card>
    </div>
  )
}
