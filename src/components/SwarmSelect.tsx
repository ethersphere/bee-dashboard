import { createStyles, FormHelperText, makeStyles, MenuItem, Select as MuiSelect, Theme } from '@material-ui/core'
import { Field } from 'formik'
import { Select } from 'formik-material-ui'
import { ReactElement, ReactNode } from 'react'

export type SelectEvent = React.ChangeEvent<{
  name?: string | undefined
  value: unknown
}>

function renderValue(value: unknown): ReactNode {
  if (typeof value === 'string') {
    return value
  }

  const label = Reflect.get(value as object, 'label')

  if (label) {
    return label
  }

  return value as ReactNode
}

interface Props {
  label?: string
  name?: string
  options: { value: string; label: string }[]
  onChange?: (event: SelectEvent) => void
  formik?: boolean
  defaultValue?: string
  placeholder?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: {
      borderRadius: 0,
      background: theme.palette.background.paper,
      '& fieldset': {
        border: 0,
      },
      '& .MuiSelect-select': {
        '&:focus': {
          background: theme.palette.background.paper,
        },
      },
    },
    option: {
      height: '52px',
    },
  }),
)

export function SwarmSelect({
  defaultValue,
  formik,
  name,
  options,
  onChange,
  label,
  placeholder,
}: Props): ReactElement {
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
          defaultValue={defaultValue}
          className={classes.select}
          displayEmpty
          renderValue={(value: unknown) => (value ? renderValue(value) : placeholder)}
          MenuProps={{ MenuListProps: { disablePadding: true }, PaperProps: { square: true } }}
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
      <MuiSelect
        required
        name={name}
        fullWidth
        variant="outlined"
        className={classes.select}
        defaultValue={defaultValue}
        onChange={onChange}
        displayEmpty
        renderValue={(value: unknown) => (value ? renderValue(value) : placeholder)}
        MenuProps={{ MenuListProps: { disablePadding: true }, PaperProps: { square: true } }}
      >
        {options.map((x, i) => (
          <MenuItem key={i} value={x.value} className={classes.option}>
            {x.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </>
  )
}
