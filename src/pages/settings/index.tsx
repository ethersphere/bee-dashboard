import React, { ReactElement, useState, useContext } from 'react'
import { Paper, Container, TextField, Typography, Button } from '@material-ui/core'
import { Context as SettingsContext } from '../../providers/Settings'

export default function Settings(): ReactElement {
  const { apiUrl, apiDebugUrl, setApiUrl, setDebugApiUrl } = useContext(SettingsContext)
  const [host, setHost] = useState(apiUrl)
  const [debugHost, setDebugHost] = useState(apiDebugUrl)

  const submit = () => {
    if (host !== apiUrl) setApiUrl(host)

    if (debugHost !== apiDebugUrl) setDebugApiUrl(apiDebugUrl)
  }

  const touched = host !== apiUrl || debugHost !== apiDebugUrl

  return (
    <div>
      <Container>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Paper>
          <TextField
            label="API Endpoint"
            style={{ margin: 0 }}
            placeholder="ex: 127.0.0.0.1:1633"
            helperText="Enter node host override / port"
            fullWidth
            defaultValue={apiUrl}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => {
              setHost(e.target.value)
            }}
            variant="filled"
          />
        </Paper>
        <Paper style={{ marginTop: '20px' }}>
          <TextField
            label="Debug API Endpoint"
            style={{ margin: 0 }}
            placeholder="ex: 127.0.0.0.1:1635"
            helperText="Enter node debug host override / port"
            fullWidth
            defaultValue={apiDebugUrl}
            onChange={e => {
              setDebugHost(e.target.value)
            }}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
          />
        </Paper>
        {touched ? (
          <div style={{ marginTop: '20px' }}>
            <Button variant="outlined" color="primary" onClick={() => submit()}>
              Save
            </Button>
          </div>
        ) : null}
      </Container>
    </div>
  )
}
