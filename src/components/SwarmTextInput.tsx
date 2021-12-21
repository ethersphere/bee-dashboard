import { createStyles, makeStyles, TextField as SimpleTextField, Theme } from '@material-ui/core'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { ChangeEvent, ReactElement } from 'react'

interface Props {
  name: string
  label: string
  password?: boolean
  formik?: boolean
  optional?: boolean
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    field: {
      background: theme.palette.background.paper,
      height: '52px',
      '& fieldset': {
        border: 0,
      },
    },
  }),
)

export function SwarmTextInput({ name, label, password, optional, formik, onChange }: Props): ReactElement {
  const classes = useStyles()

  if (formik) {
    return (
      <Field
        component={TextField}
        type={password ? 'password' : undefined}
        required={!optional}
        name={name}
        label={label}
        fullWidth
        variant="outlined"
        className={classes.field}
        defaultValue=""
      />
    )
  }

  return (
    <SimpleTextField
      type={password ? 'password' : undefined}
      required
      label={label}
      fullWidth
      variant="outlined"
      className={classes.field}
      defaultValue=""
      onChange={onChange}
    />
  )
}
