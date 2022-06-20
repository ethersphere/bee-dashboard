import { CircularProgress, Container } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import Zap from 'remixicon-react/FlashlightLineIcon'
import { Context as SettingsContext } from '../providers/Settings'
import EthereumAddress from './EthereumAddress'

interface Props {
  peerId: string
  uncashedAmount: string
}

export default function CheckoutModal({ peerId, uncashedAmount }: Props): ReactElement {
  const [open, setOpen] = useState<boolean>(false)
  const [loadingCashout, setLoadingCashout] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const { beeDebugApi } = useContext(SettingsContext)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCashout = () => {
    if (!beeDebugApi) return

    if (peerId) {
      setLoadingCashout(true)
      beeDebugApi
        .cashoutLastCheque(peerId)
        .then(res => {
          setOpen(false)
          enqueueSnackbar(
            <span>
              Successfully cashed out cheque. Transaction
              <EthereumAddress hideBlockie transaction address={res} />
            </span>,
            { variant: 'success' },
          )
        })
        .catch((e: Error) => {
          enqueueSnackbar(<span>Error: {e.message}</span>, { variant: 'error' })
        })
        .finally(() => {
          setLoadingCashout(false)
        })
    } else {
      enqueueSnackbar(<span>Peer Id invalid</span>, { variant: 'error' })
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<Zap size="1rem" />}>
        Cash out peer {peerId.slice(0, 8)}[…]
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Cashout Cheque</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginTop: '20px', overflowWrap: 'break-word' }}>
            {loadingCashout && (
              <>
                <span>
                  Cashing out <strong>{uncashedAmount}</strong> from Peer <strong>{peerId}</strong>. Please wait...
                </span>
                <Container style={{ textAlign: 'center', padding: '50px' }}>
                  <CircularProgress />
                </Container>
              </>
            )}
            {!loadingCashout && (
              <span>
                Are you sure you want to cashout <strong>{uncashedAmount} BZZ</strong> from Peer{' '}
                <strong>{peerId}</strong>?
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
