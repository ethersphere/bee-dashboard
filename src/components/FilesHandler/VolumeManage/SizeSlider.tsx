import { createStyles, makeStyles, Slider } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { fromBytesConversion } from '../../../utils/file'
import { Size, Utils } from '@upcoming/bee-js'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '93%',
      position: 'relative',
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
      display: 'inline-box',
      fontWeight: 'bold',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
    upperBoldSliderLabel: {
      cursor: 'pointer',
      display: 'inline-box',
      fontWeight: 'bold',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
    lowerBoldSliderLabel: {
      width: '100%',
      cursor: 'pointer',
      fontWeight: 'bold',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
    thumbVisible: {
      display: 'block',
    },
    thumbInvisible: {
      display: 'none',
    },
    leftRangeIcon: {
      position: 'relative',
      top: '6px',
      left: '0',
    },
    rightRangeIcon: {
      position: 'relative',
      top: '6px',
      right: '0',
      marginLeft: '2px',
      width: '7px',
    },
    overMaxRangeIconPlaceholder: {
      display: 'flex',
      width: '7px',
    },
  }),
)

interface Props {
  onChange: (value: Size) => void
  lowerLabel?: string
  step?: number
  sliderValue?: number
  exactValue: Size
  newVolume?: boolean
}

const SizeSlider = ({ onChange, lowerLabel, step, exactValue, newVolume }: Props): ReactElement => {
  const sizesMap = Utils.getStampEffectiveBytesBreakpoints()
  const sizes = Array.from(sizesMap.values())
  const classes = useStyles()
  const [value, setValue] = useState<number>(0)
  const [selectedSize, setSelectedSize] = useState(exactValue)
  const metric = 'GB'

  useEffect(() => {
    if (newVolume) {
      handleChange(null, 0)
    }
  }, [])

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number)
    setSelectedSize(Size.fromBytes(realSizes[newValue as number]))

    onChange(Size.fromBytes(realSizes[newValue as number]))
  }

  if (newVolume) {
    sizes.unshift(0)
  }

  const firstIndex = newVolume
    ? sizes.findIndex(size => size > exactValue.toBytes())
    : sizes.findIndex(size => size >= exactValue.toBytes())
  const lastIndex = sizes.findIndex(size => size === 1001435190579)
  const realSizes = sizes.slice(firstIndex, lastIndex)

  const sizeMarks = realSizes.map((size, index) => ({
    value: index,
    label: index === 0 && !newVolume ? 'Current' : `to ${fromBytesConversion(size, metric).toFixed(0)}GB`,
  }))

  const sliderMin = sizeMarks[0].value
  const sliderMax = sizeMarks[sizeMarks.length - 1].value

  return (
    <div className={classes.container}>
      <div>
        <div>
          Size:{' '}
          <span className={classes.upperBoldSliderLabel}>
            {selectedSize.toGigabytes().toFixed(2)} {metric}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Slider
          step={step}
          marks={sizeMarks}
          min={sliderMin}
          max={sliderMax}
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
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <div className={classes.lowerBoldSliderLabel}>{lowerLabel}</div>
        </div>
      </div>
    </div>
  )
}

export default SizeSlider
