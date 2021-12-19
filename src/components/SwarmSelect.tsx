import { createStyles, FormHelperText, makeStyles, MenuItem, Select as SimpleSelect, Theme } from '@material-ui/core'
import { Field } from 'formik'
import { Select } from 'formik-material-ui'
import { ReactElement } from 'react'

export type SelectEvent = React.ChangeEvent<{
  name?: string | undefined
  value: unknown
}>

interface Props {
  label?: string
  name?: string
  options: { value: string; label: string }[]
  onChange?: (event: SelectEvent) => void
  formik?: boolean
  defaultValue?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: {
      borderRadius: 0,
      background: theme.palette.background.paper,
      '& fieldset': {
        border: 0,
      },
    },
    option: {
      height: '52px',
    },
  }),
)

export function SwarmSelect({ defaultValue, formik, name, options, onChange, label }: Props): ReactElement {
  const classes = useStyles()

  if (formik) {
    return (
      <>
        {label && <FormHelperText>{label}</FormHelperText>}
        <Field
          required
          component={Select}
          name={name}
          fullWidth
          variant="outlined"
          defaultValue={defaultValue || ''}
          className={classes.select}
          placeholder={label}
        >
          {options.map((x, i) => (
            <MenuItem key={i} value={x.value} className={classes.option}>
              {x.label}
            </MenuItem>
          ))}
        </Field>
      </>
    )
  }

  return (
    <>
      {label && <FormHelperText>{label}</FormHelperText>}
      <SimpleSelect
        required
        name={name}
        fullWidth
        variant="outlined"
        className={classes.select}
        defaultValue={defaultValue || ''}
        onChange={onChange}
        placeholder={label}
      >
        {options.map((x, i) => (
          <MenuItem key={i} value={x.value} className={classes.option}>
            {x.label}
          </MenuItem>
        ))}
      </SimpleSelect>
    </>
  )
}
