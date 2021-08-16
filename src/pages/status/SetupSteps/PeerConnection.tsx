import type { ReactElement } from 'react'
import { Typography } from '@material-ui/core/'

type Props = StatusTopologyHook

export default function PeerConnection({ isOk, topology }: Props): ReactElement | null {
  const peers = (
    <div style={{ display: 'flex', marginTop: '15px' }}>
      <div style={{ marginRight: '30px' }}>
        <Typography component="div" variant="subtitle1" gutterBottom color="textSecondary">
          <span>Connected Peers</span>
        </Typography>
        <Typography component="h2" variant="h5">
          {topology?.connected ? topology.connected : '-'}
        </Typography>
      </div>
      <div>
        <Typography component="div" variant="subtitle1" gutterBottom color="textSecondary">
          <span>Discovered Nodes</span>
        </Typography>
        <Typography component="h2" variant="h5">
          {topology?.population ? topology.population : '-'}
        </Typography>
      </div>
    </div>
  )

  if (isOk) {
    return (
      <>
        <span>You are connected to peers!</span>
        {peers}
      </>
    )
  }

  return (
    <>
      <span>Your node is not connected to any peers</span>
      {peers}
    </>
  )
}
