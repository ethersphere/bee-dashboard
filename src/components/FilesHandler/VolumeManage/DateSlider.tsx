import { createStyles, makeStyles, Slider } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import OverMaxRangeIcon from '../../icons/OverMaxRangeIcon'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

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

    upperLabelContainer: {
      display: 'flex',
      gap: '5px',
      alignItems: 'center',
    },

    dateCurrentLabel: {
      width: '135px',
      display: 'flex',
      justifyContent: 'right',
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
  const classesGlobal = useFileManagerGlobalStyles()
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
            mark: classesGlobal.mark,
            markLabel: classesGlobal.markLabel,
            thumb: isThumbVisible ? classesGlobal.thumbVisible : classesGlobal.thumbInvisible,
          }}
        />
        <div className={classesGlobal.rightRangeIcon}>
          {isOverMaxIconVisible ? (
            <OverMaxRangeIcon />
          ) : (
            <div className={classesGlobal.overMaxRangeIconPlaceholder}></div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'right' }}>
        {newVolume ? null : (
          <div className={classes.dateCurrentLabel}>
            (Current:{' '}
            <span className={classesGlobal.boldSliderLabel}>
              {new Date(exactValue ?? 0).toLocaleDateString('en-GB')}
            </span>
            )
          </div>
        )}
      </div>
    </div>
  )
}

export default DateSlider
