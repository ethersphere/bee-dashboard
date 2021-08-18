import React, { ReactElement } from 'react'
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core/'
import { ExpandMoreSharp } from '@material-ui/icons/'

import ConnectToHost from '../../../components/ConnectToHost'
import CodeBlockTabs from '../../../components/CodeBlockTabs'
import { apiHost } from '../../../constants'

type Props = StatusHookCommon

export default function NodeConnectionCheck({ isOk }: Props): ReactElement | null {
  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '25px' }}>
        <span style={{ marginRight: '15px' }}>
          Node API (<Typography variant="button">{apiHost}</Typography>)
        </span>
        <ConnectToHost hostName="api_host" defaultHost={apiHost} />
      </div>
      <div>
        {!isOk && (
          <Typography component="div" variant="body2" gutterBottom style={{ margin: '15px' }}>
            We cannot connect to your nodes API at <Typography variant="button">{apiHost}</Typography>. Please check the
            following to troubleshoot your issue.
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
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Typography>
        )}
      </div>
    </div>
  )
}
