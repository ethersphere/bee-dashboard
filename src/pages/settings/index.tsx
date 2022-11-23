import CircularProgress from '@material-ui/core/CircularProgress'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext } from 'react'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { getDesktopConfiguration, restartBeeNode, setJsonRpcInDesktop } from '../../utils/desktop'

const RPC_CHANGE_SUCCESS_MESSAGE = 'RPC endpoint successfully changed'

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

      if (isDesktop) {
        const desktopConfiguration = await getDesktopConfiguration(desktopUrl)

        // We are in light mode if desktop configuration is already set.
        // We only want to update the Bee config in this case, otherwise we
        // would trigger an unwanted light node upgrade.
        if (desktopConfiguration['swap-endpoint']) {
          await setJsonRpcInDesktop(desktopUrl, value)
          const snackKey = enqueueSnackbar('RPC endpoint successfully changed, restarting Bee node...', {
            variant: 'success',
          })
          await restartBeeNode(desktopUrl)
          closeSnackbar(snackKey)
          enqueueSnackbar('Bee node restarted', { variant: 'success' })
        } else {
          enqueueSnackbar(RPC_CHANGE_SUCCESS_MESSAGE, { variant: 'success' })
        }
      } else {
        enqueueSnackbar(RPC_CHANGE_SUCCESS_MESSAGE, { variant: 'success' })
      }

      await refresh()
    } catch (e) {
      console.error(e) //eslint-disable-line
      enqueueSnackbar(`Failed to change RPC endpoint. ${e}`, { variant: 'error' })
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
