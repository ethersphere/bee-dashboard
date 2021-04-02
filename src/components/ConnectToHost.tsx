import React, { ReactElement, useState } from 'react'
import { TextField, Button, CircularProgress, Container } from '@material-ui/core'

interface Props {
  defaultHost?: string
  hostName: string
}

export default function ConnectToHost(props: Props): ReactElement {
  const [hostInputVisible, toggleHostInputVisibility] = useState(false)
  const [connectingToHost, setConnectingToHost] = useState(false)
  const [host, setHost] = useState('')

  const handleNewHostConnection = () => {
    if (host) {
      setConnectingToHost(true)
      sessionStorage.setItem(props.hostName, host)
      toggleHostInputVisibility(!hostInputVisible)
      window.location.reload()
    }
  }

  return (
    <div>
      {
        // FIXME: this should be broken up
        /* eslint-disable no-nested-ternary */
        hostInputVisible ? (
          <div style={{ display: 'flex' }}>
            <TextField
              defaultValue={props.defaultHost}
              label="Enter host"
              variant="outlined"
              size="small"
              onChange={e => setHost(e.target.value)}
              style={{ marginRight: '15px', minWidth: '300px' }}
            />
            <Button onClick={() => handleNewHostConnection()} size="small" variant="outlined">
              Connect
            </Button>
            <Button
              style={{ marginLeft: '7px' }}
              onClick={() => toggleHostInputVisibility(!hostInputVisible)}
              size="small"
            >
              Cancel
            </Button>
          </div>
        ) : connectingToHost ? (
          <Container style={{ textAlign: 'center', padding: '0px' }}>
            <CircularProgress size={20} />
          </Container>
        ) : (
          <Button onClick={() => toggleHostInputVisibility(!hostInputVisible)} size="small" variant="outlined">
            Change host
          </Button>
        )
        /* eslint-enable no-nested-ternary */
      }
    </div>
  )
}
