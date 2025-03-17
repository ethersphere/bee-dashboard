import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import { BZZ, TransactionId } from '@ethersphere/bee-js'
import { useSnackbar } from 'notistack'
import { ReactElement, ReactNode, useState } from 'react'

interface Props {
  successMessage: string
  errorMessage: string
  dialogMessage: string
  label: string
  max?: BZZ
  min?: BZZ
  action: (amount: BZZ) => Promise<TransactionId>
  icon?: ReactNode
}

export default function WithdrawDepositModal({
  successMessage,
  errorMessage,
  dialogMessage,
  min,
  max,
  label,
  action,
  icon,
}: Props): ReactElement {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [amountToken, setAmountToken] = useState<BZZ | null>(null)
  const [amountError, setAmountError] = useState<Error | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true)
    e.stopPropagation()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAction = async () => {
    if (amountToken === null) return

    try {
      const transactionHash = await action(amountToken)
      setOpen(false)
      enqueueSnackbar(`${successMessage} Transaction ${transactionHash}`, { variant: 'success' })
    } catch (e) {
      console.error(e) // eslint-disable-line
      enqueueSnackbar(`${errorMessage} Error: ${(e as Error).message}`, { variant: 'error' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    setAmountError(null)
    try {
      const t = BZZ.fromDecimalString(value)
      setAmountToken(t)

      if (min && t.lt(min)) setAmountError(new Error(`Needs to be more than ${min.toSignificantDigits(4)}`))

      if (max && t.gt(max)) setAmountError(new Error(`Needs to be less than ${max.toSignificantDigits(4)}`))
    } catch (e) {
      setAmountError(e as Error)
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} startIcon={icon}>
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
              Please provide valid xBZZ amount (max 16 decimals). Error: {amountError.message}
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
