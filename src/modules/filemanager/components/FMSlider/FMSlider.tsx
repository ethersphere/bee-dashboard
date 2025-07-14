import { ReactElement, useState } from 'react'
import './FMSlider.scss'
import Slider from '@material-ui/core/Slider'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    width: '90%',
    marginLeft: '-3px',
  },
  rail: {
    color: 'rgb(229, 231, 235)',
    opacity: 1,
    height: 4,
  },
  track: {
    color: 'rgb(229, 231, 235)',
    height: 4,
  },
  thumb: {
    color: 'white',
    height: 18,
    width: 18,
    border: '3px solid rgb(237, 129, 49)',
    position: 'relative',
    top: -1,
    marginRight: '-10px',
  },
})

interface FMSliderProps {
  marks?: { value: number; label: string }[]
  defaultValue?: number
  onChange: (value: number) => void
  minValue?: number
  maxValue?: number
  step?: number
}

export function FMSlider({ marks, defaultValue, onChange, minValue, maxValue, step }: FMSliderProps): ReactElement {
  const [value, setValue] = useState(defaultValue || 0)
  const classes = useStyles()

  return (
    <div className="fm-slider">
      <style>
        {`
            .fm-slider .MuiSlider-markLabel[data-index="${value}"].MuiSlider-markLabelActive {
              color: rgb(237, 129, 49);
              font-weight: bold;
              }
              `}
      </style>
      <Slider
        classes={{
          root: classes.root,
          rail: classes.rail,
          track: classes.track,
          thumb: classes.thumb,
        }}
        value={value || 0}
        onChange={(_, val) => {
          setValue(Number(val))
          onChange(Number(val))
        }}
        defaultValue={defaultValue || 0}
        min={minValue || 0}
        max={maxValue || 100}
        step={step || 1}
        marks={marks}
        valueLabelDisplay="off"
      />
    </div>
  )
}
