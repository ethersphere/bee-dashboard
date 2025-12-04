import { ReactElement, useContext, useEffect, useRef, useState } from 'react'

import { BeeModes, BZZ, DAI, Duration, RedundancyLevel, Size, Utils } from '@ethersphere/bee-js'
import './CreateDriveModal.scss'
import { CustomDropdown } from '../CustomDropdown/CustomDropdown'
import { Button } from '../Button/Button'
import { fmFetchCost, handleCreateDrive } from '../../utils/bee'
import { getExpiryDateByLifetime } from '../../utils/common'
import { erasureCodeMarks } from '../../constants/common'
import { desiredLifetimeOptions } from '../../constants/stamps'
import { Context as BeeContext } from '../../../../providers/Bee'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { FMSlider } from '../Slider/Slider'
import { Context as FMContext } from '../../../../providers/FileManager'
import { getHumanReadableFileSize } from '../../../../utils/file'
import { Tooltip } from '../Tooltip/Tooltip'
import { TOOLTIPS } from '../../constants/tooltips'

const minMarkValue = Math.min(...erasureCodeMarks.map(mark => mark.value))
const maxMarkValue = Math.max(...erasureCodeMarks.map(mark => mark.value))

interface CreateDriveModalProps {
  onCancelClick: () => void
  onDriveCreated: () => void
  onCreationStarted: (driveName: string) => void
  onCreationError: (name: string) => void
}
// TODO: select existing batch id or create a new one - just like in InitialModal
export function CreateDriveModal({
  onCancelClick,
  onDriveCreated,
  onCreationStarted,
  onCreationError,
}: CreateDriveModalProps): ReactElement {
  const [isCreateEnabled, setIsCreateEnabled] = useState(false)
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(true)
  const [isxDaiBalanceSufficient, setIsxDaiBalanceSufficient] = useState(true)
  const [capacity, setCapacity] = useState(0)
  const [lifetimeIndex, setLifetimeIndex] = useState(-1)
  const [validityEndDate, setValidityEndDate] = useState(new Date())
  const [driveName, setDriveName] = useState('')
  const [capacityIndex, setCapacityIndex] = useState(-1)
  const [encryptionEnabled] = useState(false)
  const [erasureCodeLevel, setErasureCodeLevel] = useState(RedundancyLevel.OFF)
  const [cost, setCost] = useState('0')

  const [sizeMarks, setSizeMarks] = useState<{ value: number; label: string }[]>([])
  const { walletBalance, nodeInfo } = useContext(BeeContext)
  const { beeApi } = useContext(SettingsContext)
  const { fm, drives, expiredDrives, adminDrive } = useContext(FMContext)
  const currentFetch = useRef<Promise<void> | null>(null)
  const isMountedRef = useRef(true)
  const [duplicate, setDuplicate] = useState(false)

  const trimmedName = driveName.trim()
  const allExistingDriveNames = new Set(
    [...(drives || []), ...(expiredDrives || []), ...(adminDrive ? [adminDrive] : [])].map(d => d.name.trim()),
  )
  const nameExists = trimmedName.length > 0 && allExistingDriveNames.has(trimmedName)
  const validationError = duplicate && nameExists ? 'Drive already exists. Please choose another name.' : ''

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (duplicate && !nameExists) {
      setDuplicate(false)
    }
  }, [duplicate, nameExists])

  const handleCapacityChange = (value: number, index: number) => {
    setCapacityIndex(index)
  }

  useEffect(() => {
    const newSizes = Array.from(Utils.getStampEffectiveBytesBreakpoints(encryptionEnabled, erasureCodeLevel).values())

    setSizeMarks(
      newSizes.map(size => ({
        value: size,
        label: getHumanReadableFileSize(size),
      })),
    )

    setCapacity(newSizes[capacityIndex])
  }, [encryptionEnabled, erasureCodeLevel, capacityIndex])

  useEffect(() => {
    if (capacity > 0 && validityEndDate.getTime() > new Date().getTime()) {
      fmFetchCost(
        capacity,
        validityEndDate,
        false,
        erasureCodeLevel,
        beeApi,
        (cost: BZZ) => {
          if (!isMountedRef.current) return

          setIsBalanceSufficient(true)
          setIsxDaiBalanceSufficient(true)

          if ((walletBalance && cost.gte(walletBalance.bzzBalance)) || !walletBalance) {
            setIsBalanceSufficient(false)
          }
          setCost(cost.toSignificantDigits(2))

          const zeroDAI = DAI.fromDecimalString('0')

          if ((walletBalance && zeroDAI.eq(walletBalance.nativeTokenBalance)) || !walletBalance) {
            setIsxDaiBalanceSufficient(false)
          }
        },
        currentFetch,
      )

      const canCreate = Boolean(trimmedName) && !nameExists
      setIsCreateEnabled(canCreate)
    } else {
      setCost('0')
      setIsCreateEnabled(false)
    }
  }, [capacity, validityEndDate, beeApi, walletBalance, nameExists, erasureCodeLevel, trimmedName])

  useEffect(() => {
    setValidityEndDate(getExpiryDateByLifetime(lifetimeIndex))
  }, [lifetimeIndex])

  const isUltraLightNode = nodeInfo?.beeMode === BeeModes.ULTRA_LIGHT
  const isCreateDriveDisabled = isUltraLightNode || !isCreateEnabled || !isBalanceSufficient || !isxDaiBalanceSufficient

  return (
    <div className="fm-modal-container">
      <div className="fm-modal-window">
        <div className="fm-modal-window-header">Create new drive</div>
        <div className="fm-modal-window-body">
          <div className="fm-modal-window-input-container">
            <label htmlFor="drive-name" className="fm-input-label">
              Drive name: <Tooltip label={TOOLTIPS.DRIVE_NAME} />
            </label>
            <input
              type="text"
              id="drive-name"
              placeholder="My important files"
              value={driveName}
              onChange={e => setDriveName(e.target.value)}
              onBlur={() => setDuplicate(true)}
            />
            {validationError && <div className="fm-error-text">{validationError}</div>}
          </div>
          <div className="fm-modal-window-input-container">
            <label htmlFor="drive-initial-capacity" className="fm-input-label">
              Initial capacity: <Tooltip label={TOOLTIPS.DRIVE_INITIAL_CAPACITY} />
            </label>
            <CustomDropdown
              id="drive-initial-capacity"
              options={sizeMarks}
              value={capacity}
              onChange={handleCapacityChange}
              placeholder="Select a value"
            />
          </div>
          <div className="fm-modal-info-warning">
            Drive sizes are calculated automatically from your current stamp configuration.
          </div>
          <div className="fm-modal-window-input-container">
            <label htmlFor="drive-desired-lifetime" className="fm-input-label">
              Desired lifetime: <Tooltip label={TOOLTIPS.DRIVE_DESIRED_LIFETIME} />
            </label>
            <CustomDropdown
              id="drive-desired-lifetime"
              options={desiredLifetimeOptions}
              value={lifetimeIndex}
              onChange={setLifetimeIndex}
              placeholder="Select a value"
            />
          </div>
          <div className="fm-modal-window-input-container">
            <label htmlFor="drive-security-level" className="fm-input-label">
              Security Level <Tooltip label={TOOLTIPS.DRIVE_SECURITY_LEVEL} />
            </label>
            <FMSlider
              id="drive-security-level"
              defaultValue={0}
              marks={erasureCodeMarks}
              onChange={value => setErasureCodeLevel(value)}
              minValue={minMarkValue}
              maxValue={maxMarkValue}
              step={1}
            />
          </div>

          <div>
            <div className="fm-modal-estimated-cost-container">
              <div className="fm-emphasized-text">Estimated Cost:</div>
              <div>
                {cost} BZZ {isBalanceSufficient ? '' : '(Insufficient balance)'}
                {isxDaiBalanceSufficient ? '' : ' (Insufficient xDAI balance)'}
              </div>
              <Tooltip label={TOOLTIPS.DRIVE_ESTIMATED_COST} bottomTooltip={true} />
            </div>
            <div>(Based on current network conditions)</div>
            {isUltraLightNode && (
              <div>
                Creating a drive requires running a light node. Please{' '}
                <a
                  href="https://docs.ethswarm.org/docs/desktop/configuration/#upgrading-from-an-ultra-light-to-a-light-node"
                  target="_blank"
                  rel="noreferrer"
                >
                  upgrade
                </a>{' '}
                to continue.
              </div>
            )}
          </div>
        </div>
        <div className="fm-modal-window-footer">
          <Button
            label="Create drive"
            variant="primary"
            disabled={isCreateDriveDisabled}
            onClick={async () => {
              if (!trimmedName || nameExists) {
                setDuplicate(true)

                return
              }

              if (isCreateEnabled && fm && beeApi && walletBalance) {
                onCreationStarted(driveName)
                onCancelClick()

                await handleCreateDrive(
                  beeApi,
                  fm,
                  Size.fromBytes(capacity),
                  Duration.fromEndDate(validityEndDate),
                  trimmedName,
                  encryptionEnabled,
                  erasureCodeLevel,
                  false,
                  false,
                  null,
                  () => onDriveCreated(), // onSuccess
                  () => onCreationError(trimmedName), // onError
                )
              }
            }}
          />
          <Button label="Cancel" variant="secondary" onClick={onCancelClick} />
        </div>
      </div>
    </div>
  )
}
