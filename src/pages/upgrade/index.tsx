import { Box, Typography } from '@material-ui/core'
import { ReactElement, useEffect, useState } from 'react'
import { Send } from 'react-feather'
import { Loading } from '../../components/Loading'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'

export default function UpgradePage(): ReactElement {
  const [node, setNode] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [rpcProvider, setRpcProvider] = useState<string>('https://dai.poa.network/')

  useEffect(() => {
    fetch('http://localhost:1635/node')
      .then(r => r.json())
      .then(json => setNode(json))
  }, [])

  async function onFund() {
    setLoading(true)
    try {
      const status = await fetch('http://localhost:5000/status').then(r => r.json())
      const { address } = status
      const balanceResponse = await fetch(rpcProvider, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1,
        }),
      }).then(r => r.json())
      const result = balanceResponse.result
      const xdai = parseInt(result, 16)

      if (xdai >= 10000000000000000) {
        setLoading(false)

        return
      }
      await fetch(`http://getxdai.co/${address}/0.01`, {
        method: 'POST',
      })
    } finally {
      setLoading(false)
    }
  }

  async function onUpgrade() {
    setLoading(true)
    try {
      await fetch('http://localhost:5000/config', {
        method: 'PATCH',
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
    } finally {
      setLoading(false)
    }
  }

  if (!node) {
    return <Loading />
  }

  if (node.beeMode !== 'ultra-light') {
    return (
      <div>
        <Typography>Already upgraded</Typography>
      </div>
    )
  }

  return (
    <div>
      <Box mb={4}>
        <SwarmButton onClick={onFund} iconType={Send} loading={loading} disabled={loading}>
          Fund
        </SwarmButton>
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
      <SwarmButton onClick={onUpgrade} iconType={Send} loading={loading} disabled={loading}>
        Upgrade to Light Node
      </SwarmButton>
    </div>
  )
}
