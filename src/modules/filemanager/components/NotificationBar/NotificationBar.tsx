import { ReactElement, useContext, useEffect, useState } from 'react'
import './NotificationBar.scss'
import UpIcon from 'remixicon-react/ArrowUpSLineIcon'
import { ExpiringNotificationModal } from '../ExpiringNotificationModal/ExpiringNotificationModal'
import { getUsableStamps } from '../../utils/bee'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { PostageBatch } from '@ethersphere/bee-js'
import { Context as FMContext } from '../../../../providers/FileManager'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'
import { FILE_MANAGER_EVENTS } from '../../constants/common'

const NUMBER_OF_DAYS_WARNING = 7
const DAYS_TO_MILLISECONDS_MULTIPLIER = 24 * 60 * 60 * 1000

const isExpiring = (s: PostageBatch): boolean => {
  return (
    s.duration &&
    s.duration.toEndDate().getTime() <= Date.now() + NUMBER_OF_DAYS_WARNING * DAYS_TO_MILLISECONDS_MULTIPLIER
  )
}

interface NotificationBarProps {
  setErrorMessage?: (error: string) => void
}

export function NotificationBar({ setErrorMessage }: NotificationBarProps): ReactElement | null {
  const [showExpiringModal, setShowExpiringModal] = useState(false)
  const [stampsToExpire, setStampsToExpire] = useState<PostageBatch[]>([])
  const [drivesToExpire, setDrivesToExpire] = useState<DriveInfo[]>([])
  const { beeApi } = useContext(SettingsContext)
  const { drives, files, adminDrive } = useContext(FMContext)

  const showExpiration = stampsToExpire.length > 0

  useEffect(() => {
    let isMounted = true

    const getStamps = async () => {
      const allStamps = await getUsableStamps(beeApi)
      const expiringStamps: PostageBatch[] = []
      const expiringDrives: DriveInfo[] = []

      allStamps.forEach(stamp => {
        const matchingDrive =
          drives.find(d => d.batchId.toString() === stamp.batchID.toString()) ||
          (adminDrive?.batchId.toString() === stamp.batchID.toString() ? adminDrive : null)

        if (matchingDrive) {
          if (isExpiring(stamp)) {
            expiringStamps.push(stamp)
            expiringDrives.push(matchingDrive)
          }
        }
      })

      if (isMounted) {
        setStampsToExpire(expiringStamps)
        setDrivesToExpire(expiringDrives)
      }
    }

    getStamps()

    return () => {
      isMounted = false
    }
  }, [beeApi, drives, adminDrive, setErrorMessage])

  useEffect(() => {
    const onDriveUpgradeEnd = (e: Event) => {
      const { driveId, success, updatedStamp } = (e as CustomEvent).detail || {}

      if (success && updatedStamp && driveId) {
        if (!isExpiring(updatedStamp)) {
          setTimeout(() => {
            setStampsToExpire(prev => {
              const stampIx = prev.findIndex(s => s.batchID.toString() === updatedStamp.batchID.toString())

              return stampIx !== -1 ? prev.filter((_, i) => i !== stampIx) : prev
            })

            setDrivesToExpire(prev => {
              const driveIx = prev.findIndex(d => d.id.toString() === driveId)

              return driveIx !== -1 ? prev.filter((_, i) => i !== driveIx) : prev
            })
          }, 150)
        }
      }
    }

    window.addEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, onDriveUpgradeEnd as EventListener)

    return () => {
      window.removeEventListener(FILE_MANAGER_EVENTS.DRIVE_UPGRADE_END, onDriveUpgradeEnd as EventListener)
    }
  }, [])

  if (!showExpiration) return null

  return (
    <>
      <div className="fm-notification-bar fm-red-font" onClick={() => setShowExpiringModal(true)}>
        {stampsToExpire.length} drive{stampsToExpire.length > 1 ? 's' : ''} expiring soon <UpIcon size="16px" />
      </div>
      {showExpiringModal && (
        <ExpiringNotificationModal
          stamps={stampsToExpire}
          drives={drivesToExpire}
          files={files}
          onCancelClick={() => {
            setShowExpiringModal(false)
          }}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  )
}
