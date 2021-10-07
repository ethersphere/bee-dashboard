import { ReactElement, useContext } from 'react'
import { Context as SettingsContext } from '../../providers/Settings'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'

export default function Settings(): ReactElement {
  const { apiUrl, apiDebugUrl, setApiUrl, setDebugApiUrl } = useContext(SettingsContext)

  return (
    <ExpandableList label="API Settings" defaultOpen>
      <ExpandableListItemInput label="Bee API" value={apiUrl} onConfirm={setApiUrl} />
      <ExpandableListItemInput label="Bee Debug API" value={apiDebugUrl} onConfirm={setDebugApiUrl} />
    </ExpandableList>
  )
}
