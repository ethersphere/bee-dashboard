import { FormHelperText, MenuItem, Select as MuiSelect, SelectChangeEvent } from '@mui/material'
import { Field } from 'formik'
import { Select } from 'formik-mui'
import { ReactElement, ReactNode } from 'react'
import { makeStyles } from 'tss-react/mui'

export type SelectEvent = SelectChangeEvent<string>

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
  value?: string
  placeholder?: string
  disabled?: boolean
}

const useStyles = makeStyles()(theme => ({
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
}))

export function SwarmSelect({
  value,
  formik,
  name,
  options,
  onChange,
  label,
  placeholder,
  disabled = false,
}: Props): ReactElement {
  const { classes } = useStyles()

  if (formik) {
    return (
      <>
        {label && <FormHelperText>{label}</FormHelperText>}
        <Field
          required
          disabled={disabled}
          component={Select}
          name={name}
          fullWidth
          variant="outlined"
          value={value}
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
        disabled={disabled}
        name={name}
        fullWidth
        variant="outlined"
        className={classes.select}
        value={value}
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
