import { ReactElement, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Snackbar, Container, CircularProgress } from '@material-ui/core'

import { beeDebugApi } from '../services/bee'

import EthereumAddress from './EthereumAddress'
import { fromBZZbaseUnit } from '../utils'

interface Props {
  peerId: string
  uncashedAmount: number
}

export default function DepositModal({ peerId, uncashedAmount }: Props): ReactElement {
  const [open, setOpen] = useState<boolean>(false)
  const [loadingCashout, setLoadingCashout] = useState<boolean>(false)
  const [showToast, setToastVisibility] = useState<boolean>(false)
  const [toastContent, setToastContent] = useState<JSX.Element | null>(null)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCashout = () => {
    if (peerId) {
      setLoadingCashout(true)
      beeDebugApi.chequebook
        .peerCashout(peerId)
        .then(res => {
          setOpen(false)
          handleToast(
            <span>
              Successfully cashed out cheque. Transaction
              <EthereumAddress hideBlockie transaction address={res.transactionHash} network={'goerli'} />
            </span>,
          )
        })
        .catch(() => {
          // FIXME: handle errors more gracefully
          handleToast(<span>Error with cashout</span>)
        })
        .finally(() => {
          setLoadingCashout(false)
        })
    } else {
      handleToast(<span>Peer Id invalid</span>)
    }
  }

  const handleToast = (text: JSX.Element) => {
    setToastContent(text)
    setToastVisibility(true)
    setTimeout(() => setToastVisibility(false), 7000)
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginLeft: '7px' }}>
        Cashout
      </Button>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={showToast} message={toastContent} />
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Cashout Cheque</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginTop: '20px', overflowWrap: 'break-word' }}>
            {loadingCashout && (
              <>
                <span>
                  Cashing out <strong>{fromBZZbaseUnit(uncashedAmount).toFixed(7)}</strong> from Peer{' '}
                  <strong>{peerId}</strong>. Please wait...
                </span>
                <Container style={{ textAlign: 'center', padding: '50px' }}>
                  <CircularProgress />
                </Container>
              </>
            )}
            {!loadingCashout && (
              <span>
                Are you sure you want to cashout <strong>{fromBZZbaseUnit(uncashedAmount).toFixed(7)} BZZ</strong> from
                Peer <strong>{peerId}</strong>?
              </span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCashout} color="primary" disabled={loadingCashout}>
            Yes Cashout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
