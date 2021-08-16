import type { ReactElement } from 'react'
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core/'
import MuiAlert from '@material-ui/lab/Alert'
import { ExpandMoreSharp } from '@material-ui/icons/'

import ConnectToHost from '../../../components/ConnectToHost'
import CodeBlockTabs from '../../../components/CodeBlockTabs'
import { debugApiHost } from '../../../constants'

type Props = StatusHookCommon

export default function NodeConnectionCheck({ isOk }: Props): ReactElement | null {
  const changeDebugApiUrl = (
    <div style={{ display: 'flex', marginTop: '25px', marginBottom: '25px' }}>
      <span style={{ marginRight: '15px' }}>
        Debug API (<Typography variant="button">{debugApiHost}</Typography>)
      </span>
      <ConnectToHost hostName={'debug_api_host'} defaultHost={debugApiHost} />
    </div>
  )

  if (isOk) {
    return changeDebugApiUrl
  }

  return (
    <div>
      {changeDebugApiUrl}

      <div>
        <Typography component="div" variant="body2" gutterBottom style={{ margin: '15px' }}>
          We cannot connect to your nodes debug API at <Typography variant="button">{debugApiHost}</Typography>. Please
          check the following to troubleshoot your issue.
          <Accordion style={{ marginTop: '20px' }}>
            <AccordionSummary expandIcon={<ExpandMoreSharp />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography>Troubleshoot</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                <ol>
                  <li>Check the status of your node by running the below command to see if your node is running.</li>
                  <CodeBlockTabs showLineNumbers linux={`sudo systemctl status bee`} mac={`brew services list`} />
                  <li>
                    If your node is running, check your firewall settings to make sure that port 1635 (or your custom
                    specified port) is bound to localhost. If your node is not running try executing the below command
                    to start your bee node
                  </li>
                  <MuiAlert
                    style={{ marginTop: '10px', marginBottom: '10px' }}
                    elevation={6}
                    variant="filled"
                    severity="error"
                  >
                    Your debug node API should never be completely open to the internet. If you want to connect
                    remotely, make sure your firewall settings are set to only allow specific trusted IP addresses and
                    block all other ports. A simple google search for &quot;what is my ip&quot; will show you your
                    computers public IP address to allow.
                  </MuiAlert>
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
                  <li>
                    Lastly, check your nodes configuration settings to validate the debug API is enabled and the Cross
                    Origin Resource Sharing (CORS) setting is configured to allow your host. Config parameter{' '}
                    <strong>debug-api-enable</strong> must be set to <strong>true</strong> and{' '}
                    <strong>cors-allowed-origins</strong> must be set to your host domain or IP (you can also use the
                    wildcard <code>{"cors-allowed-origins: ['*']"}</code>). If edits are made to the configuration run
                    the restart command below for changes to take effect.
                  </li>
                  <CodeBlockTabs
                    showLineNumbers
                    linux={`sudo vi /etc/bee/bee.yaml\nsudo systemctl restart bee`}
                    mac={`sudo vi /usr/local/etc/swarm-bee/bee.yaml \nbrew services restart swarm-bee`}
                  />
                </ol>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Typography>
      </div>
    </div>
  )
}
