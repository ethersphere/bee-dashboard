import { ReactElement, useState } from 'react'
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

interface Step {
  label: string
  condition: boolean
  component: ReactElement
}

export default function NodeSetupWorkflow(props: Props): ReactElement {
  const {
    debugApiHost,
    nodeHealth,
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
    setStatusChecksVisible,
  } = props
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)

  const steps: Step[] = [
    {
      label: 'Debug Connection Check',
      condition: nodeHealth?.status === 'ok',
      component: <DebugConnectionCheck nodeHealth={nodeHealth} debugApiHost={debugApiHost} />,
    },
    {
      label: 'Version Check',
      condition: beeRelease !== null && beeRelease.name === `v${nodeHealth?.version?.split('-')[0]}`,
      component: (
        <VersionCheck nodeHealth={nodeHealth} beeRelease={beeRelease} isLoadingBeeRelease={isLoadingBeeRelease} />
      ),
    },
    {
      label: 'Connect to Ethereum Blockchain',
      condition: nodeAddresses !== null,
      component: (
        <EthereumConnectionCheck nodeAddresses={nodeAddresses} isLoadingNodeAddresses={isLoadingNodeAddresses} />
      ),
    },
    {
      label: 'Deploy and Fund Chequebook',
      condition:
        chequebookAddress !== null &&
        Boolean(chequebookAddress.chequebookaddress) &&
        chequebookBalance !== null &&
        chequebookBalance.totalBalance > 0,
      component: (
        <ChequebookDeployFund
          chequebookAddress={chequebookAddress}
          chequebookBalance={chequebookBalance}
          isLoadingChequebookAddress={isLoadingChequebookAddress}
          isLoadingChequebookBalance={isLoadingChequebookBalance}
        />
      ),
    },
    {
      label: 'Node Connection Check',
      condition: nodeApiHealth,
      component: <NodeConnectionCheck nodeApiHealth={nodeApiHealth} apiHost={apiHost} />,
    },
    {
      label: 'Connect to Peers',
      condition: nodeTopology !== null && nodeTopology?.connected > 0,
      component: <PeerConnection nodeTopology={nodeTopology} isLoadingNodeTopology={isLoadingNodeTopology} />,
    },
  ]

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
        {steps.map(({ label, condition, component }, index) => (
          <Step key={label}>
            <StepLabel
              onClick={() => setActiveStep(index === activeStep ? steps.length : index)}
              StepIconComponent={() =>
                condition ? (
                  <CheckCircle style={{ color: '#32c48d', height: '25px', cursor: 'pointer' }} />
                ) : (
                  <Error style={{ color: '#c9201f', height: '25px', cursor: 'pointer' }} />
                )
              }
            >
              <StepButton
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
                    Next
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {Object.values(steps).every(s => s.condition) ? (
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
