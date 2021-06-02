import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, Chip, Button } from '@material-ui/core/'
import { CheckCircle, Error, ArrowRight, ArrowDropUp } from '@material-ui/icons/'
import { NodeAddresses, Topology } from '@ethersphere/bee-js'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column',
    },
    status: {
      color: '#2145a0',
      backgroundColor: '#e1effe',
    },
  }),
)

interface Props {
  nodeAddresses: NodeAddresses | null
  nodeTopology: Topology | null
  userBeeVersion?: string
  isLatestBeeVersion: boolean
  isOk: boolean
  latestUrl: string
}

function StatusCard({
  userBeeVersion,
  nodeAddresses,
  nodeTopology,
  isOk,
  isLatestBeeVersion,
  latestUrl,
}: Props): ReactElement | null {
  const classes = useStyles()

  const [underlayAddressesVisible, setUnderlayAddresessVisible] = useState<boolean>(false)

  return (
    <Card>
      <CardContent className={classes.root}>
        <Typography component="h5" variant="h5" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {isOk && (
            <div>
              <CheckCircle style={{ color: '#32c48d', marginRight: '7px' }} />
              <span>Your Bee node is running as expected</span>
            </div>
          )}
          {!isOk && (
            <div>
              <Error style={{ color: '#c9201f', marginRight: '7px' }} />
              <span>Could not connect to Bee Node</span>
            </div>
          )}
        </Typography>
        {isOk && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ marginRight: '20px' }}>Discovered Nodes: {nodeTopology?.population}</span>
              <span style={{ marginRight: '20px' }}>
                <span>Connected Peers: </span>
                <Link to="/peers/">{nodeTopology?.connected}</Link>
              </span>
            </div>
            <div>
              <Typography component="div" variant="subtitle2" gutterBottom>
                <span>AGENT: </span>
                <a href="https://github.com/ethersphere/bee" rel="noreferrer" target="_blank">
                  Bee
                </a>{' '}
                <span>{userBeeVersion || '-'}</span>
                {isLatestBeeVersion ? (
                  <Chip
                    style={{ marginLeft: '7px', color: '#2145a0' }}
                    size="small"
                    label="latest"
                    className={classes.status}
                  />
                ) : (
                  <Button size="small" variant="outlined" href={latestUrl}>
                    update
                  </Button>
                )}
              </Typography>
              <Typography component="div" variant="subtitle2" gutterBottom>
                <span>PUBLIC KEY: </span>
                <span>{nodeAddresses?.publicKey ? nodeAddresses.publicKey : '-'}</span>
              </Typography>
              <Typography component="div" variant="subtitle2" gutterBottom>
                <span>PSS PUBLIC KEY: </span>
                <span>{nodeAddresses?.pssPublicKey ? nodeAddresses.pssPublicKey : '-'}</span>
              </Typography>
              <Typography component="div" variant="subtitle2" gutterBottom>
                <span>OVERLAY ADDRESS (PEER ID): </span>
                <span>{nodeAddresses?.overlay ? nodeAddresses.overlay : '-'}</span>
              </Typography>
              <Typography component="div" variant="subtitle2" gutterBottom>
                <Typography component="div" onClick={() => setUnderlayAddresessVisible(!underlayAddressesVisible)}>
                  <Button color="primary" style={{ padding: 0, marginTop: '6px' }}>
                    {underlayAddressesVisible ? (
                      <ArrowDropUp style={{ fontSize: '12px' }} />
                    ) : (
                      <ArrowRight style={{ fontSize: '12px' }} />
                    )}
                    <span>Underlay Addresses</span>
                  </Button>
                </Typography>
                {underlayAddressesVisible && (
                  <div>
                    {nodeAddresses?.underlay.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </div>
                )}
              </Typography>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default StatusCard
