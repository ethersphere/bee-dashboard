import { ReactElement, useState } from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { FormHelperText, Snackbar } from '@material-ui/core'

import { beeDebugApi } from '../services/bee'
import { Token } from '../models/Token'

export default function WithdrawlModal(): ReactElement {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [amountToken, setAmountToken] = useState<Token | null>(null)
  const [amountError, setAmountError] = useState<Error | null>(null)
  const [showToast, setToastVisibility] = useState(false)
  const [toastContent, setToastContent] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleWithdraw = async () => {
    if (amountToken?.toBigNumber.isGreaterThan(0)) {
      try {
        const { transactionHash } = await beeDebugApi.chequebook.withdraw(amountToken.toBigInt)
        setOpen(false)
        handleToast(`Successful withdrawl. Transaction ${transactionHash}`)
      } catch (e) {
        // FIXME: should probably detail the error
        handleToast(`Error with withdrawing. Error: ${e.message}`)
      }
    } else handleToast('Must be amount of greater than 0')
  }

  const handleToast = (text: string) => {
    setToastContent(text)
    setToastVisibility(true)
    setTimeout(() => setToastVisibility(false), 7000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    setAmountError(null)
    try {
      const t = Token.fromDecimal(value)
      setAmountToken(t)
    } catch (e) {
      setAmountError(e)
    }
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
          <DialogContentText>Specify the amount of BZZ you would like to withdraw from your node.</DialogContentText>
          <Input
            autoFocus
            margin="dense"
            id="name"
            type="text"
            placeholder="Amount"
            fullWidth
            value={amount}
            onChange={handleChange}
          />
          {amountError && (
            <FormHelperText error>
              Please provide valid BZZ amount (max 16 decimals). Error: {amountError.message}
            </FormHelperText>
          )}
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
