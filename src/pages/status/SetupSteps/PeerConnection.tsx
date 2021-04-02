import React from 'react'
import { Typography } from '@material-ui/core/'
import { CheckCircle, Warning } from '@material-ui/icons/'

export default function PeerConnection(props: any) {
  return (
    <div>
      <p>Connect to Peers</p>
      <div style={{ marginBottom: '10px' }}>
        {props.nodeTopology?.connected && props.nodeTopology?.connected > 0 ? (
          <div>
            <CheckCircle style={{ color: '#32c48d', marginRight: '7px', height: '18px' }} />
            <span>Your connected to {props.nodeTopology.connected} peers!</span>
          </div>
        ) : props.loadingNodeTopology ? null : (
          <div>
            <Warning style={{ color: '#ff9800', marginRight: '7px', height: '18px' }} />
            <span>Your node is not connected to any peers</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '30px' }}>
          <Typography component="div" variant="subtitle1" gutterBottom color="textSecondary">
            <span>Connected Peers</span>
          </Typography>
          <Typography component="h2" variant="h5">
            {props.nodeTopology?.connected}
          </Typography>
        </div>
        <div>
          <Typography component="div" variant="subtitle1" gutterBottom color="textSecondary">
            <span>Discovered Nodes</span>
          </Typography>
          <Typography component="h2" variant="h5">
            {props.nodeTopology?.population}
          </Typography>
        </div>
      </div>
    </div>
  )
}
