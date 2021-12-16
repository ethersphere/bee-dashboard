import { Box } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { Form, Formik, FormikHelpers } from 'formik'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext } from 'react'
import { Check } from 'react-feather'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
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

interface Props {
  onFinished: () => void
}

export function PostageStampCreation({ onFinished }: Props): ReactElement {
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
          onFinished()
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
          <Box mb={2}>
            <SwarmTextInput name="depth" label="Depth" formik />
          </Box>
          <Box mb={2}>
            <SwarmTextInput name="amount" label="Amount" formik />
          </Box>
          <Box mb={2}>
            <SwarmTextInput name="label" label="Label" optional formik />
          </Box>
          <SwarmButton
            disabled={isSubmitting || !isValid || !values.amount || !values.depth}
            onClick={submitForm}
            iconType={Check}
            loading={isSubmitting}
          >
            Buy New Stamp
          </SwarmButton>
        </Form>
      )}
    </Formik>
  )
}
