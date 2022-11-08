import { ReactElement, useContext } from 'react'

import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
import StatusIcon from '../../../components/StatusIcon'
import { useBeeDesktop } from '../../../hooks/apiHooks'
import { CheckState } from '../../../providers/Bee'
import { Context as SettingsContext } from '../../../providers/Settings'

export default function DesktopConnectionCheck(): ReactElement | null {
  const { isDesktop, desktopUrl } = useContext(SettingsContext)
  const { reachable } = useBeeDesktop(isDesktop, desktopUrl)

  return (
    <ExpandableList
      label={
        <>
          <StatusIcon checkState={reachable ? CheckState.OK : CheckState.ERROR} isLoading={false} /> Connection to Swarm
          Desktop
        </>
      }
    >
      <ExpandableListItemNote>
        {reachable
          ? 'The connection to the Swarm Desktop API has been successful'
          : 'Could not connect to the Swarm Desktop API'}
      </ExpandableListItemNote>
      <ExpandableListItem label="Swarm Desktop API" value={desktopUrl} />
    </ExpandableList>
  )
}
