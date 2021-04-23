import { ReactElement, useEffect, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, Paper, Button, Step, StepLabel, StepContent, Stepper, StepButton } from '@material-ui/core/'
import { CheckCircle, Error, Sync, ExpandLessSharp, ExpandMoreSharp, Autorenew } from '@material-ui/icons/'

import DebugConnectionCheck from './SetupSteps/DebugConnectionCheck'
import NodeConnectionCheck from './SetupSteps/NodeConnectionCheck'
import VersionCheck from './SetupSteps/VersionCheck'
import EthereumConnectionCheck from './SetupSteps/EthereumConnectionCheck'
import ChequebookDeployFund from './SetupSteps/ChequebookDeployFund'
import PeerConnection from './SetupSteps/PeerConnection'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      margin: theme.spacing(2),
    },
  }),
)

interface Step {
  label: string
  condition: boolean
  isLoading: boolean
  component: ReactElement
}

interface Props {
  nodeVersion: StatusNodeVersionHook
  ethereumConnection: StatusEthereumConnectionHook
  debugApiConnection: StatusHookCommon
  apiConnection: StatusHookCommon
  topology: StatusTopologyHook
  chequebook: StatusChequebookHook
}

export default function NodeSetupWorkflow({
  nodeVersion,
  ethereumConnection,
  debugApiConnection,
  apiConnection,
  topology,
  chequebook,
}: Props): ReactElement {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(-1)

  const steps: Step[] = [
    {
      label: 'Connected to Node DebugAPI',
      condition: debugApiConnection.isOk,
      isLoading: debugApiConnection.isLoading,
      component: <DebugConnectionCheck {...debugApiConnection} />,
    },
    {
      label: 'Running latest Bee version',
      condition: nodeVersion.isOk,
      isLoading: nodeVersion.isLoading,
      component: <VersionCheck {...nodeVersion} />,
    },
    {
      label: 'Connected to Ethereum Blockchain',
      condition: ethereumConnection.isOk,
      isLoading: ethereumConnection.isLoading,
      component: <EthereumConnectionCheck {...ethereumConnection} />,
    },
    {
      label: 'Deployed and Funded Chequebook',
      condition: chequebook.isOk,
      isLoading: chequebook.isLoading,
      component: <ChequebookDeployFund ethereumAddress={ethereumConnection.nodeAddresses?.ethereum} {...chequebook} />,
    },
    {
      label: 'Connected to Node API',
      condition: apiConnection.isOk,
      isLoading: apiConnection.isLoading,
      component: <NodeConnectionCheck {...apiConnection} />,
    },
    {
      label: 'Connected to Peers',
      condition: topology.isOk,
      isLoading: topology.isLoading,
      component: <PeerConnection {...topology} />,
    },
  ]

  useEffect(() => {
    // If the user already changed the active step we don't want to overwrite it
    if (activeStep > 0 && activeStep < steps.length) return

    // Select first step that is not OK
    for (let i = 0; i < steps.length; ++i) {
      if (!steps[i].condition) {
        setActiveStep(i)

        return
      }
    }
  }, [steps])

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Node Setup
        <span style={{ marginLeft: '25px' }}>
          <Button variant="outlined" size="small" onClick={() => window.location.reload()}>
            <Sync />
            <span style={{ marginLeft: '7px' }}>Refresh Checks</span>
          </Button>
        </span>
      </Typography>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map(({ label, condition, component, isLoading }, index) => (
          <Step key={label}>
            <StepLabel
              disabled={isLoading}
              onClick={() => setActiveStep(index === activeStep ? steps.length : index)}
              StepIconComponent={() => {
                if (isLoading) return <Autorenew style={{ height: '25px', cursor: 'pointer' }} />

                if (condition) return <CheckCircle style={{ color: '#32c48d', height: '25px', cursor: 'pointer' }} />

                return <Error style={{ color: '#c9201f', height: '25px', cursor: 'pointer' }} />
              }}
            >
              <StepButton
                disabled={isLoading}
                onClick={() => setActiveStep(index === activeStep ? steps.length : index)}
                style={{ justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex' }}>
                  <div style={{ marginTop: '5px' }}>{label}</div>
                  <div style={{ marginLeft: '12px' }}>
                    {index === activeStep ? <ExpandLessSharp /> : <ExpandMoreSharp />}
                  </div>
                </div>
              </StepButton>
            </StepLabel>
            <StepContent>
              <Typography component="div">{component}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                    {index < steps.length - 1 ? 'Next' : 'Finish'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  )
}
