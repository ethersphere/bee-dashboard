import { BeeDebug } from '@ethersphere/bee-js'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Input from '@material-ui/core/Input'
import { useSnackbar } from 'notistack'
import { ReactElement, ReactNode, useState } from 'react'
import { SwarmSelect } from './SwarmSelect'

interface Props {
  label: string
  icon: ReactNode
  beeDebug: BeeDebug
  stamp: string
}

export default function StampExtensionModal({ label, icon, beeDebug, stamp }: Props): ReactElement {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'Topup' | 'Dilute'>('Topup')
  const { enqueueSnackbar } = useSnackbar()

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
        await beeDebug.topUpBatch(stamp, amount)
        enqueueSnackbar(`Successfully topped up stamp, your changes will appear soon`, { variant: 'success' })
      } catch (error) {
        enqueueSnackbar(`Failed to topup stamp: ${error || 'Unknown reason'}`, { variant: 'error' })
      }
    }

    if (type === 'Dilute') {
      try {
        await beeDebug.diluteBatch(stamp, parseInt(amount, 10))
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
    <div>
      <Button variant="contained" onClick={handleClickOpen} startIcon={icon}>
        {label}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{label}</DialogTitle>
        <DialogContent>
          <SwarmSelect
            label="Action"
            defaultValue="Topup"
            onChange={event => setType(event.target.value as 'Topup' | 'Dilute')}
            options={[
              { value: 'Topup', label: 'Topup' },
              { value: 'Dilute', label: 'Dilute' },
            ]}
          />
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
          <Button onClick={handleAction} color="primary">
            {type}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
