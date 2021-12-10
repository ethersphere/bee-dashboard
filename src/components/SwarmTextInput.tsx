import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { ReactElement } from 'react'

interface Props {
  name: string
  label: string
  password?: boolean
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

export function SwarmTextInput({ name, label, password }: Props): ReactElement {
  const classes = useStyles()

  return (
    <Field
      component={TextField}
      type={password ? 'password' : undefined}
      required
      name={name}
      label={label}
      fullWidth
      variant="outlined"
      className={classes.field}
      defaultValue=""
    />
  )
}
