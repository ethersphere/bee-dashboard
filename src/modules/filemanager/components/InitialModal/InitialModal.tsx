import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { BeeModes, BZZ, DAI, Duration, PostageBatch, RedundancyLevel, Size, Utils } from '@ethersphere/bee-js'
import './InitialModal.scss'
import { CustomDropdown } from '../CustomDropdown/CustomDropdown'
import { Button } from '../Button/Button'
import { calculateStampCapacityMetrics, fmFetchCost, getUsableStamps, handleCreateDrive } from '../../utils/bee'
import { getExpiryDateByLifetime, safeSetState } from '../../utils/common'
import { erasureCodeMarks } from '../../constants/common'
import { desiredLifetimeOptions } from '../../constants/stamps'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { Context as BeeContext } from '../../../../providers/Bee'

import { FMSlider } from '../Slider/Slider'
import { Context as FMContext } from '../../../../providers/FileManager'
import { ADMIN_STAMP_LABEL } from '@solarpunkltd/file-manager-lib'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Tooltip } from '../Tooltip/Tooltip'
import { TOOLTIPS } from '../../constants/tooltips'

interface InitialModalProps {
  resetState: boolean
  handleVisibility: (isVisible: boolean) => void
  handleShowError: (flag: boolean) => void
  setIsCreationInProgress: (isCreating: boolean) => void
}

const minMarkValue = Math.min(...erasureCodeMarks.map(mark => mark.value))
const maxMarkValue = Math.max(...erasureCodeMarks.map(mark => mark.value))

const BATCH_ID_PLACEHOLDER = 'Choose a saved Drive, or leave blank to create a new one'

const createBatchIdOptions = (stamps: PostageBatch[]) => [
  { label: BATCH_ID_PLACEHOLDER, value: -1 },
  ...stamps.map((stamp, index) => {
    const batchId = stamp.batchID.toHex().slice(0, 8)
    const label = `${batchId}${stamp.label ? ` - ${stamp.label}` : ''}`

    return {
      label,
      value: index,
    }
  }),
]

