import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, Chip, Button } from '@material-ui/core/'
import { CheckCircle, Error, ArrowRight, ArrowDropUp } from '@material-ui/icons/'
import { Skeleton } from '@material-ui/lab'
import { useApiNodeTopology, useDebugApiHealth, useApiNodeAddresses, useLatestBeeRelease } from '../../hooks/apiHooks'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flex: '1 0 auto',

      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    status: {
      color: '#2145a0',
      backgroundColor: '#e1effe',
    },
  }),
)

function StatusCard(): ReactElement | null {
  const classes = useStyles()

  const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()
  const { nodeAddresses, isLoadingNodeAddresses } = useApiNodeAddresses()
  const { topology: nodeTopology, isLoading: isLoadingNodeTopology } = useApiNodeTopology()
  const { latestBeeRelease, isLoadingLatestBeeRelease } = useLatestBeeRelease()

  const [underlayAddressesVisible, setUnderlayAddresessVisible] = useState<boolean>(false)

  if (isLoadingNodeHealth || isLoadingNodeAddresses || isLoadingNodeTopology || isLoadingLatestBeeRelease) {
    return (
      <div style={{ padding: '16px' }}>
        <Skeleton width={650} height={32} animation="wave" />
        <Skeleton width={650} height={24} animation="wave" />
        <Skeleton width={650} height={24} animation="wave" />
      </div>
    )
  }

  if (nodeHealth === null || nodeAddresses === null || nodeTopology === null || latestBeeRelease === null) return null

  return (
    <div>
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {nodeHealth.status === 'ok' ? (
                <div>
                  <CheckCircle style={{ color: '#32c48d', marginRight: '7px' }} />
                  <span>Your Bee node is running as expected</span>
                </div>
              ) : (
                <div>
                  <Error style={{ color: '#c9201f', marginRight: '7px' }} />
                  <span>Could not connect to Bee Node</span>
                </div>
              )}
            </Typography>
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
                </a>
                <span>{nodeHealth?.version ? ` v${nodeHealth.version}` : '-'}</span>
                {
                  // FIXME: this should be broken up
                  /* eslint-disable no-nested-ternary */
                  latestBeeRelease && latestBeeRelease.name === `v${nodeHealth?.version?.split('-')[0]}` ? (
                    <Chip
                      style={{ marginLeft: '7px', color: '#2145a0' }}
                      size="small"
                      label="latest"
                      className={classes.status}
                    />
                  ) : isLoadingLatestBeeRelease ? (
                    ''
                  ) : (
                    <Typography variant="button">update</Typography>
                  )
                  /* eslint-enable no-nested-ternary */
                }
              </Typography>
              <Typography component="div" variant="subtitle2" gutterBottom>
                <span>PUBLIC KEY: </span>
                <span>{nodeAddresses?.public_key ? nodeAddresses.public_key : '-'}</span>
              </Typography>
              <Typography component="div" variant="subtitle2" gutterBottom>
                <span>PSS PUBLIC KEY: </span>
                <span>{nodeAddresses?.pss_public_key ? nodeAddresses.pss_public_key : '-'}</span>
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
                {underlayAddressesVisible ? (
                  <div>
                    {nodeAddresses?.underlay.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </div>
                ) : null}
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default StatusCard
