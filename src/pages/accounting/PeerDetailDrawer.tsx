import React, { ReactElement, useState } from 'react'
import { Paper, Container, Drawer, Button, Typography, CircularProgress, Grid } from '@material-ui/core'
import ClipboardCopy from '../../components/ClipboardCopy'
import { beeDebugApi } from '../../services/bee'
import EthereumAddress from '../../components/EthereumAddress'
import { fromBZZbaseUnit } from '../../utils'
import { LastCashoutActionResponse, LastChequesForPeerResponse } from '@ethersphere/bee-js'

function truncStringPortion(str: string, firstCharCount = 10, endCharCount = 10) {
  let convertedStr = ''
  convertedStr += str.substring(0, firstCharCount)
  convertedStr += '.'.repeat(3)
  convertedStr += str.substring(str.length - endCharCount, str.length)

  return convertedStr
}

interface Props {
  peerId: string
}

export default function Index(props: Props): ReactElement {
  const [open, setOpen] = useState(false)
  const [peerCashout, setPeerCashout] = useState<LastCashoutActionResponse | null>(null)
  const [peerCheque, setPeerCheque] = useState<LastChequesForPeerResponse | null>(null)

  const [isLoadingPeerCheque, setIsLoadingPeerCheque] = useState<boolean>(false)
  const [isLoadingPeerCashout, setIsLoadingPeerCashout] = useState<boolean>(false)

  const handleClickOpen = (peerId: string) => {
    setIsLoadingPeerCashout(true)
    beeDebugApi.chequebook
      .getPeerLastCashout(peerId)
      .then(res => {
        setPeerCashout(res)
      })
      .catch(() => {
        // FIXME: handle the error
      })
      .finally(() => {
        setIsLoadingPeerCashout(false)
      })

    setIsLoadingPeerCheque(true)
    beeDebugApi.chequebook
      .getPeerLastCheques(peerId)
      .then(res => {
        setPeerCheque(res)
      })
      .catch(() => {
        // FIXME: handle the error
      })
      .finally(() => {
        setIsLoadingPeerCheque(false)
      })

    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button color="primary" onClick={() => handleClickOpen(props.peerId)}>
        {truncStringPortion(props.peerId)}
      </Button>
      <Drawer anchor={'right'} open={open} onClose={handleClose}>
        <div style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom style={{ display: 'flex' }}>
            <span>Peer: {truncStringPortion(props.peerId)}</span>
            <ClipboardCopy value={props.peerId} />
          </Typography>
          <Paper>
            {isLoadingPeerCashout || isLoadingPeerCheque ? (
              <Container style={{ textAlign: 'center', padding: '50px' }}>
                <CircularProgress />
              </Container>
            ) : (
              <div style={{ textAlign: 'left', padding: '10px' }}>
                <h3>Last Cheque</h3>
                <Grid container spacing={1}>
                  <Grid key={1} item xs={12} sm={12} xl={6}>
                    <h5>Last Sent</h5>
                    <p>
                      Payout:
                      <span style={{ marginBottom: '0px', fontFamily: 'monospace, monospace' }}>
                        {' '}
                        {peerCheque?.lastsent?.payout ? fromBZZbaseUnit(peerCheque?.lastsent?.payout) : '-'}
                      </span>
                    </p>
                    <p>
                      Beneficiary:
                      <EthereumAddress network={'goerli'} hideBlockie address={peerCheque?.lastsent?.beneficiary} />
                    </p>
                    <p>
                      Chequebook:
                      <EthereumAddress network={'goerli'} hideBlockie address={peerCheque?.lastsent?.chequebook} />
                    </p>
                  </Grid>
                  <Grid key={1} item xs={12} sm={12} xl={6}>
                    <h5>Last Received</h5>
                    <p>
                      Payout:
                      <span style={{ marginBottom: '0px', fontFamily: 'monospace, monospace' }}>
                        {' '}
                        {peerCheque?.lastreceived?.payout ? fromBZZbaseUnit(peerCheque?.lastreceived?.payout) : '-'}
                      </span>
                    </p>
                    <p>
                      Beneficiary:
                      <EthereumAddress network={'goerli'} hideBlockie address={peerCheque?.lastreceived?.beneficiary} />
                    </p>
                    <p>
                      Chequebook:
                      <EthereumAddress network={'goerli'} hideBlockie address={peerCheque?.lastreceived?.chequebook} />
                    </p>
                  </Grid>
                </Grid>
                <h3>Last Cashout</h3>
                {peerCashout && peerCashout?.cumulativePayout > 0 ? (
                  <div>
                    <p>
                      Cumulative Payout:
                      <span style={{ marginBottom: '0px', fontFamily: 'monospace, monospace' }}>
                        {peerCashout?.cumulativePayout ? fromBZZbaseUnit(peerCashout?.cumulativePayout) : '-'}
                      </span>
                    </p>
                    <p>
                      Last Payout:
                      <span style={{ marginBottom: '0px', fontFamily: 'monospace, monospace' }}>
                        {' '}
                        {peerCashout?.result.lastPayout ? fromBZZbaseUnit(peerCashout?.result.lastPayout) : '-'}
                      </span>
                      <span> {peerCashout?.result.bounced ? 'Bounced' : ''}</span>
                    </p>
                    <p>
                      Beneficiary:
                      <EthereumAddress network={'goerli'} hideBlockie address={peerCashout?.beneficiary} />
                    </p>
                    <p>
                      Chequebook:
                      <EthereumAddress network={'goerli'} hideBlockie address={peerCashout?.chequebook} />
                    </p>
                    <p>
                      Recipient:
                      <EthereumAddress network={'goerli'} hideBlockie address={peerCashout?.result.recipient} />
                    </p>
                    <p>
                      Transaction:
                      <EthereumAddress
                        transaction
                        network={'goerli'}
                        hideBlockie
                        address={peerCashout?.transactionHash}
                      />
                    </p>
                  </div>
                ) : (
                  'None'
                )}
              </div>
            )}
          </Paper>
        </div>
      </Drawer>
    </div>
  )
}
