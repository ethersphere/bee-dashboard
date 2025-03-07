import { createStyles, makeStyles, Slider } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import OverMaxRangeIcon from '../icons/OverMaxRangeIcon'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '93%',
      display: 'flex',
      flexDirection: 'column',
      height: '16px',
      fontSize: '10px',
      fontFamily: '"iAWriterMonoV", monospace',
    },
    mark: {
      height: 16,
      width: 2,
      backgroundColor: '#878787',
      marginTop: -7,
    },
    markLabel: {
      fontSize: '10px',
      color: '#333333',
      fontFamily: '"iAWriterMonoV", monospace',
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: 'red',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    boldSliderLabel: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
    rightRangeIcon: {
      position: 'relative',
      top: '6px',
      right: '0',
      marginLeft: '2px',
      width: '7px',
    },
    input: {
      color: '#333333',
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '10px',
      padding: '0px',
      paddingBottom: '2px',
      margin: '0px',
      marginTop: '1px',
      marginLeft: '5px',
      border: '0px',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    thumbVisible: {
      display: 'block',
    },
    thumbInvisible: {
      display: 'none',
    },
    overMaxRangeIconPlaceholder: {
      display: 'flex',
      width: '7px',
    },
    upperLabelContainer: {
      display: 'flex',
      gap: '5px',
      alignItems: 'center',
    },
  }),
)

interface Props {
  color?: string
  type: 'number' | 'date' | 'bytes'
  marks?: { value: number }[]
  upperLabel?: string
  lowerLabel?: string
  min?: number
  max?: number
  step?: number
  sliderValue?: number
  defaultValue?: number
  exactValue: Date
  onDateChange: (value: Date) => void
  newVolume: boolean
}

const DateSlider = ({ upperLabel, exactValue, onDateChange, newVolume }: Props): ReactElement => {
  const classes = useStyles()
  const [dateValue, setDateValue] = useState<number>(exactValue.getTime())
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [isThumbVisible, setIsThumbVisible] = useState(true)
  const [isOverMaxIconVisible, setIsOverMaxIconVisible] = useState(false)

  const timeUnitActions = [
    (date: Date) => date,
    (date: Date) => date.setDate(date.getDate() + 7),
    (date: Date) => date.setMonth(date.getMonth() + 1),
    (date: Date) => date.setMonth(date.getMonth() + 3),
    (date: Date) => date.setMonth(date.getMonth() + 6),
    (date: Date) => date.setFullYear(date.getFullYear() + 1),
  ]

  useEffect(() => {
    if (newVolume) {
      handleChange(null, 1)
    }
  }, [])

  const handleChange = (event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number)
    const newDate = new Date(exactValue)

    setIsThumbVisible(true)
    setIsOverMaxIconVisible(false)

    const action = timeUnitActions[newValue as number]

    if (action) {
      action(newDate)
    }

    setDateValue(newDate.getTime())

    onDateChange(newDate)
  }

  const handleDatePickerChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const newDate = newValue.toDate()

      setDateValue(newDate.getTime())

      if (newDate.getTime() > exactValue.setFullYear(exactValue.getFullYear() + 1)) {
        setIsOverMaxIconVisible(true)
      } else {
        setIsOverMaxIconVisible(false)
      }
      onDateChange(newDate)
      setIsThumbVisible(false)
    }
  }

  const dateSliderMarks = [
    { value: 0, label: 'Current' },
    { value: 1, label: 'By 1 week' },
    { value: 2, label: 'By 1 month' },
    { value: 3, label: 'By 3 months' },
    { value: 4, label: 'By 6 months' },
    { value: 5, label: 'By 1 year' },
  ]

  const newVolumeDateSliderMarks = [
    { value: 1, label: '1 week' },
    { value: 2, label: '1 month' },
    { value: 3, label: '3 months' },
    { value: 4, label: '6 months' },
    { value: 5, label: '1 year' },
  ]

  const sliderMin = newVolume ? newVolumeDateSliderMarks[0].value : dateSliderMarks[0].value
  const sliderMax = newVolume
    ? newVolumeDateSliderMarks[newVolumeDateSliderMarks.length - 1].value
    : dateSliderMarks[dateSliderMarks.length - 1].value

  return (
    <div className={classes.container}>
      <div>
        <div style={{ display: 'flex' }} className={classes.upperLabelContainer}>
          {upperLabel}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjs(dateValue)}
              onChange={handleDatePickerChange}
              sx={{
                '.MuiInputBase-root': {
                  fontSize: '10px',
                  fontWeight: 'bold',
                  fontFamily: '"iAWriterMonoV", monospace',
                  input: {
                    padding: '3px',
                    width: '70px',
                  },
                  '.MuiInputAdornment-root': {
                    marginLeft: '0px',
                  },
                  '.MuiButtonBase-root': {
                    padding: '0px',
                  },
                  '.MuiSvgIcon-root': {
                    fontSize: '15px',
                  },
                },
              }}
              slotProps={{
                day: {
                  sx: {
                    '&.Mui-selected': {
                      backgroundColor: '#dd7700 !important',
                      borderRadius: '0px',
                    },
                  },
                },
                calendarHeader: {
                  sx: {
                    '.MuiPickersCalendarHeader-label': {
                      fontFamily: '"iAWriterMonoV", monospace',
                    },
                  },
                },
              }}
            ></DatePicker>
          </LocalizationProvider>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Slider
          step={null}
          min={sliderMin}
          max={sliderMax}
          value={sliderValue}
          marks={newVolume ? newVolumeDateSliderMarks : dateSliderMarks}
          valueLabelDisplay="off"
          onChange={handleChange}
          classes={{
            mark: classes.mark,
            markLabel: classes.markLabel,
            thumb: isThumbVisible ? classes.thumbVisible : classes.thumbInvisible,
          }}
        />
        <div className={classes.rightRangeIcon}>
          {isOverMaxIconVisible ? <OverMaxRangeIcon /> : <div className={classes.overMaxRangeIconPlaceholder}></div>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'right' }}>
        {newVolume ? null : (
          <div style={{ width: '135px', display: 'flex', justifyContent: 'right' }}>
            (Current:{' '}
            <span className={classes.boldSliderLabel}>{new Date(exactValue ?? 0).toLocaleDateString('en-GB')}</span>)
          </div>
        )}
      </div>
    </div>
  )
}

export default DateSlider
