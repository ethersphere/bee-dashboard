import React, { ReactElement, useState } from 'react'
import { TextField, Button } from '@material-ui/core'

interface Props {
  defaultHost?: string
  setHost: (host: string) => void
}

export default function ConnectToHost(props: Props): ReactElement {
  const [hostInputVisible, toggleHostInputVisibility] = useState(false)
  const [host, setHost] = useState('')

  const handleNewHostConnection = () => {
    if (host) {
      props.setHost(host)
      toggleHostInputVisibility(!hostInputVisible)
    }
  }

  return (
    <div>
      {hostInputVisible ? (
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
      ) : (
        <Button onClick={() => toggleHostInputVisibility(!hostInputVisible)} size="small" variant="outlined">
          Change host
        </Button>
      )}
    </div>
  )
}
