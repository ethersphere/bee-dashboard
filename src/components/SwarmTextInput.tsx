import { createStyles, makeStyles, TextField as SimpleTextField, Theme } from '@material-ui/core'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { ChangeEvent, ReactElement } from 'react'

interface Props {
  name: string
  label: string
  password?: boolean
  required?: boolean
  rows?: number
  multiline?: boolean
  formik?: boolean
  optional?: boolean
  defaultValue?: string
  placeholder?: string
  readOnly?: boolean
  backgroundColor?: string
  color?: string
  disabled?: boolean
  textToBeDisabled?: string[]
  value?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onTextChange?: (newText: string) => void
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
        paddingTop: (props: { padding: number | undefined }) => `${props.padding}px`,
        fontFamily: '"iAWriterMonoV", monospace',
      },
      '& .MuiFilledInput-root': {
        borderRadius: 0,
      },
      '& .MuiFormLabel-root': {
        fontFamily: '"iAWriterMonoV", monospace',
        fontSize: '10px',
      },
    },
    placeholder: {
      fontFamily: '"iAWriterMonoV", monospace',
    },
  }),
)

export function SwarmTextInput({
  name,
  label,
  password,
  required,
  optional,
  rows,
  multiline,
  formik,
  onChange,
  defaultValue,
  placeholder,
  backgroundColor,
  color,
  disabled,
  textToBeDisabled,
  value,
}: Props): ReactElement {
  const padding = textToBeDisabled !== undefined ? (textToBeDisabled.length + 1) * 20 : undefined
  const classes = useStyles({ padding })

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
        placeholder={placeholder}
      />
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          fontFamily: '"iAWriterMonoV", monospace',
          color: '#878787',
        }}
      >
        <div
          style={{
            position: 'absolute',
            zIndex: '2',
            top: '21px',
            left: '12px',
            fontFamily: '"iAWriterMonoV", monospace',
          }}
        >
          {textToBeDisabled?.map((item, index) => (
            <div key={index}>0x9cbDe6569BA1220E46f256371368A05f480bb78C</div>
          ))}
        </div>
      </div>
      <SimpleTextField
        type={password ? 'password' : undefined}
        required={required !== undefined ? required : true}
        label={label}
        fullWidth
        variant="filled"
        multiline={multiline || false}
        rows={rows}
        className={classes.field}
        defaultValue={defaultValue || ''}
        value={value ?? defaultValue}
        onChange={onChange}
        disabled={disabled || false}
        InputProps={{
          disableUnderline: true,
          classes: { input: classes.placeholder },
          style: { backgroundColor: backgroundColor || '#FFFFFF', color: color || '#000000' },
        }}
        placeholder={placeholder}
        InputLabelProps={{ shrink: textToBeDisabled ? textToBeDisabled?.length > 0 : undefined }}
      />
    </div>
  )
}
