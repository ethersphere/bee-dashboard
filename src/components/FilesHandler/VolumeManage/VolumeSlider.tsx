import { createStyles, makeStyles, Slider } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useState } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
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
    // disabledThumb: {
    //   display: 'none',
    // },
    // trackBefore: {
    //   backgroundColor: 'red',
    // },
  }),
)

interface Props {
  color?: string
  type: 'number' | 'date' | 'bytes'
  marks: { value: number }[]
  upperLabel?: string
  lowerLabel?: string
  min?: number
  max?: number
  step?: number
  sliderValue?: number
  defaultValue?: number
  exactValue?: number
}

const VolumeSlider = ({ type, upperLabel, lowerLabel, step, defaultValue, exactValue }: Props): ReactElement => {
  const classes = useStyles()
  const [value, setValue] = useState<number>(defaultValue ?? 0)

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  const handleErasureCoding = ['normal', 'strong', 'insane', 'paranoid']

  const renderInput = () => {
    if (type === 'date') {
      return (
        <input
          type="date"
          value={new Date(defaultValue ?? value).toISOString().split('T')[0]}
          onChange={e => setValue(new Date(e.target.value).getTime())}
        />
      )
    }

    if (type === 'bytes') {
      return (
        <div>
          {upperLabel}
          {sizes[value]}GB
        </div>
      )
    }
  }

  const sizes = [0, 4, 16, 128, 512]

  function findFirstLargerValueIndex(value: number) {
    return sizes.findIndex(size => size > value)
  }

  function createMarksForEnabledSlider(exactValue: number) {
    const marks = []
    for (let i = findFirstLargerValueIndex(exactValue ?? 0); i < sizes.length; i++) {
      marks.push({ value: i })
    }

    return marks
  }

  const enabledSliderMarks = createMarksForEnabledSlider(exactValue ?? 0)

  return (
    <div className={classes.container}>
      <div>
        <div>{exactValue}</div>
        <span className={classes.boldSliderLabel}>{renderInput()}</span>
      </div>
      {/* // type: number, date, bytes, */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Slider
          step={step}
          marks={enabledSliderMarks}
          min={createMarksForEnabledSlider(exactValue ?? 0)[0].value}
          max={enabledSliderMarks[enabledSliderMarks.length - 1].value}
          defaultValue={exactValue}
          value={value}
          valueLabelDisplay="off"
          onChange={handleChange}
          classes={{
            mark: classes.mark,
            markLabel: classes.markLabel,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'right' }}>
        <div style={{ width: '135px', display: 'flex', justifyContent: 'right' }}>
          <span className={classes.boldSliderLabel}>
            {lowerLabel}
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}

export default VolumeSlider
