import { createStyles, makeStyles, Slider } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { fromBytesConversion } from '../../../utils/file'
import { Size, Utils } from '@ethersphere/bee-js'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

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
  const classes = useFileManagerGlobalStyles()
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
    <div className={classes.sliderContainer}>
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

      <div style={{ display: 'flex', justifyContent: 'right', position: 'relative', right: '-2px' }}>
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          {newVolume ? null : (
            <div className={classes.lowerBoldSliderLabel}>
              (Current/used: <span style={{ fontWeight: 'bold' }}>{lowerLabel})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SizeSlider
