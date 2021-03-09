import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Typography, Paper, Button, Step, StepLabel, StepContent, Stepper, Accordion, AccordionSummary, AccordionDetails, StepButton } from '@material-ui/core/';
import { CheckCircle, Error, Warning, ExpandMoreSharp, Sync } from '@material-ui/icons/';
import EthereumAddress from '../../components/EthereumAddress';
import ConnectToHost from '../../components/ConnectToHost';
import DepositModal from '../../components/DepositModal';
import CodeBlockTabs from '../../components/CodeBlockTabs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      margin: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(5),
    },
  }),
);

function getSteps() {
  return [
    'Node Connection Check', 
    'Version Check', 
    'Connect to Ethereum Blockchain',
    'Deploy and Fund Chequebook',
    'Connect to Peers',
  ];
}

function getStepContent(step: number, props: any) {

  const nodeConnectionCheck = (
    <div>
      <p>Connect to Bee Node APIs</p>
          <div style={{display:'flex', marginBottom: '25px'}}>
            { props.nodeApiHealth ? 
              <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
              :
              <Error style={{color:'#c9201f', marginRight: '7px', height: '18px'}} />
            }
            <span style={{marginRight:'15px'}}>Node API  ( <a href='#'>{props.apiHost}</a> )</span>
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
                        linux={`sudo systemctl start bee`}
                        mac={`brew services status swarm-bee`}
                        />
                        <li>If your node is running, check your firewall settings to make sure that port 1633 is exposed to the internet. If your node is not running try executing the below command to start your bee node</li>
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
              <span style={{marginRight:'15px'}}>Debug API  ( <a href='#'>{props.debugApiHost}</a> )</span>
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
                      <li>If your node is running, check your firewall settings to make sure that port 1635 is bound to localhost. If your node is not running try executing the below command to start your bee node</li>
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
                      <li>Lastly, check your nodes configuration settings to validate the debug API is enabled. Config parameter <strong>debug-api-enable</strong> must be set to <strong>true</strong></li>
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

  const nodeVersionCheck = (
    <div>
      <p>Check to make sure the latest version of <a href='https://github.com/ethersphere/bee' target='_blank'>Bee</a> is running</p>
      {props.beeRelease && props.beeRelease.name === `v${props.nodeReadiness.version?.split('-')[0]}` ?
          <div>
            <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
            <span>Your running the latest version of Bee</span>
          </div>
      :  
          props.loadingBeeRelease ?
          null 
          :
          <div>
            <Warning style={{color:'#ff9800', marginRight: '7px', height: '18px'}} />
            <span>Your Bee version is out of date. Please update to the <a href={props.beeRelease.html_url} target='_blank'>latest</a> before continuing. Rerun the installation script below to upgrade. Reference the docs for help with updating. <a href='https://docs.ethswarm.org/docs/installation/manual#upgrading-bee' target='_blank'>Docs</a></span>
            <CodeBlockTabs
            showLineNumbers
            linux={`bee version\nwget https://github.com/ethersphere/bee/releases/download/${props.beeRelease.name}/bee_${props.nodeReadiness.version?.split('-')[0]}_amd64.deb\nsudo dpkg -i bee_${props.nodeReadiness.version?.split('-')[0]}_amd64.deb`}
            mac={`bee version\nbrew tap ethersphere/tap\nbrew install swarm-bee\nbrew services start swarm-bee`}
            />
          </div>
      }
      <div style={{display:'flex'}}>
        <div style={{marginRight:'30px'}}>
          <p><span>Current Version</span></p>
          <Typography component="h5" variant="h5">
            <span>{props.nodeReadiness.version ? ` v${props.nodeReadiness.version?.split('-')[0]}` : '-'}</span>
          </Typography>
        </div>
        <div>
          <p><span>Latest Version</span></p>
          <Typography component="h5" variant="h5">
            <span>{props.beeRelease && props.beeRelease.name ? props.beeRelease.name : '-'}</span>
          </Typography>
        </div>
      </div>
    </div>
  )

  const ethereumNetworkCheck = (
    <div> 
      <p>Connect to the ethereum blockchain.</p>
      <div style={{ marginBottom:'10px' }}>
      {props.nodeAddresses.ethereum ?
          <div>
            <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
            <span>Your connected to the Ethereum network</span>
          </div>
      :  
          props.loadingNodeAddresses ?
          null 
          :
          <div>
            <Warning style={{color:'#ff9800', marginRight: '7px', height: '18px'}} />
            <span>Your not connected to the Ethereum network</span>
          </div>
      }
      </div>
      <Typography variant="subtitle1" gutterBottom>
      <span>Node Address</span>
      </Typography>
      <EthereumAddress
      address={props.nodeAddresses.ethereum}
      network={'goerli'}
      />
    </div>
  )

  const fundingAndDeploymentCheck = (
    <div> 
      <p style={{marginBottom:'20px', display:'flex'}}>
        <span style={{ marginRight:'40px'}} >Deploy chequebook and fund with BZZ</span>
        {props.chequebookAddress.chequebookaddress ?
        <DepositModal />
        : null }
      </p>
      <div style={{ marginBottom:'10px' }}>
      {props.chequebookAddress.chequebookaddress && props.chequebookBalance.totalBalance > 0 ?
          <div>
            <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
            <span>Your chequebook is deployed and funded!</span>
          </div>
      :  
          props.loadingChequebookAddress || props.isLoadingChequebookBalance ?
          null 
          :
          <div>
            <Warning style={{color:'#ff9800', marginRight: '7px', height: '18px'}} />
            <span>Your chequebook is either not deployed or funded. Run the below commands to get your address and deposit ETH.Then visit the BZZaar here <a href='#'>https://bzz.ethswarm.org/?transaction=buy&amount=10&slippage=30&receiver=[ENTER_ADDRESS_HERE] to get BZZ</a></span>
            <CodeBlockTabs
            showLineNumbers
            linux={`bee-get-addr`}
            mac={`bee-get-addr`}
            />
          </div>
      } 
      </div>
      <Typography variant="subtitle1" gutterBottom>
      <span>Chequebook Address</span>
      </Typography>
      <EthereumAddress
      address={props.chequebookAddress.chequebookaddress}
      network={'goerli'}
      />
    </div>
  )

  const connectToPeers = (
    <div> 
      <p>Connect to Peers</p>
      <div style={{ marginBottom:'10px' }}>
      {props.nodeTopology.connected && props.nodeTopology.connected > 0 ?
          <div>
            <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
            <span>Your connected to {props.nodeTopology.connected} peers!</span>
          </div>
      :  
          props.loadingNodeTopology ?
          null 
          :
          <div>
            <Warning style={{color:'#ff9800', marginRight: '7px', height: '18px'}} />
            <span>Your node is not connected to any peers</span>
          </div>
      }
      </div>
      <div style={{display:'flex'}}>
        <div style={{marginRight:'30px'}}>
          <Typography variant="subtitle1" gutterBottom color="textSecondary">
          <span>Connected Peers</span>
          </Typography>
          <Typography variant="h5" component="h2">
          { props.nodeTopology.connected }
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle1" gutterBottom color="textSecondary">
          <span>Discovered Nodes</span>
          </Typography>
          <Typography variant="h5" component="h2">
          { props.nodeTopology.population }
          </Typography>
        </div>
      </div>
    </div>
  )

  switch (step) {
    case 0:
      return nodeConnectionCheck;
    case 1:
      return nodeVersionCheck;
    case 2:
      return ethereumNetworkCheck;
    case 3:
      return fundingAndDeploymentCheck;
    default:
      return connectToPeers;
  }
}

export default function NodeSetupWorkflow(props: any) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const steps = getSteps();

  useEffect(() => {
    if (props.nodeHealth.status === 'ok' && props.nodeApiHealth) {
      setActiveStep(1)
      handleComplete(0)
    }

    if (props.beeRelease && props.beeRelease.name === `v${props.nodeHealth.version?.split('-')[0]}`) {
      setActiveStep(2)
      handleComplete(1)
    }

    if (props.nodeAddresses.ethereum) {
      setActiveStep(3)
      handleComplete(2)
    }

    if (props.chequebookAddress.chequebookaddress && props.chequebookBalance.totalBalance > 0) {
      setActiveStep(4)
      handleComplete(3)
    }

    if (props.nodeTopology.connected && props.nodeTopology.connected > 0) {
      setActiveStep(5)
      handleComplete(4)
    }

  }, [])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSetupComplete = () => {
    window.location.reload()
  };

  const handleComplete = (index: number) => {
    const newCompleted = completed;
    newCompleted[index] = true;
    setCompleted(newCompleted);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Node Setup
        <span style={{marginLeft:'25px'}}>
          <Button variant='outlined' size='small' onClick={() => window.location.reload()}><Sync/><span style={{marginLeft:'7px'}}>Refresh Checks</span></Button>
        </span>
      </Typography>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label} >
            <StepLabel>
              <StepButton onClick={() => setActiveStep(index)}>
                <div style={{display:'flex'}}>
                  { completed[index] ? 
                  <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '25px'}} />
                  :
                  <Error style={{color:'#c9201f', marginRight: '7px', height: '25px'}} />
                  }
                  <div style={{paddingTop:'2px'}}>
                  <span>{label}</span>
                  </div>
                </div>
              </StepButton>
            </StepLabel>
            <StepContent>
              <Typography>{getStepContent(index, props)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                  Next
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && Object.values(completed).filter(value => value).length === 5 ? (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>Bee setup complete - you&apos;re finished. Welcome to the swarm and the internet of decentralized storage</Typography>
          <Button
          onClick={handleBack}
          className={classes.button}
          >
            Back
          </Button>
          <Button onClick={handleSetupComplete} variant="contained" color="primary" className={classes.button}>
            Complete
          </Button>
        </Paper>
      ) : null}
    </div>
  );
}