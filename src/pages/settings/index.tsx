import CircularProgress from '@material-ui/core/CircularProgress'
import { ReactElement, useContext } from 'react'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { useSnackbar } from 'notistack'

export default function SettingsPage(): ReactElement {
  const {
    apiUrl,
    apiDebugUrl,
    setApiUrl,
    setDebugApiUrl,
    lockedApiSettings,
    cors,
    dataDir,
    ensResolver,
    providerUrl,
    isLoading,
    isDesktop,
    setAndPersistJsonRpcProvider,
  } = useContext(SettingsContext)
  const { refresh } = useContext(BeeContext)
  const { enqueueSnackbar } = useSnackbar()

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <ExpandableList label="API Settings" defaultOpen>
        <ExpandableListItemInput
          label="Bee API"
          value={apiUrl}
          onConfirm={setApiUrl}
          locked={lockedApiSettings || isDesktop}
        />
        <ExpandableListItemInput
          label="Bee Debug API"
          value={apiDebugUrl}
          onConfirm={setDebugApiUrl}
          locked={lockedApiSettings || isDesktop}
        />
        <ExpandableListItemInput
          label="Blockchain RPC URL"
          value={providerUrl}
          helperText="Changing the value will restart your bee node."
          confirmLabel="Save and restart"
          onConfirm={value => {
            setAndPersistJsonRpcProvider(value)
              .then(() => {
                refresh()
                enqueueSnackbar('Settings changed, restarting bee node...', { variant: 'success' })
              })
              .catch(error => {
                console.log(error) //eslint-disable-line
                enqueueSnackbar(`Failed to change RPC endpoint. Error: ${error}`, { variant: 'success' })
              })
          }}
        />
      </ExpandableList>
      {isDesktop && (
        <ExpandableList label="Desktop Settings" defaultOpen>
          <ExpandableListItemInput label="CORS" value={cors ?? '-'} locked />
          <ExpandableListItemInput label="Data DIR" value={dataDir ?? '-'} locked />
          <ExpandableListItemInput label="ENS resolver URL" value={ensResolver ?? '-'} locked />
        </ExpandableList>
      )}
    </>
  )
}
