import { ReactElement, useState } from 'react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormHelperText from '@material-ui/core/FormHelperText'
import { Token } from '../models/Token'
import type { BigNumber } from 'bignumber.js'
import { useSnackbar } from 'notistack'

interface Props {
  successMessage: string
  errorMessage: string
  dialogMessage: string
  label: string
  max?: BigNumber
  min?: BigNumber
  action: (amount: bigint) => Promise<string>
}

export default function WithdrawModal({
  successMessage,
  errorMessage,
  dialogMessage,
  min,
  max,
  label,
  action,
}: Props): ReactElement {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [amountToken, setAmountToken] = useState<Token | null>(null)
  const [amountError, setAmountError] = useState<Error | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAction = async () => {
    if (amountToken === null) return

    try {
      const transactionHash = await action(amountToken.toBigInt as bigint)
      setOpen(false)
      enqueueSnackbar(`${successMessage} Transaction ${transactionHash}`, { variant: 'success' })
    } catch (e) {
      enqueueSnackbar(`${errorMessage} Error: ${e.message}`, { variant: 'error' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    setAmountError(null)
    try {
      const t = Token.fromDecimal(value)
      setAmountToken(t)

      if (min && t.toDecimal.isLessThan(min)) setAmountError(new Error(`Needs to be more than ${min}`))

      if (max && t.toDecimal.isGreaterThan(max)) setAmountError(new Error(`Needs to be less than ${max}`))
    } catch (e) {
      setAmountError(e)
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {label}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{label}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
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
          <Button onClick={handleAction} color="primary">
            {label}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
