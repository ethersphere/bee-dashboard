import { ReactElement, useState } from 'react'
import { RedundancyLevel } from '@ethersphere/bee-js'
import './CreateDriveModal.scss'
import { CustomDropdown } from '../CustomDropdown/CustomDropdown'
import { FMButton } from '../FMButton/FMButton'
import { FMSlider } from '../FMSlider/FMSlider'

const initialCapacityOptions = [
  { value: '5', label: '5 GB' },
  { value: '10', label: '10 GB' },
  { value: '20', label: '20 GB' },
  { value: '50', label: '50 GB' },
  { value: '100', label: '100 GB' },
]

const desiredLifetimeOptions = [
  { value: '1', label: '1 year' },
  { value: '2', label: '2 year' },
  { value: '3', label: '3 year' },
  { value: '5', label: '5 year' },
]

const marks = Object.entries(RedundancyLevel)
  .filter(([key, value]) => typeof value === 'number')
  .map(([key, value]) => ({
    value: value as number,
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  }))

const minMarkValue = Math.min(...marks.map(mark => mark.value))
const maxMarkValue = Math.max(...marks.map(mark => mark.value))

interface CreateDriveModalProps {
  onCancelClick: () => void
}

export function CreateDriveModal({ onCancelClick }: CreateDriveModalProps): ReactElement {
  const [capacity, setCapacity] = useState('personal')
  const [lifetime, setLifetime] = useState('personal')
  const [sliderValue, setSliderValue] = useState(0)

  return (
    <div className="fm-create-drive-modal-container">
      <div className="fm-create-drive-modal">
        <div className="fm-create-drive-modal-header">Create new drive</div>
        <div className="fm-create-drive-modal-body">
          <div className="fm-create-drive-modal-input-container">
            <label htmlFor="drive-name">Drive name:</label>
            <input type="text" id="drive-name" placeholder="My important files" />
          </div>
          <div className="fm-create-drive-modal-input-container">
            <CustomDropdown
              id="drive-type"
              label="Initial capacity:"
              options={initialCapacityOptions}
              value={capacity}
              onChange={setCapacity}
              placeholder="Select type"
              infoText="Amount of data you can store on the drive. Later you can upgrade it."
            />
          </div>
          <div className="fm-create-drive-modal-input-container">
            <CustomDropdown
              id="drive-type"
              label="Desired lifetime:"
              options={desiredLifetimeOptions}
              value={lifetime}
              onChange={setLifetime}
              placeholder="Select type"
              infoText="Might change over time depending on the network"
            />
          </div>
          <FMSlider
            defaultValue={0}
            marks={marks}
            onChange={value => setSliderValue(value)}
            minValue={minMarkValue}
            maxValue={maxMarkValue}
            step={1}
          />

          <div>
            <div>Estimated Cost: XX.XXX BZZ</div>
            <div>(Based on current network conditions)</div>
          </div>
        </div>
        <div className="fm-create-drive-modal-footer">
          <FMButton label="Create drive" variant="primary" />
          <FMButton label="Cancel" variant="secondary" onClick={onCancelClick} />
        </div>
      </div>
    </div>
  )
}
