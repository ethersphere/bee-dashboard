import { ReactElement, useContext } from 'react'

import CodeBlockTabs from '../../../components/CodeBlockTabs'
import { Context as SettingsContext } from '../../../providers/Settings'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemNote from '../../../components/ExpandableListItemNote'
import ExpandableListItemInput from '../../../components/ExpandableListItemInput'
import StatusIcon from '../../../components/StatusIcon'
import { CheckState, Context } from '../../../providers/Bee'

export default function NodeConnectionCheck(): ReactElement | null {
  const { setApiUrl, apiUrl } = useContext(SettingsContext)
  const { status, isLoading } = useContext(Context)
  const { isEnabled, isOk } = status.apiConnection

  if (!isEnabled) return null

  return (
    <ExpandableList
      label={
        <>
          <StatusIcon isOk={isOk} isLoading={isLoading} /> Connection to Bee API
        </>
      }
    >
      <ExpandableListItemNote>
        {isOk === CheckState.OK
          ? 'The connection to the Bee nodes API has been successful'
          : 'Could not connect to your Bee nodes API. Please check the troubleshoot below on how you may resolve it.'}
      </ExpandableListItemNote>
      <ExpandableListItemInput label="Bee API" value={apiUrl} onConfirm={setApiUrl} />
      {isOk === CheckState.ERROR && (
        <ExpandableList level={1} label="Troubleshoot">
          <ExpandableListItem
            label={
              <ol>
                <li>Check the status of your node by running the below command to see if your node is running.</li>
                <CodeBlockTabs showLineNumbers linux={`sudo systemctl status bee`} mac={`brew services list`} />
                <li>
                  If your node is running, check your firewall settings to make sure that port 1633 (or your custom
                  specified port) is exposed to the internet. If your node is not running try executing the below
                  command to start your bee node
                </li>
                <CodeBlockTabs
                  showLineNumbers
                  linux={`sudo systemctl start bee`}
                  mac={`brew services start swarm-bee`}
                />
                <li>Run the commands to validate your node is running and see the log output.</li>
                <CodeBlockTabs
                  showLineNumbers
                  linux={`sudo systemctl status bee \njournalctl --lines=100 --follow --unit bee`}
                  mac={`brew services list \ntail -f /usr/local/var/log/swarm-bee/bee.log`}
                />
              </ol>
            }
          />
        </ExpandableList>
      )}
    </ExpandableList>
  )
}
