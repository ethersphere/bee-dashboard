import React from 'react'
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core/';
import MuiAlert from '@material-ui/lab/Alert';
import { CheckCircle, Error, ExpandMoreSharp } from '@material-ui/icons/';

import ConnectToHost from '../../../components/ConnectToHost';
import CodeBlockTabs from '../../../components/CodeBlockTabs'

export default function NodeConnectionCheck(props: any) {
    return (
        <div>
      <p>Connect to Bee Node APIs</p>
          <div style={{display:'flex', marginBottom: '25px'}}>
            { props.nodeApiHealth ? 
              <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
              :
              <Error style={{color:'#c9201f', marginRight: '7px', height: '18px'}} />
            }
            <span style={{marginRight:'15px'}}>Node API  (<a href='#'>{props.apiHost}</a>)</span>
            <ConnectToHost hostName='api_host' defaultHost={props.apiHost} />
          </div>
          <div>
          { !props.nodeApiHealth ? 
            <Typography variant="body2" gutterBottom style={{margin: '15px'}}>
              We cannot connect to your nodes API at <a href='#'>{props.apiHost}</a>. Please check the following to troubleshoot your issue.
              <Accordion style={{marginTop:'20px'}}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreSharp />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Troubleshoot</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <ol>
                        <li>Check the status of your node by running the below command to see if your node is running.</li>
                        <CodeBlockTabs
                        showLineNumbers
                        linux={`sudo systemctl status bee`}
                        mac={`brew services status swarm-bee`}
                        />
                        <li>If your node is running, check your firewall settings to make sure that port 1633 (or your custom specified port) is exposed to the internet. If your node is not running try executing the below command to start your bee node</li>
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
          :
          null}
          </div>
          <div>
            <div style={{display:'flex', marginBottom: '25px'}}>
              { props.nodeHealth.status === 'ok' ? 
                <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
                :
                <Error style={{color:'#c9201f', marginRight: '7px', height: '18px'}} />
              }
              <span style={{marginRight:'15px'}}>Debug API  (<a href='#'>{props.debugApiHost}</a>)</span>
              <ConnectToHost hostName={'debug_api_host'} defaultHost={props.debugApiHost} />
            </div>
            <div>
            { props.nodeHealth.status !== 'ok' ? 
              <Typography variant="body2" gutterBottom style={{margin: '15px'}}>
                We cannot connect to your nodes debug API at <a href='#'>{props.debugApiHost}</a>. Please check the following to troubleshoot your issue.
                <Accordion style={{marginTop:'20px'}}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreSharp />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Troubleshoot</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                    <ol>
                      <li>Check the status of your node by running the below command to see if your node is running.</li>
                      <CodeBlockTabs
                      showLineNumbers
                      linux={`sudo systemctl status bee`}
                      mac={`brew services status swarm-bee`}
                      />
                      <li>If your node is running, check your firewall settings to make sure that port 1635 (or your custom specified port) is bound to localhost. If your node is not running try executing the below command to start your bee node</li>
                      <MuiAlert style={{marginTop:'10px', marginBottom:'10px'}} elevation={6} variant="filled"  severity="error">
                        Your debug node API should never be completely open to the internet. If you want to connect remotely, make sure your firewall settings are set to only allow specific trusted IP addresses and block all other ports. A simple google search for "what is my ip" will show you your computers public IP address to allow.
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
                      mac={`brew services status swarm-bee \ntail -f /usr/local/var/log/swarm-bee/bee.log`}
                      />
                      <li>Lastly, check your nodes configuration settings to validate the debug API is enabled and the Cross Origin Resource Sharing (CORS) setting is configured to allow your host. Config parameter <strong>debug-api-enable</strong> must be set to <strong>true</strong> and <strong>cors-allowed-origins</strong> must be set to your host domain or IP. If edits are made to the configuration run the restart command below for changes to take effect.</li>
                      <CodeBlockTabs
                      showLineNumbers
                      linux={`sudo vi /etc/bee/bee.yaml\nsudo systemctl restart bee`}
                      mac={`sudo vi /etc/bee/bee.yaml \nbrew services restart swarm-bee`}
                      />
                    </ol>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Typography>
            :
            null}
            </div>
          </div>
    </div>
    )
}