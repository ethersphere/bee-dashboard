import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Typography, Paper, Button, Step, StepLabel, StepContent, Stepper, Chip } from '@material-ui/core/';
import { CheckCircle, Error, Warning } from '@material-ui/icons/';
import EthereumAddress from '../../components/EthereumAddress';

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
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
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
  switch (step) {
    case 0:
      const nodeConnectionCheck = (
        <div>
          <p>Connect to Bee Node APIs</p>
              <div>
                { props.nodeApiHealth ? 
                  <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
                  :
                  <Error style={{color:'#c9201f', marginRight: '7px', height: '18px'}} />
                }
                <span>Node API  (<a href='#'>{process.env.REACT_APP_BEE_HOST}</a>)</span>
              </div>
              <div>
                { props.nodeHealth.status === 'ok' ? 
                  <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
                  :
                  <Error style={{color:'#c9201f', marginRight: '7px', height: '18px'}} />
                }
                <span>Debug API  (<a href='#'>{process.env.REACT_APP_BEE_DEBUG_HOST}</a>)</span>
              </div>
        </div>
      )
      return nodeConnectionCheck;
    case 1:
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
                <span>Your Bee version is out of date. Please update to the <a href={props.beeRelease.html_url} target='_blank'>latest</a> before continuing. Reference the docs for help with updating. <a href='https://docs.ethswarm.org/docs/installation/manual#upgrading-bee' target='_blank'>Docs</a></span>
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
      return nodeVersionCheck;
    case 2:
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
      return ethereumNetworkCheck;
    case 3:
      const fundingAndDeploymentCheck = (
        <div> 
          <p>Deploy chequebook and fund with BZZ</p>
          <div style={{ marginBottom:'10px' }}>
          {props.chequebookAddress.chequebookaddress ?
              <div>
                <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
                <span>Your chequebook is deployed and funded!</span>
              </div>
          :  
              props.loadingChequebookAddress ?
              null 
              :
              <div>
                <Warning style={{color:'#ff9800', marginRight: '7px', height: '18px'}} />
                <span>Your chequebook is not deployed and funded</span>
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
      return fundingAndDeploymentCheck;
    default:
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
      return connectToPeers;
  }
}

export default function NodeSetupWorkflow(props: any) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  useEffect(() => {
    if (props.nodeHealth.status === 'ok' && props.nodeApiHealth) {
      setActiveStep(1)
    }

    if (props.beeRelease && props.beeRelease.name === `v${props.nodeHealth.version?.split('-')[0]}`) {
      setActiveStep(2)
    }

    if (props.nodeAddresses.ethereum) {
      setActiveStep(3)
    }

    if (props.chequebookAddress.chequebookaddress) {
      setActiveStep(4)
    }

    if (props.nodeTopology.connected && props.nodeTopology.connected > 0) {
      setActiveStep(5)
    }

  }, [])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Node Setup
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
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
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>Bee setup complete - you&apos;re finished. Welcome to decentralized storage</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}