import { ReactElement, useState, useContext } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { TextField, Typography, Button } from '@material-ui/core'
import { Context as SettingsContext } from '../../providers/Settings'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      margin: 0,
      marginTop: theme.spacing(4),
    },
  }),
)

export default function Settings(): ReactElement {
  const classes = useStyles()
  const { apiUrl, apiDebugUrl, setApiUrl, setDebugApiUrl } = useContext(SettingsContext)
  const [host, setHost] = useState(apiUrl)
  const [debugHost, setDebugHost] = useState(apiDebugUrl)

  const submit = () => {
    if (host !== apiUrl) setApiUrl(host)

    if (debugHost !== apiDebugUrl) setDebugApiUrl(debugHost)
  }

  const touched = host !== apiUrl || debugHost !== apiDebugUrl

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <TextField
        label="API Endpoint"
        className={classes.item}
        placeholder="ex: 127.0.0.0.1:1633"
        fullWidth
        defaultValue={apiUrl}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={e => {
          setHost(e.target.value)
        }}
      />
      <TextField
        label="Debug API Endpoint"
        className={classes.item}
        placeholder="ex: 127.0.0.0.1:1635"
        fullWidth
        defaultValue={apiDebugUrl}
        onChange={e => {
          setDebugHost(e.target.value)
        }}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      {touched && (
        <Button variant="outlined" color="primary" className={classes.item} onClick={submit}>
          Save
        </Button>
      )}
    </>
  )
}
