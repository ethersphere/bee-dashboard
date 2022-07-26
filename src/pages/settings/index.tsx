import CircularProgress from '@material-ui/core/CircularProgress'
import { ReactElement, useContext } from 'react'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as SettingsContext } from '../../providers/Settings'

export default function SettingsPage(): ReactElement {
  const {
    apiUrl,
    apiDebugUrl,
    setApiUrl,
    setDebugApiUrl,
    lockedApiSettings,
    config,
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

  // Run within Bee Desktop, display read only config
  if (config) {
    return (
      <ExpandableList label="Bee Desktop Settings" defaultOpen>
        <ExpandableListItemInput label="Bee API" value={config['api-addr']} locked />
        <ExpandableListItemInput label="Bee Debug API" value={config['debug-api-addr']} locked />
        <ExpandableListItemInput label="CORS" value={config['cors-allowed-origins']} locked />
        <ExpandableListItemInput label="Data DIR" value={config['data-dir']} locked />
        <ExpandableListItemInput label="ENS resolver URL" value={config['resolver-options']} locked />
        {config['swap-endpoint'] && (
          <ExpandableListItemInput
            label="Blockchain RPC URL"
            value={config['swap-endpoint']}
            onConfirm={setAndPersistJsonRpcProvider}
          />
        )}
      </ExpandableList>
    )
  }

  return (
    <ExpandableList label="API Settings" defaultOpen>
      <ExpandableListItemInput label="Bee API" value={apiUrl} onConfirm={setApiUrl} locked={lockedApiSettings} />
      <ExpandableListItemInput
        label="Bee Debug API"
        value={apiDebugUrl}
        onConfirm={setDebugApiUrl}
        locked={lockedApiSettings}
      />
    </ExpandableList>
  )
}
