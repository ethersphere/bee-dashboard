import { ReactElement } from 'react'

import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography } from '@material-ui/core/'

import EthereumAddress from '../components/EthereumAddress'

import type { ChequebookAddressResponse, NodeAddresses } from '@ethersphere/bee-js'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
  }),
)

interface Props {
  nodeAddresses: NodeAddresses | null
  chequebookAddress: ChequebookAddressResponse | null
}

function EthereumAddressCard(props: Props): ReactElement {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant="subtitle1" gutterBottom>
            Ethereum Address
          </Typography>
          <EthereumAddress address={props.nodeAddresses?.ethereum} />
        </CardContent>
      </div>

      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant="subtitle1" gutterBottom>
            Chequebook Contract Address
          </Typography>
          <EthereumAddress address={props.chequebookAddress?.chequebookAddress} />
        </CardContent>
      </div>
    </Card>
  )
}

export default EthereumAddressCard
