import { CircularProgress, Container } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import Zap from 'remixicon-react/FlashlightLineIcon'

import { Context as SettingsContext } from '../providers/Settings'

interface Props {
  peerId: string
  uncashedAmount: string
}

export default function CheckoutModal({ peerId, uncashedAmount }: Props): ReactElement {
  const [open, setOpen] = useState<boolean>(false)
  const [loadingCashout, setLoadingCashout] = useState<boolean>(false)
  const { beeApi } = useContext(SettingsContext)
  const { enqueueSnackbar } = useSnackbar()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCashout = () => {
    if (peerId && beeApi) {
      setLoadingCashout(true)
      beeApi
        .cashoutLastCheque(peerId)
        .then(res => {
          setOpen(false)
          enqueueSnackbar(<span>Successfully cashed out cheque. Transaction {res.toHex()}</span>, {
            variant: 'success',
          })
        })
        .catch((e: Error) => {
          // eslint-disable-next-line no-console
          console.error(e)
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
                Are you sure you want to cashout <strong>{uncashedAmount} xBZZ</strong> from Peer{' '}
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
