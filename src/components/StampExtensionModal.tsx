import { Box } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Input from '@material-ui/core/Input'
import { BatchId, Bee } from '@ethersphere/bee-js'
import { useSnackbar } from 'notistack'
import { ReactElement, ReactNode, useState } from 'react'

interface Props {
  type: 'Topup' | 'Dilute'
  icon: ReactNode
  bee: Bee
  stamp: BatchId
}

export default function StampExtensionModal({ type, icon, bee, stamp }: Props): ReactElement {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const label = `${type} ${stamp.toHex().substring(0, 8)}`

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true)
    e.stopPropagation()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAction = async () => {
    if (type === 'Topup') {
      try {
        await bee.topUpBatch(stamp, amount)
        enqueueSnackbar(`Successfully topped up stamp, your changes will appear soon`, { variant: 'success' })
      } catch (error) {
        enqueueSnackbar(`Failed to topup stamp: ${error || 'Unknown reason'}`, { variant: 'error' })
      }
    }

    if (type === 'Dilute') {
      try {
        await bee.diluteBatch(stamp, parseInt(amount, 10))
        enqueueSnackbar(`Successfully diluted stamp, your changes will appear soon`, { variant: 'success' })
      } catch (error) {
        enqueueSnackbar(`Failed to dilute stamp: ${error || 'Unknown reason'}`, { variant: 'error' })
      }
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setAmount(event.target.value)
  }

  return (
    <Box mb={2}>
      <Button variant="contained" onClick={handleClickOpen} startIcon={icon}>
        {type}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{label}</DialogTitle>
        <DialogContent>
          <Input
            autoFocus
            margin="dense"
            id="name"
            type="text"
            placeholder={type === 'Topup' ? 'Amount to add' : 'New depth to dilute'}
            fullWidth
            value={amount}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={amount === ''} onClick={handleAction} color="primary">
            {type}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
