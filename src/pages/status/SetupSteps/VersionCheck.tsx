import { ReactElement, useContext } from 'react'
import CodeBlockTabs from '../../../components/CodeBlockTabs'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
import StatusIcon from '../../../components/StatusIcon'
import { Context } from '../../../providers/Bee'

export default function VersionCheck(): ReactElement | null {
  const { status, isLoading, latestUserVersion, latestPublishedVersion, latestBeeVersionUrl } = useContext(Context)
  const { isEnabled, isOk } = status.version

  if (!isEnabled) return null

  return (
    <ExpandableList
      label={
        <>
          <StatusIcon isOk={isOk} isLoading={isLoading} /> Bee Version
        </>
      }
    >
      <ExpandableListItemNote>
        {isOk ? (
          'You are running the latest version of Bee.'
        ) : (
          <>
            Your Bee version is out of date. Please update to the{' '}
            <a href={latestBeeVersionUrl} rel="noreferrer" target="_blank">
              latest
            </a>{' '}
            before continuing. Rerun the installation script below to upgrade. For more information please see the{' '}
            <a href="https://docs.ethswarm.org/docs/installation/manual#upgrading-bee" rel="noreferrer" target="_blank">
              Docs
            </a>
            .
            <CodeBlockTabs
              showLineNumbers
              linux={`bee version\nwget https://github.com/ethersphere/bee/releases/download/${latestPublishedVersion}/bee_${latestPublishedVersion}_amd64.deb\nsudo dpkg -i bee_${latestPublishedVersion}_amd64.deb`}
              mac={`bee version\nbrew tap ethersphere/tap\nbrew install swarm-bee\nbrew services start swarm-bee`}
            />
          </>
        )}
      </ExpandableListItemNote>
      <ExpandableListItem label="Your Version" value={latestUserVersion || '-'} />
      <ExpandableListItem label="Latest Version" value={latestPublishedVersion || '-'} />
    </ExpandableList>
  )
}
