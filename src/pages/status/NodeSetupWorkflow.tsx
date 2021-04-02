import { ReactElement, useEffect, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, Paper, Button, Step, StepLabel, StepContent, Stepper, StepButton } from '@material-ui/core/'
import { CheckCircle, Error, Sync, ExpandLessSharp, ExpandMoreSharp } from '@material-ui/icons/'

import DebugConnectionCheck from './SetupSteps/DebugConnectionCheck'
import NodeConnectionCheck from './SetupSteps/NodeConnectionCheck'
import VersionCheck from './SetupSteps/VersionCheck'
import EthereumConnectionCheck from './SetupSteps/EthereumConnectionCheck'
import ChequebookDeployFund from './SetupSteps/ChequebookDeployFund'
import PeerConnection from './SetupSteps/PeerConnection'
import type {
  ChequebookAddressResponse,
  ChequebookBalanceResponse,
  Health,
  NodeAddresses,
  Topology,
} from '@ethersphere/bee-js'

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
)

function getSteps() {
  return [
    'Debug Connection Check',
    'Version Check',
    'Connect to Ethereum Blockchain',
    'Deploy and Fund Chequebook',
    'Node Connection Check',
    'Connect to Peers',
  ]
}
interface Props {
  nodeHealth: Health | null
  nodeApiHealth: boolean
  nodeAddresses: NodeAddresses | null
  chequebookAddress: ChequebookAddressResponse | null
  chequebookBalance: ChequebookBalanceResponse | null
  beeRelease: LatestBeeRelease | null
  nodeTopology: Topology | null
  isLoadingBeeRelease: boolean
  isLoadingNodeHealth: boolean
  isLoadingNodeAddresses: boolean
  isLoadingNodeTopology: boolean
  isLoadingHealth: boolean
  isLoadingChequebookAddress: boolean
  isLoadingChequebookBalance: boolean
  setStatusChecksVisible: (value: boolean) => void
  apiHost: string
  debugApiHost: string
}

function getStepContent(step: number, props: Props) {
  const {
    nodeHealth,
    debugApiHost,
    beeRelease,
    isLoadingBeeRelease,
    nodeAddresses,
    isLoadingNodeAddresses,
    isLoadingChequebookBalance,
    chequebookAddress,
    chequebookBalance,
    isLoadingChequebookAddress,
    nodeApiHealth,
    apiHost,
    isLoadingNodeTopology,
    nodeTopology,
  } = props
  switch (step) {
    case 0:
      return <DebugConnectionCheck nodeHealth={nodeHealth} debugApiHost={debugApiHost} />
    case 1:
      return <VersionCheck nodeHealth={nodeHealth} beeRelease={beeRelease} isLoadingBeeRelease={isLoadingBeeRelease} />
    case 2:
      return <EthereumConnectionCheck nodeAddresses={nodeAddresses} isLoadingNodeAddresses={isLoadingNodeAddresses} />
    case 3:
      return (
        <ChequebookDeployFund
          chequebookAddress={chequebookAddress}
          chequebookBalance={chequebookBalance}
          isLoadingChequebookAddress={isLoadingChequebookAddress}
          isLoadingChequebookBalance={isLoadingChequebookBalance}
        />
      )
    case 4:
      return <NodeConnectionCheck nodeApiHealth={nodeApiHealth} apiHost={apiHost} />
    default:
      return <PeerConnection nodeTopology={nodeTopology} isLoadingNodeTopology={isLoadingNodeTopology} />
  }
}

export default function NodeSetupWorkflow(props: Props): ReactElement {
  const {
    nodeHealth,
    nodeApiHealth,
    nodeAddresses,
    chequebookAddress,
    chequebookBalance,
    beeRelease,
    nodeTopology,
    setStatusChecksVisible,
  } = props
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({})
  const steps = getSteps()

  useEffect(() => {
    const handleComplete = (index: number) => {
      const newCompleted = completed
      newCompleted[index] = true
      setCompleted(newCompleted)
    }

    const evaluateNodeStatus = () => {
      if (nodeHealth?.status === 'ok') {
        handleComplete(0)
        setActiveStep(1)
      }

      if (beeRelease && beeRelease.name === `v${nodeHealth?.version?.split('-')[0]}`) {
        handleComplete(1)
        setActiveStep(2)
      }

      if (nodeAddresses?.ethereum) {
        handleComplete(2)
        setActiveStep(3)
      }

      if (chequebookAddress?.chequebookaddress && chequebookBalance && chequebookBalance.totalBalance > 0) {
        handleComplete(3)
        setActiveStep(4)
      }

      if (nodeApiHealth) {
        handleComplete(4)
        setActiveStep(5)
      }

      if (nodeTopology?.connected && nodeTopology?.connected > 0) {
        handleComplete(5)
        setActiveStep(6)
      }
    }
    evaluateNodeStatus()
  }, [
    nodeHealth,
    nodeApiHealth,
    nodeAddresses,
    chequebookAddress,
    beeRelease,
    chequebookBalance,
    nodeTopology,
    completed,
  ])

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSetupComplete = () => {
    setStatusChecksVisible(false)
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Node Setup
        <span style={{ marginLeft: '25px' }}>
          <Button variant="outlined" size="small" onClick={() => window.location.reload()}>
            <Sync />
            <span style={{ marginLeft: '7px' }}>Refresh Checks</span>
          </Button>
        </span>
      </Typography>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              onClick={() => setActiveStep(index === activeStep ? 6 : index)}
              StepIconComponent={() => {
                if (completed[index]) {
                  return <CheckCircle style={{ color: '#32c48d', height: '25px', cursor: 'pointer' }} />
                } else {
                  return <Error style={{ color: '#c9201f', height: '25px', cursor: 'pointer' }} />
                }
              }}
            >
              <StepButton
                onClick={() => setActiveStep(index === activeStep ? 6 : index)}
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
              <Typography component="div">{getStepContent(index, props)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                    Next
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {Object.values(completed).filter(value => value).length === 6 ? (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>Bee setup complete! Welcome to the swarm and the internet of decentralized storage</Typography>
          <Button onClick={handleBack} className={classes.button}>
            Back
          </Button>
          <Button onClick={handleSetupComplete} variant="contained" color="primary" className={classes.button}>
            Complete
          </Button>
        </Paper>
      ) : null}
    </div>
  )
}
