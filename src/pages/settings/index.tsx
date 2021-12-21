import { ReactElement, useContext } from 'react'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as SettingsContext } from '../../providers/Settings'

export default function Settings(): ReactElement {
  const { apiUrl, apiDebugUrl, setApiUrl, setDebugApiUrl, lockedApiSettings } = useContext(SettingsContext)

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
