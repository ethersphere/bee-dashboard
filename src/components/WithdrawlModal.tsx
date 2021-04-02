import React from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Snackbar } from '@material-ui/core'

import { beeDebugApi } from '../services/bee'

export default function WithdrawlModal() {
  const [open, setOpen] = React.useState(false)
  const [amount, setAmount] = React.useState(BigInt(0))
  const [showToast, setToastVisibility] = React.useState(false)
  const [toastContent, setToastContent] = React.useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleWithdraw = () => {
    if (amount > 0) {
      beeDebugApi.chequebook
        .withdraw(amount)
        .then(res => {
          setOpen(false)
          handleToast(`Successful withdrawl. Transaction ${res.transactionHash}`)
        })
        .catch(error => {
          handleToast('Error with withdrawl')
        })
    } else {
      handleToast('Must be amount of greater than 0')
    }
  }

  const handleToast = (text: string) => {
    setToastContent(text)
    setToastVisibility(true)
    setTimeout(() => setToastVisibility(false), 7000)
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Withdraw
      </Button>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={showToast} message={toastContent} />
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Withdraw Funds</DialogTitle>
        <DialogContent>
          <DialogContentText>Specify the amount you would like to withdraw from your node.</DialogContentText>
          <Input
            autoFocus
            margin="dense"
            id="name"
            type="number"
            placeholder="Amount"
            fullWidth
            onChange={e => setAmount(BigInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleWithdraw} color="primary">
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
