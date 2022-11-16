import CircularProgress from '@material-ui/core/CircularProgress'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext } from 'react'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { restartBeeNode, setJsonRpcInDesktop } from '../../utils/desktop'

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
    rpcProviderUrl,
    isLoading,
    isDesktop,
    desktopUrl,
    setAndPersistJsonRpcProvider,
  } = useContext(SettingsContext)
  const { refresh } = useContext(BeeContext)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  async function handleSetRpcUrl(value: string) {
    try {
      setAndPersistJsonRpcProvider(value)

      // We can't set the RPC URL to the `swap-endpoint` Bee config value unless the Bee node is already in
      // light mode as setting this config value, basically upgrades the node to light mode.
      if (isDesktop) {
        await setJsonRpcInDesktop(desktopUrl, value)
        const snackKey = enqueueSnackbar('RPC endpoint successfully changed, restarting Bee node...', {
          variant: 'success',
        })
        await restartBeeNode(desktopUrl)
        closeSnackbar(snackKey)
        enqueueSnackbar('Bee node restarted', { variant: 'success' })
      } else {
        enqueueSnackbar('RPC endpoint successfully changed', { variant: 'success' })
      }

      await refresh()
    } catch (e) {
      console.error(e) //eslint-disable-line
      enqueueSnackbar(`Failed to change RPC endpoint. Error: ${e}`, { variant: 'error' })
    }
  }

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
          value={rpcProviderUrl}
          helperText="Changing the value will restart your bee node."
          confirmLabel="Save and restart"
          onConfirm={handleSetRpcUrl}
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
