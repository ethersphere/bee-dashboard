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
  defaultValue?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    field: {
      background: theme.palette.background.paper,
      '& fieldset': {
        border: 0,
      },
      '& .Mui-focused': {
        background: theme.palette.background.paper,
      },
      '& .MuiInputBase-root': {
        background: theme.palette.background.paper,
      },
      '& .MuiFilledInput-root': {
        borderRadius: 0,
      },
    },
  }),
)

export function SwarmTextInput({
  name,
  label,
  password,
  optional,
  formik,
  onChange,
  defaultValue,
}: Props): ReactElement {
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
        variant="filled"
        className={classes.field}
        defaultValue={defaultValue || ''}
        InputProps={{ disableUnderline: true }}
      />
    )
  }

  return (
    <SimpleTextField
      type={password ? 'password' : undefined}
      required
      label={label}
      fullWidth
      variant="filled"
      className={classes.field}
      defaultValue={defaultValue || ''}
      onChange={onChange}
      InputProps={{ disableUnderline: true }}
    />
  )
}
