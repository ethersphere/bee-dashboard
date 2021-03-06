import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Typography, Paper, Button, Step, StepLabel, StepContent, Stepper, Chip } from '@material-ui/core/';
import { Check } from '@material-ui/icons';
import { StepIconProps } from '@material-ui/core/StepIcon';
import clsx from 'clsx';
import { beeDebugApi } from '../../services/bee';
import { CheckCircle, Error } from '@material-ui/icons/';

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
    'Validate Configuration', 
    'Connect to Ethereum Blockchain',
    'Deploy Chequebook',
    'Connect to Peers',
  ];
}

function getStepContent(step: number, props: any) {
  switch (step) {
    case 0:
      const nodeConnectionCheck = (
        <div>
          <p>Connect to Node APIs</p>
              <div>
                { props.nodeHealth.status === 'ok' ? 
                  <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
                  :
                  <Error style={{color:'#c9201f', marginRight: '7px', height: '18px'}} />
                }
                <span>Node API</span>
              </div>
              <div>
                { props.nodeHealth.status === 'ok' ? 
                  <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
                  :
                  <Error style={{color:'#c9201f', marginRight: '7px', height: '18px'}} />
                }
                <span>Debug API</span>
              </div>
        </div>
      )
      return nodeConnectionCheck;
    case 1:
      const nodeVersionCheck = (
        <div>
          <p>Check to make sure the latest version of <a href='https://github.com/ethersphere/bee' target='_blank'>Bee</a> is running</p>
          {props.beeRelease && props.beeRelease.name === `v${props.nodeReadiness.version?.split('-')[0]}` ?
              <span>Your running the latest version of Bee</span>
          :  
              props.loadingBeeRelease ?
              null 
              :
              <div>
              <span>Your Bee version is out of date. Please update to the <a href={props.beeRelease.html_url} target='_blank'>latest</a> before continuing. Reference the docs for help with updating. <a href='https://docs.ethswarm.org/docs/installation/manual#upgrading-bee' target='_blank'>Docs</a></span>
              </div>
          }
          <div style={{display:'flex'}}>
            <div style={{marginRight:'30px'}}>
              <p><span>Current Version</span></p>
              <Typography component="h5" variant="h5">
                <span>{props.nodeReadiness.version ? ` v${props.nodeReadiness.version}` : '-'}</span>
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
      return 'Valiadate that the API endpoints are endabled, firewall settings are correct.';
    case 3:
      return `Connect to the ethereum blockchain. Check network status`;
    default:
      return 'Connect to peers'
  }
}

export default function NodeSetupWorkflow(props: any) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  useEffect(() => {
    // nodeHealth={nodeHealth} 
    // loadingNodeHealth={loadingNodeHealth} 
    // nodeReadiness={nodeReadiness} 
    // loadingNodeReadiness={loadingNodeReadiness} 
    // nodeAddresses={nodeAddresses} 
    // loadingNodeTopology={loadingNodeTopology}
    // nodeTopology={nodeTopology}

    if (props.nodeHealth.status) {
      setActiveStep(1)
    }

    if (props.nodeHealth.version) {
      
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
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}