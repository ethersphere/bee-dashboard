import type { ReactElement } from 'react'
import { Typography } from '@material-ui/core/'
import CodeBlockTabs from '../../../components/CodeBlockTabs'

type Props = StatusNodeVersionHook

export default function VersionCheck({ isOk, userVersion, latestVersion, latestUrl }: Props): ReactElement | null {
  const version = (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '30px' }}>
        <p>
          <span>User Version</span>
        </p>
        <Typography component="h5" variant="h5">
          <span>{userVersion}</span>
        </Typography>
      </div>
      <div>
        <p>
          <span>Latest Version</span>
        </p>
        <Typography component="h5" variant="h5">
          <span>{latestVersion}</span>
        </Typography>
      </div>
    </div>
  )

  // Running latest bee version
  if (isOk) {
    return (
      <>
        <span>You are running the latest version of Bee</span>
        {version}
      </>
    )
  }

  // Old version or not connected to bee debug API
  return (
    <>
      <span>
        Your Bee version is out of date. Please update to the{' '}
        <a href={latestUrl} rel="noreferrer" target="_blank">
          latest
        </a>{' '}
        before continuing. Rerun the installation script below to upgrade. Reference the docs for help with updating.{' '}
        <a href="https://docs.ethswarm.org/docs/installation/manual#upgrading-bee" rel="noreferrer" target="_blank">
          Docs
        </a>
      </span>
      <CodeBlockTabs
        showLineNumbers
        linux={`bee version\nwget https://github.com/ethersphere/bee/releases/download/${latestVersion}/bee_${latestVersion}_amd64.deb\nsudo dpkg -i bee_${latestVersion}_amd64.deb`}
        mac={`bee version\nbrew tap ethersphere/tap\nbrew install swarm-bee\nbrew services start swarm-bee`}
      />
      {version}
    </>
  )
}
