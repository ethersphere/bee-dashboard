import { createStyles, makeStyles, MenuItem, TextField, Theme } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'

interface Props {
  defaultSize: number
  handleCustomChange: (value: number, metric: string) => void
  metric: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    customInputContainer: {
      position: 'absolute',
      top: '-55px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      cursor: 'pointer',
      backgroundColor: '#FFFFFF',
      height: '53px',
      width: '250px',
    },
    itemText: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '12px',
      '&::selection': {
        backgroundColor: '#DE7700',
        color: '#FFFFFF',
      },
    },
    menuItem: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '12px',
    },
  }),
)

export function VolumeSliderCustomInput({ defaultSize, handleCustomChange, metric }: Props): ReactElement {
  const classes = useStyles()
  const [value, setValue] = useState(defaultSize)
  const [customMetric, setCustomMetric] = useState(metric)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value))
    handleCustomChange(Number(event.target.value), metric)
  }
  const handleMetricChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMetric(event.target.value)
    handleCustomChange(value, event.target.value)
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  const currencies = [
    {
      value: 'GB',
      label: 'GB',
    },
    {
      value: 'MB',
      label: 'MB',
    },
  ]

  return (
    <div className={classes.customInputContainer}>
      <TextField
        name="Size"
        label="Size"
        type="number"
        value={value}
        onChange={handleChange}
        InputProps={{
          classes: {
            input: classes.itemText,
          },
          inputRef: inputRef,
        }}
      />
      <TextField
        id="standard-select-currency"
        select
        label="Select"
        value={customMetric}
        onChange={handleMetricChange}
        InputProps={{
          classes: {
            input: classes.itemText,
          },
        }}
      >
        {currencies.map(option => (
          <MenuItem key={option.value} value={option.value} classes={{ root: classes.menuItem }}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  )
}

export default VolumeSliderCustomInput
