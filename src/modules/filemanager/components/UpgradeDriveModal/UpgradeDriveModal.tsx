import {
  BatchId,
  BeeRequestOptions,
  BZZ,
  capacityBreakpoints,
  Duration,
  PostageBatch,
  RedundancyLevel,
  Size,
  Utils,
} from '@ethersphere/bee-js'
import { Warning } from '@mui/icons-material'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'
import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import CalendarIcon from 'remixicon-react/CalendarLineIcon'
import DatabaseIcon from 'remixicon-react/Database2LineIcon'
import ExternalLinkIcon from 'remixicon-react/ExternalLinkLineIcon'
import DriveIcon from 'remixicon-react/HardDrive2LineIcon'
import WalletIcon from 'remixicon-react/Wallet3LineIcon'

import { Context as BeeContext } from '../../../../providers/Bee'
import { Context as FMContext } from '../../../../providers/FileManager'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { getHumanReadableFileSize } from '../../../../utils/file'
import { FILE_MANAGER_EVENTS, POLLING_TIMEOUT_MS } from '../../constants/common'
import { desiredLifetimeOptions } from '../../constants/stamps'
import { useStampPolling } from '../../hooks/useStampPolling'
import { fromBytesConversion, getExpiryDateByLifetime, truncateNameMiddle } from '../../utils/common'
import { Button } from '../Button/Button'
import { CustomDropdown } from '../CustomDropdown/CustomDropdown'

import './UpgradeDriveModal.scss'
import '../../styles/global.scss'

interface UpgradeDriveModalProps {
  stamp: PostageBatch
  drive: DriveInfo
  onCancelClick: () => void
  containerColor?: string
  setErrorMessage?: (error: string) => void
}

const defaultErasureCodeLevel = RedundancyLevel.OFF
const encryption_off = 'ENCRYPTION_OFF'

