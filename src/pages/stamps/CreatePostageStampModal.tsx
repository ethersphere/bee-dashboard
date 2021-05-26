import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import BigNumber from 'bignumber.js'
import { beeApi } from '../../services/bee'

interface FormValues {
  depth?: string
  amount?: string
  label?: string
}
type FormKeys = keyof FormValues
type Validators<T extends FormValues> = { [key in keyof T]: (value: T[key]) => string | undefined }

const initialFormValues: FormValues = {
  depth: '',
  amount: '',
  label: '',
}

const validators: Validators<FormValues> = {
  depth: (value: string | undefined) => {
    if (!value) return 'Required field'

    const depth = new BigNumber(value)

    if (!depth.isInteger()) return 'Depth must be an integer'

    if (depth.isLessThan(16)) return 'Minimal depth is 16'

    return undefined
  },
  amount: (value: string | undefined) => {
    if (!value) return 'Required field'

    const depth = new BigNumber(value)

    if (!depth.isInteger()) return 'Amount must be an integer'

    if (depth.isLessThanOrEqualTo(0)) return 'Amount must be greater than 0'

    return undefined
  },
  label: (value: string | undefined) => {
    if (value && !/^[0-9a-z]*$/i.test(value)) return 'Label must be an alphanumeric string'

    return undefined
  },
}

export default function FormDialog(): ReactElement {
  const [open, setOpen] = React.useState(false)

  const [values, setValues] = useState<FormValues>(initialFormValues)
  const [errors, setErrors] = useState<FormValues>()
  const [hasErrors, setHasErrors] = useState<boolean>(false)
  useEffect(() => {
    setHasErrors(errors ? Object.values(errors).some(e => Boolean(e)) : false)
  }, [errors])

  const resetForm = () => {
    setValues(initialFormValues)
    setErrors({})
  }

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const submitForm = async () => {
    if (!values.depth) return

    const amount = BigInt(values.amount)
    const depth = Number.parseInt(values.depth)
    const options = values.label ? { label: values.label } : undefined

    await beeApi.stamps.buyPostageStamp(amount, depth, options)
    resetForm()
    handleClose()
  }

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    if (Object.keys(initialFormValues).includes(name)) {
      const key = name as FormKeys
      setValues({ ...values, [key]: value })

      const validator = validators[key]

      if (validator) setErrors({ ...errors, [key]: validator(value) })
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Buy Postage Stamp
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Purchase new postage stamp</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Provide the depth, amount and optionally the label of the postage stamp. Please refer to the{' '}
            <a href="https://docs.ethswarm.org/docs/access-the-swarm/keep-your-data-alive" target="blank">
              official bee docs
            </a>{' '}
            to understand these values.
          </DialogContentText>
          <TextField
            onChange={handleUserInput}
            value={values.depth}
            error={Boolean(errors?.depth)}
            helperText={errors?.depth}
            required
            name="depth"
            autoFocus
            margin="dense"
            label="Depth"
            type="text"
            fullWidth
          />
          <TextField
            onChange={handleUserInput}
            value={values.amount}
            error={Boolean(errors?.amount)}
            helperText={errors?.amount}
            required
            name="amount"
            margin="dense"
            label="Amount"
            type="text"
            fullWidth
          />
          <TextField
            onChange={handleUserInput}
            value={values.label}
            error={Boolean(errors?.label)}
            helperText={errors?.label}
            name="label"
            margin="dense"
            label="Label"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" disabled={hasErrors} onClick={() => submitForm()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
