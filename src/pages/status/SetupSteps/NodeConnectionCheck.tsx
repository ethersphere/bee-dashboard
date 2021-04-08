import React, { ReactElement } from 'react'
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core/'
import { CheckCircle, Error, ExpandMoreSharp } from '@material-ui/icons/'

import ConnectToHost from '../../../components/ConnectToHost'
import CodeBlockTabs from '../../../components/CodeBlockTabs'
import { useStatusConnection } from '../../../hooks/status'
import { apiHost } from '../../../constants'

export default function NodeConnectionCheck(): ReactElement | null {
  const { isLoading, isOk } = useStatusConnection()

  if (isLoading) return null

  return (
    <div>
      <p>Connect to Bee Node API</p>
      <div style={{ display: 'flex', marginBottom: '25px' }}>
        {isOk ? (
          <CheckCircle style={{ color: '#32c48d', marginRight: '7px', height: '18px' }} />
        ) : (
          <Error style={{ color: '#c9201f', marginRight: '7px', height: '18px' }} />
        )}
        <span style={{ marginRight: '15px' }}>
          Node API (<Typography variant="button">{apiHost}</Typography>)
        </span>
        <ConnectToHost hostName="api_host" defaultHost={apiHost} />
      </div>
      <div>
        {!isOk ? (
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
                    <CodeBlockTabs
                      showLineNumbers
                      linux={`sudo systemctl status bee`}
                      mac={`brew services status swarm-bee`}
                    />
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
                      mac={`brew services status swarm-bee \ntail -f /usr/local/var/log/swarm-bee/bee.log`}
                    />
                  </ol>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Typography>
        ) : null}
      </div>
    </div>
  )
}
