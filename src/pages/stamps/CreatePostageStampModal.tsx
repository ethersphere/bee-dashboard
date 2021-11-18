import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import BigNumber from 'bignumber.js'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-material-ui'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext } from 'react'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context } from '../../providers/Stamps'

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    field: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginBottom: -12,
    },
  }),
)

interface Props {
  onClose: () => void
}

export function CreatePostageStampModal({ onClose }: Props): ReactElement {
  const classes = useStyles()
  const { refresh } = useContext(Context)
  const { beeDebugApi } = useContext(SettingsContext)
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={async (values: FormValues, actions: FormikHelpers<FormValues>) => {
        try {
          // This is really just a typeguard, the validation pretty much guarantees these will have the right values
          if (!values.depth || !values.amount) return

          if (!beeDebugApi) return

          const amount = BigInt(values.amount)
          const depth = Number.parseInt(values.depth)
          const options = values.label ? { label: values.label } : undefined
          await beeDebugApi.createPostageBatch(amount.toString(), depth, options)
          actions.resetForm()
          await refresh()
          onClose()
        } catch (e) {
          enqueueSnackbar(`Error: ${(e as Error).message}`, { variant: 'error' })
          actions.setSubmitting(false)
        }
      }}
      validate={(values: FormValues) => {
        const errors: FormErrors = {}

        // Depth
        if (!values.depth) errors.depth = 'Required field'
        else {
          const depth = new BigNumber(values.depth)

          if (!depth.isInteger()) errors.depth = 'Depth must be an integer'
          else if (depth.isLessThan(16)) errors.depth = 'Minimal depth is 16'
          else if (depth.isGreaterThan(255)) errors.depth = 'Depth has to be at most 255'
        }

        // Amount
        if (!values.amount) errors.amount = 'Required field'
        else {
          const amount = new BigNumber(values.amount)

          if (!amount.isInteger()) errors.amount = 'Amount must be an integer'
          else if (amount.isLessThanOrEqualTo(0)) errors.amount = 'Amount must be greater than 0'
        }

        // Label
        if (values.label && !/^[0-9a-z]*$/i.test(values.label)) errors.label = 'Label must be an alphanumeric string'

        return errors
      }}
    >
      {({ submitForm, isValid, isSubmitting, values }) => (
        <Form>
          <Dialog open={true} onClose={() => onClose()} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Buy new postage stamp</DialogTitle>
            <DialogContent>
              <Field
                component={TextField}
                required
                name="depth"
                autoFocus
                label="Depth"
                fullWidth
                className={classes.field}
              />
              <Field component={TextField} required name="amount" label="Amount" fullWidth className={classes.field} />
              <Field component={TextField} name="label" label="Label" fullWidth className={classes.field} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => onClose()} variant="contained">
                Cancel
              </Button>
              <div className={classes.wrapper}>
                <Button
                  disabled={isSubmitting || !isValid || !values.amount || !values.depth}
                  type="submit"
                  variant="contained"
                  onClick={submitForm}
                >
                  Create
                  {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>
              </div>
            </DialogActions>
            <DialogContent>
              <DialogContentText>
                Please refer to the official Bee documentation to understand these values.
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Form>
      )}
    </Formik>
  )
}
