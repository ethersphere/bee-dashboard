import React, { ReactElement } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import BigNumber from 'bignumber.js'
import { FormikHelpers, useFormik } from 'formik'
import { beeApi } from '../../services/bee'

interface FormValues {
  depth?: string
  amount?: string
  label?: string
}
type FormErrors = Partial<FormValues>
const initialFormValues: FormValues = {
  depth: '',
  amount: '',
  label: '',
}

export default function FormDialog(): ReactElement {
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: async (values: FormValues, actions: FormikHelpers<FormValues>) => {
      try {
        if (!values.depth) return

        const amount = BigInt(values.amount)
        const depth = Number.parseInt(values.depth)
        const options = values.label ? { label: values.label } : undefined
        await beeApi.stamps.buyPostageStamp(amount, depth, options)
        actions.resetForm()
        handleClose()
      } catch (e) {
        console.error(`${e.message}`) // eslint-disable-line
        actions.setSubmitting(false)
      }
    },
    validate: (values: FormValues) => {
      const errors: FormErrors = {}

      // Depth
      if (!values.depth) errors.depth = 'Required field'
      else {
        const depth = new BigNumber(values.depth)

        if (!depth.isInteger()) errors.depth = 'Depth must be an integer'
        else if (depth.isLessThan(16)) errors.depth = 'Minimal depth is 16'
      }

      // Amount
      if (!values.amount) errors.amount = 'Required field'
      else {
        const amount = new BigNumber(values.amount)

        if (!amount.isInteger()) errors.amount = 'Amount must be an integer'
        else if (amount.isLessThanOrEqualTo(0)) errors.amount = 'Amount must be greater than 0'
      }

      // Label
      if (values.label && !/^[0-9a-z]*$/i.test(values.label)) errors.amount = 'Label must be an alphanumeric string'

      return errors
    },
  })

  return (
    <form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
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
            onChange={formik.handleChange}
            value={formik.values.depth}
            error={Boolean(formik.errors?.depth)}
            helperText={formik.errors?.depth}
            required
            name="depth"
            autoFocus
            margin="dense"
            label="Depth"
            type="text"
            fullWidth
          />
          <TextField
            onChange={formik.handleChange}
            value={formik.values.amount}
            error={Boolean(formik.errors?.amount)}
            helperText={formik.errors?.amount}
            required
            name="amount"
            margin="dense"
            label="Amount"
            type="text"
            fullWidth
          />
          <TextField
            onChange={formik.handleChange}
            value={formik.values.label}
            error={Boolean(formik.errors?.label)}
            helperText={formik.errors?.label}
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
          <Button
            color="primary"
            disabled={formik.isSubmitting || !formik.isValid || !formik.values.amount || !formik.values.depth}
            type="submit"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}