export function UpgradeDriveModal({
  stamp,
  onCancelClick,
  containerColor,
  drive,
  setErrorMessage,
}: UpgradeDriveModalProps): ReactElement {
  const { nodeAddresses, walletBalance } = useContext(BeeContext)
  const { beeApi } = useContext(SettingsContext)
  const { refreshStamp, setShowError } = useContext(FMContext)

  const [isBalanceSufficient, setIsBalanceSufficient] = useState(true)
  const [capacity, setCapacity] = useState(stamp.size)
  const [capacityExtensionCost, setCapacityExtensionCost] = useState('')
  const [capacityIndex, setCapacityIndex] = useState(0)
  const [durationExtensionCost, setDurationExtensionCost] = useState('')
  const [lifetimeIndex, setLifetimeIndex] = useState(0)
  const [validityEndDate, setValidityEndDate] = useState(new Date())
  const [sizeMarks, setSizeMarks] = useState<{ value: number; label: string }[]>([])
  const [extensionCost, setExtensionCost] = useState('0')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const modalRoot = document.querySelector('.fm-main') || document.body
  const isMountedRef = useRef(true)

  const { startPolling } = useStampPolling({
    refreshStamp,
    onStampUpdated: (updatedStamp: PostageBatch) => {
      window.dispatchEvent(
        new CustomEvent(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, {
          detail: {
            driveId: drive.id.toString(),
            success: true,
            updatedStamp,
          },
        }),
      )
    },
    onTimeout: (finalStamp: PostageBatch | null) => {
      window.dispatchEvent(
        new CustomEvent(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_TIMEOUT, {
          detail: {
            driveId: drive.id.toString(),
            finalStamp: finalStamp || null,
          },
        }),
      )
    },
    onPollingStateChange: () => {
      // no-op
    },
    timeout: POLLING_TIMEOUT_MS,
  })

  const handleCapacityChange = (value: number, index: number) => {
    setCapacity(value === -1 ? stamp.size : Size.fromBytes(value))
    setCapacityIndex(index)
  }

  const handleCostCalculation = useCallback(
    async (
      batchId: BatchId,
      capacity: Size,
      duration: Duration,
      options: BeeRequestOptions | undefined,
      encryption: boolean,
      erasureCodeLevel: RedundancyLevel,
      isCapacityExtensionSet: boolean,
      isDurationExtensionSet: boolean,
    ) => {
      let cost: BZZ | undefined

      try {
        cost = await beeApi?.getExtensionCost(batchId, capacity, duration, options, encryption, erasureCodeLevel)
      } catch {
        setErrorMessage?.('Failed to calculate extension cost')
        setShowError(true)

        return
      }

      const costText = cost ? cost.toSignificantDigits(2) : '0'

      if (!isMountedRef.current) return

      if ((walletBalance && cost && cost.gte(walletBalance.bzzBalance)) || !walletBalance) {
        setIsBalanceSufficient(false)
      } else {
        setIsBalanceSufficient(true)
      }

      const bothExtensions = isCapacityExtensionSet && isDurationExtensionSet
      const capacityOnly = isCapacityExtensionSet && !isDurationExtensionSet
      const durationOnly = !isCapacityExtensionSet && isDurationExtensionSet
      const noExtensions = !isCapacityExtensionSet && !isDurationExtensionSet

      if (bothExtensions) {
        setCapacityExtensionCost('')
        setDurationExtensionCost('')
      } else if (capacityOnly) {
        setCapacityExtensionCost(costText)
        setDurationExtensionCost('0')
      } else if (durationOnly) {
        setCapacityExtensionCost('0')
        setDurationExtensionCost(costText)
      } else {
        setCapacityExtensionCost('0')
        setDurationExtensionCost('0')
      }

      setExtensionCost(noExtensions ? '0' : costText)
    },
    [beeApi, walletBalance, isMountedRef, setErrorMessage, setShowError],
  )

  useEffect(() => {
    const fetchSizes = () => {
      const sizes = Array.from(Utils.getStampEffectiveBytesBreakpoints(false, defaultErasureCodeLevel).values())

      const capacityValues = capacityBreakpoints[encryption_off][defaultErasureCodeLevel]
      const fromIndex = capacityValues.findIndex(item => item.batchDepth === stamp.depth)

      const newSizes = sizes.slice(fromIndex + 1)

      const updatedSizes = [
        { value: -1, label: 'No additional storage (0 GB)' },
        ...newSizes.map(size => ({
          value: size,
          label: getHumanReadableFileSize(size - stamp.size.toBytes()),
        })),
      ]
      setSizeMarks(updatedSizes)
    }

    fetchSizes()
  }, [stamp.depth, stamp.size])

  useEffect(() => {
    const fetchExtensionCost = () => {
      const isCapacitySet = capacityIndex > 0
      const isDurationSet = lifetimeIndex >= 0
      const extendDuration =
        lifetimeIndex >= 0 ? Duration.fromEndDate(validityEndDate, stamp.duration.toEndDate()) : Duration.ZERO

      handleCostCalculation(
        stamp.batchID,
        capacity,
        extendDuration,
        undefined,
        false,
        defaultErasureCodeLevel,
        isCapacitySet,
        isDurationSet,
      )
    }

    fetchExtensionCost()
  }, [capacity, validityEndDate, capacityIndex, handleCostCalculation, lifetimeIndex, stamp.batchID, stamp.duration])

  useEffect(() => {
    setValidityEndDate(getExpiryDateByLifetime(lifetimeIndex, stamp.duration.toEndDate()))
  }, [lifetimeIndex, stamp.duration])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const batchIdStr = stamp.batchID.toString()
  const shortBatchId = batchIdStr.length > 12 ? `${batchIdStr.slice(0, 4)}...${batchIdStr.slice(-4)}` : batchIdStr

  return createPortal(
    <div
      className={`fm-modal-container fm-upgrade-drive-modal-container${
        containerColor === 'none' ? ' fm-modal-container-no-bg' : ''
      }`}
    >
      <div className="fm-modal-window fm-upgrade-drive-modal">
        <div className="fm-modal-window-header">
          <DriveIcon size="18px" /> Upgrade {truncateNameMiddle(drive.name || stamp.label || shortBatchId, 35)}
        </div>
        <div className="fm-modal-window-scrollable">
          <div>Choose extension period and additional storage for your drive.</div>
          <div className="fm-modal-window-body">
            <div className="fm-upgrade-drive-modal-wallet">
              <div className="fm-upgrade-drive-modal-wallet-header fm-emphasized-text">
                <WalletIcon size="14px" color="rgb(237, 129, 49)" /> Wallet information
              </div>
              {walletBalance && nodeAddresses ? (
                <div className="fm-upgrade-drive-modal-wallet-info-container">
                  <div className="fm-upgrade-drive-modal-wallet-info">
                    <div>Balance</div>
                    <div>{`${walletBalance.bzzBalance.toSignificantDigits(4)} xBZZ`}</div>
                  </div>
                  <div className="fm-upgrade-drive-modal-wallet-info">
                    <div>Wallet address:</div>
                    <div className="fm-value-snippet">{`${walletBalance.walletAddress.slice(
                      0,
                      4,
                    )}...${walletBalance.walletAddress.slice(-4)}`}</div>
                  </div>
                </div>
              ) : (
                <div>Wallet information is not available</div>
              )}
              <div className="fm-upgrade-drive-modal-info fm-swarm-orange-font">
                <a
                  className="fm-upgrade-drive-modal-info-link fm-pointer"
                  href="https://www.ethswarm.org/get-bzz#how-to-get-bzz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon size="14px" />
                  Need help topping up?
                </a>
              </div>
            </div>
          </div>
          <div className="fm-modal-window-body">
            <div className="fm-upgrade-drive-modal-input-row">
              <div className="fm-modal-window-input-container">
                <CustomDropdown
                  id="drive-type"
                  label="Additional storage"
                  icon={<DatabaseIcon size="14px" color="rgb(237, 129, 49)" />}
                  options={sizeMarks}
                  value={capacityIndex === 0 ? -1 : capacity.toBytes()}
                  onChange={handleCapacityChange}
                />
              </div>
              <div className="fm-modal-window-input-container">
                <CustomDropdown
                  id="drive-type"
                  label="Duration"
                  icon={<CalendarIcon size="14px" color="rgb(237, 129, 49)" />}
                  options={desiredLifetimeOptions}
                  value={lifetimeIndex}
                  onChange={(value, _) => {
                    setLifetimeIndex(value)
                  }}
                />
              </div>
            </div>

            <div className="fm-modal-white-section">
              <div className="fm-emphasized-text">Summary</div>
              <div>
                Drive: {truncateNameMiddle(drive.name)} {drive.isAdmin && <Warning style={{ fontSize: '16px' }} />}
              </div>
              <div>
                BatchId: {truncateNameMiddle(stamp.label, 25)} ({shortBatchId})
              </div>
              <div>Expiry: {stamp.duration.toEndDate().toLocaleDateString()}</div>
              <div>
                Additional storage:{' '}
                {(() => {
                  if (capacityIndex === 0) return '0 GB'

                  return `${
                    fromBytesConversion(Math.max(capacity.toBytes() - stamp.size.toBytes(), 0), 'GB').toFixed(3) + ' GB'
                  } ${durationExtensionCost === '' ? '' : '(' + extensionCost + ' xBZZ)'}`
                })()}
              </div>
              <div>
                Extension period:{' '}
                {`${desiredLifetimeOptions[lifetimeIndex]?.label} ${
                  capacityExtensionCost === '' ? '' : '(' + extensionCost + ' xBZZ)'
                }`}
              </div>

              <div className="fm-upgrade-drive-modal-info fm-emphasized-text">
                Total:{' '}
                <span className="fm-swarm-orange-font">
                  {extensionCost} xBZZ {isBalanceSufficient ? '' : '(Insufficient balance)'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="fm-modal-window-footer">
          <Button
            label={isSubmitting ? 'Confirming…' : 'Confirm upgrade'}
            variant="primary"
            disabled={isSubmitting || !isBalanceSufficient || !walletBalance || !beeApi}
            onClick={async () => {
              if (!beeApi || !walletBalance) return

              try {
                setIsSubmitting(true)
                window.dispatchEvent(
                  new CustomEvent(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_START, {
                    detail: { driveId: drive.id.toString() },
                  }),
                )

                onCancelClick()

                await beeApi.extendStorage(
                  stamp.batchID,
                  capacity,
                  lifetimeIndex >= 0
                    ? Duration.fromEndDate(validityEndDate, stamp.duration.toEndDate())
                    : Duration.ZERO,
                  undefined,
                  false,
                  defaultErasureCodeLevel,
                )

                startPolling(stamp, capacityIndex > 0)
              } catch (e) {
                const msg = e instanceof Error ? e.message : 'Upgrade failed'
                window.dispatchEvent(
                  new CustomEvent(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, {
                    detail: {
                      driveId: drive.id.toString(),
                      success: false,
                      error: msg + ' (drive: ' + drive.name + ')',
                    },
                  }),
                )
              }
            }}
          />
          <Button label="Cancel" variant="secondary" disabled={isSubmitting} onClick={onCancelClick} />
        </div>

        {isSubmitting && (
          <div className="fm-drive-item-creating-overlay">
            <div className="fm-mini-spinner" />
            <span>Please wait…</span>
          </div>
        )}
      </div>
    </div>,
    modalRoot,
  )
}
