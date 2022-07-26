import CircularProgress from '@material-ui/core/CircularProgress'
import { ReactElement, useContext } from 'react'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as SettingsContext } from '../../providers/Settings'
import config from '../../config'

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
    setAndPersistJsonRpcProvider,
  } = useContext(SettingsContext)

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
        <ExpandableListItemInput label="Bee API" value={apiUrl} onConfirm={setApiUrl} locked={lockedApiSettings} />
        <ExpandableListItemInput
          label="Bee Debug API"
          value={apiDebugUrl}
          onConfirm={setDebugApiUrl}
          locked={lockedApiSettings}
        />
        <ExpandableListItemInput
          label="Blockchain RPC URL"
          value={providerUrl}
          onConfirm={setAndPersistJsonRpcProvider}
        />
      </ExpandableList>
      {config.BEE_DESKTOP_ENABLED && (
        <ExpandableList label="Desktop Settings" defaultOpen>
          <ExpandableListItemInput label="CORS" value={cors ?? '-'} locked />
          <ExpandableListItemInput label="Data DIR" value={dataDir ?? '-'} locked />
          <ExpandableListItemInput label="ENS resolver URL" value={ensResolver ?? '-'} locked />
        </ExpandableList>
      )}
    </>
  )
}
