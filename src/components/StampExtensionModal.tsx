import { Bee, PostageBatch } from '@ethersphere/bee-js'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Input from '@mui/material/Input'
import { useSnackbar } from 'notistack'
import React, { ReactElement, ReactNode, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import { CheckState } from '../providers/Bee'

const useStyles = makeStyles()(theme => ({
  buttonSelected: {
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.secondary.main,
      backgroundColor: 'white',
      '@media (hover: none)': {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  buttonUnselected: {
    color: '#dd7700',
    backgroundColor: 'white',
  },
}))

export enum StampExtensionType {
  Topup = 'Topup',
  Dilute = 'Dilute',
}

interface Props {
  type: StampExtensionType
  icon: ReactNode
  bee: Bee
  stamp: PostageBatch
  status: CheckState
}

export default function StampExtensionModal({ type, icon, bee, stamp, status }: Props): ReactElement {
  const { classes } = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const label = `${type} ${stamp.batchID.toHex().substring(0, 8)}`

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true)
    e.stopPropagation()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAction = async () => {
    if (status !== CheckState.OK) {
      enqueueSnackbar(`Node connection status is not ${CheckState.OK}: ${status}`, { variant: 'error' })

      return
    }

    if (type === StampExtensionType.Topup) {
      const isAmountInvalid = BigInt(amount) <= BigInt(0)

      if (isAmountInvalid) {
        enqueueSnackbar(`Invalid amount: ${amount}, it must be greate than 0`, { variant: 'error' })

        return
      }

      try {
        await bee.topUpBatch(stamp.batchID, amount)
        enqueueSnackbar(`Successfully topped up stamp, your changes will appear soon`, { variant: 'success' })
      } catch (error) {
        enqueueSnackbar(`Failed to topup stamp: ${error || 'Unknown reason'}`, { variant: 'error' })
      }

      return
    }

    if (type === StampExtensionType.Dilute) {
      const newDepth = parseInt(amount, 10)
      const ttlDays = stamp.duration.toDays()
      const currentDepth = stamp.depth
      const maxHalvings = Math.floor(Math.log2(ttlDays)) + currentDepth
      const isDepthInvalid = newDepth > maxHalvings || newDepth <= currentDepth

      if (isDepthInvalid) {
        enqueueSnackbar(`Invalid depth: ${newDepth} (${currentDepth} < new depth < ${maxHalvings})`, {
          variant: 'error',
        })

        return
      }

      if (ttlDays <= 2) {
        enqueueSnackbar(`TTL: ${ttlDays} <= 2 days, cannot dilute stamp (min. TTL is 1 day)`, {
          variant: 'warning',
        })

        return
      }

      try {
        await bee.diluteBatch(stamp.batchID, newDepth)
        enqueueSnackbar(`Successfully diluted stamp, your changes will appear soon`, { variant: 'success' })
      } catch (error) {
        enqueueSnackbar(`Failed to dilute stamp: ${error || 'Unknown reason'}`, { variant: 'error' })
      }

      return
    }

    enqueueSnackbar(`Failed to extend stamp, unknown operation: ${type}`, { variant: 'error' })
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setAmount(event.target.value)
  }

  return (
    <Box mb={2}>
      <Button className={classes.buttonSelected} variant="contained" onClick={handleClickOpen} startIcon={icon}>
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
            placeholder={type === StampExtensionType.Topup ? 'Amount to add' : 'New depth to dilute'}
            fullWidth
            value={amount}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={amount === ''}
            onClick={async () => {
              await handleAction()
              handleClose()
            }}
            color="primary"
          >
            {type}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
