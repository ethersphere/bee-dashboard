import type { ReactElement } from 'react'
import CodeBlockTabs from '../../../components/CodeBlockTabs'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'

type Props = StatusNodeVersionHook

export default function VersionCheck({ isOk, userVersion, latestVersion, latestUrl }: Props): ReactElement | null {
  return (
    <ExpandableList label={'Bee Version'}>
      <ExpandableListItemNote>
        {isOk ? (
          'You are running the latest version of Bee.'
        ) : (
          <>
            Your Bee version is out of date. Please update to the{' '}
            <a href={latestUrl} rel="noreferrer" target="_blank">
              latest
            </a>{' '}
            before continuing. Rerun the installation script below to upgrade. For more information please see the{' '}
            <a href="https://docs.ethswarm.org/docs/installation/manual#upgrading-bee" rel="noreferrer" target="_blank">
              Docs
            </a>
            .
            <CodeBlockTabs
              showLineNumbers
              linux={`bee version\nwget https://github.com/ethersphere/bee/releases/download/${latestVersion}/bee_${latestVersion}_amd64.deb\nsudo dpkg -i bee_${latestVersion}_amd64.deb`}
              mac={`bee version\nbrew tap ethersphere/tap\nbrew install swarm-bee\nbrew services start swarm-bee`}
            />
          </>
        )}
      </ExpandableListItemNote>
      <ExpandableListItem label="Your Version" value={userVersion || '-'} />
      <ExpandableListItem label="Latest Version" value={latestVersion || '-'} />
    </ExpandableList>
  )
}