export function InitialModal({
  resetState,
  setIsCreationInProgress,
  handleVisibility,
  handleShowError,
}: InitialModalProps): ReactElement {
  const [isCreateEnabled, setIsCreateEnabled] = useState(false)
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(true)
  const [isxDaiBalanceSufficient, setIsxDaiBalanceSufficient] = useState(true)
  const [capacity, setCapacity] = useState(0)
  const [lifetimeIndex, setLifetimeIndex] = useState(0)
  const [validityEndDate, setValidityEndDate] = useState(new Date())
  const [erasureCodeLevel, setErasureCodeLevel] = useState(RedundancyLevel.OFF)
  const [cost, setCost] = useState('0')
  const [usableStamps, setUsableStamps] = useState<PostageBatch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<PostageBatch | null>(null)
  const [selectedBatchIndex, setSelectedBatchIndex] = useState<number>(-1)
  const [isNodeSyncing, setIsNodeSyncing] = useState(true)

  const { walletBalance, nodeInfo } = useContext(BeeContext)
  const { beeApi } = useContext(SettingsContext)
  const { fm } = useContext(FMContext)

  const currentFetch = useRef<Promise<void> | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const checkBalances = useCallback(
    (cost: BZZ) => {
      setIsBalanceSufficient(true)
      setIsxDaiBalanceSufficient(true)

      if ((walletBalance && cost.gte(walletBalance.bzzBalance)) || !walletBalance) {
        safeSetState(isMountedRef, setIsBalanceSufficient)(false)
      }

      const zeroDAI = DAI.fromDecimalString('0')

      if ((walletBalance && zeroDAI.eq(walletBalance.nativeTokenBalance)) || !walletBalance) {
        safeSetState(isMountedRef, setIsxDaiBalanceSufficient)(false)
      }
    },
    [walletBalance],
  )

  const handleCostFetch = useCallback(
    (cost: BZZ) => {
      safeSetState(isMountedRef, setIsNodeSyncing)(false)
      checkBalances(cost)
      safeSetState(isMountedRef, setCost)(cost.toSignificantDigits(2))
    },
    [checkBalances],
  )

  const handleCostFetchError = useCallback(() => {
    safeSetState(isMountedRef, setIsNodeSyncing)(true)
    safeSetState(isMountedRef, setCost)('0')
  }, [])

  const createAdminDrive = useCallback(async () => {
    setIsCreationInProgress?.(true)
    handleVisibility(false)

    await handleCreateDrive(
      beeApi,
      fm,
      Size.fromBytes(capacity),
      Duration.fromEndDate(validityEndDate),
      ADMIN_STAMP_LABEL,
      false,
      erasureCodeLevel,
      true,
      resetState,
      selectedBatch,
      () => {
        handleVisibility(false)
        setIsCreationInProgress(false)
      }, // onSuccess
      () => {
        handleShowError(true)
        setIsCreationInProgress(false)
      }, // onError
    )
  }, [
    beeApi,
    fm,
    capacity,
    validityEndDate,
    erasureCodeLevel,
    selectedBatch,
    handleVisibility,
    handleShowError,
    setIsCreationInProgress,
    resetState,
  ])

  useEffect(() => {
    const getStamps = async () => {
      try {
        const stamps = (await getUsableStamps(beeApi)).filter(s => {
          const { capacityPct } = calculateStampCapacityMetrics(s)

          return capacityPct < 100
        })

        safeSetState(isMountedRef, setUsableStamps)([...stamps])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to fetch stamps, node may still be syncing:', error)
      }
    }

    if (beeApi) {
      getStamps()
    }
  }, [beeApi])

  useEffect(() => {
    const newSizes = Array.from(Utils.getStampEffectiveBytesBreakpoints(false, erasureCodeLevel).values())

    setCapacity(newSizes[2])
  }, [erasureCodeLevel])

  useEffect(() => {
    if (validityEndDate.getTime() > new Date().getTime()) {
      fmFetchCost(
        capacity,
        validityEndDate,
        false,
        erasureCodeLevel,
        beeApi,
        handleCostFetch,
        currentFetch,
        handleCostFetchError,
      )

      if (lifetimeIndex >= 0 && !isNodeSyncing) {
        setIsCreateEnabled(true)
      } else {
        setIsCreateEnabled(false)
      }
    } else {
      setCost('0')
      setIsCreateEnabled(false)
    }
  }, [
    validityEndDate,
    erasureCodeLevel,
    beeApi,
    capacity,
    lifetimeIndex,
    isNodeSyncing,
    handleCostFetch,
    handleCostFetchError,
  ])

  useEffect(() => {
    setValidityEndDate(getExpiryDateByLifetime(lifetimeIndex))
  }, [lifetimeIndex])

  useEffect(() => {
    if (selectedBatchIndex >= 0 && selectedBatchIndex < usableStamps.length) {
      setSelectedBatch(usableStamps[selectedBatchIndex])
    } else {
      setSelectedBatch(null)
    }
  }, [usableStamps, selectedBatchIndex])

  const { capacityPct, usedSize, totalSize } = useMemo(
    () => calculateStampCapacityMetrics(selectedBatch),
    [selectedBatch],
  )

  const initText = resetState ? 'Resetting' : 'Initializing'
  const createText = resetState ? 'Reset' : 'Create'

  const isUltraLightNode = nodeInfo?.beeMode === BeeModes.ULTRA_LIGHT

  const isCreateDriveDisabled =
    isUltraLightNode ||
    isNodeSyncing ||
    (selectedBatch ? false : !isCreateEnabled || !isBalanceSufficient || !isxDaiBalanceSufficient)

  const renderUltraLightNodeWarning = () => {
    if (!isUltraLightNode) return null

    const upgradeLink = (
      <a
        href="https://docs.ethswarm.org/docs/desktop/configuration/#upgrading-from-an-ultra-light-to-a-light-node"
        target="_blank"
        rel="noreferrer"
      >
        upgrade
      </a>
    )

    if (selectedBatch) {
      return (
        <div>
          {resetState ? 'Resetting' : 'Creating'} a drive requires running a light node. Please {upgradeLink} to
          continue.
        </div>
      )
    }

    return (
      <div>
        Purchasing a stamp and {resetState ? 'resetting' : 'creating'} a drive requires running a light node. Please{' '}
        {upgradeLink} to continue.
      </div>
    )
  }

  return (
    <div className="fm-initialization-modal-container">
      <div className="fm-modal-window">
        <div className="fm-modal-window-header">Welcome to your Swarm File Manager</div>
        <div>{initText} the File Manager</div>
        {usableStamps.length > 0 && (
          <div className="fm-modal-window-body">
            <div className="fm-modal-window-input-container">
              {/* <label htmlFor="admin-desired-lifetime" className="fm-input-label">
                Link an existing Admin Drive (optional)
              </label>
              <br /> */}
              <CustomDropdown
                id="batch-id-selector"
                options={createBatchIdOptions(usableStamps)}
                value={selectedBatchIndex}
                label="Link an existing Admin Drive (optional)"
                onChange={(index: number) => {
                  setSelectedBatchIndex(index)

                  if (index === -1) {
                    setSelectedBatch(null)
                  }
                }}
                placeholder={BATCH_ID_PLACEHOLDER}
              />
              {selectedBatch && (
                <div className="fm-drive-item-content">
                  <div className="fm-drive-item-capacity">
                    Capacity <ProgressBar value={capacityPct} width="64px" /> {usedSize} / {totalSize}
                  </div>
                  <div className="fm-drive-item-capacity">
                    Expiry date: {selectedBatch.duration.toEndDate().toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {!selectedBatch && (
          <div className="fm-modal-window-body">
            <div className="fm-modal-window-input-container">
              <label htmlFor="admin-desired-lifetime" className="fm-input-label">
                Create a new Admin Drive with desired lifetime: <Tooltip label={TOOLTIPS.ADMIN_DESIRED_LIFETIME} />
              </label>
              <CustomDropdown
                id="admin-desired-lifetime"
                options={desiredLifetimeOptions}
                value={lifetimeIndex}
                onChange={setLifetimeIndex}
                placeholder="Select a value"
              />
            </div>
            <div className="fm-modal-window-input-container">
              <label htmlFor="admin-security-level" className="fm-input-label">
                Security Level <Tooltip label={TOOLTIPS.ADMIN_SECURITY_LEVEL} />
              </label>
              <FMSlider
                id="admin-security-level"
                defaultValue={0}
                marks={erasureCodeMarks}
                onChange={value => setErasureCodeLevel(value)}
                minValue={minMarkValue}
                maxValue={maxMarkValue}
                step={1}
              />
            </div>
            <div className="fm-modal-window-input-container">
              <div className="fm-modal-estimated-cost-container">
                <div className="fm-emphasized-text">Estimated Cost:</div>
                <div>
                  {cost} BZZ {isBalanceSufficient ? '' : '(Insufficient balance)'}
                  {isxDaiBalanceSufficient ? '' : ' (Insufficient xDAI balance)'}
                </div>
                <Tooltip label={TOOLTIPS.ADMIN_ESTIMATED_COST} />
              </div>
              <div>(Based on current network conditions)</div>
              {renderUltraLightNodeWarning()}
              {isNodeSyncing && !selectedBatch && (
                <div className="fm-modal-info-warning" style={{ marginBottom: '16px' }}>
                  Node is syncing. Please wait until sync completes before purchasing a stamp.
                </div>
              )}
            </div>
          </div>
        )}
        <div className="fm-modal-window-footer">
          <Button
            label={selectedBatch ? `${createText} Drive` : `Purchase Stamp & ${createText} Drive`}
            variant="primary"
            disabled={isCreateDriveDisabled}
            onClick={createAdminDrive}
          />
          <Tooltip
            label={
              selectedBatch
                ? TOOLTIPS.ADMIN_PURCHASE_BUTTON_ALREADY_EXISTED_ADMIN_DRIVE
                : TOOLTIPS.ADMIN_PURCHASE_BUTTON
            }
          />
        </div>
      </div>
    </div>
  )
}
