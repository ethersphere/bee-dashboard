import { ReactElement, useContext, useEffect, useState } from 'react'
import './NotificationBar.scss'
import UpIcon from 'remixicon-react/ArrowUpSLineIcon'
import { ExpiringNotificationModal } from '../ExpiringNotificationModal/ExpiringNotificationModal'
import { getUsableStamps } from '../../utils/bee'
import { Context as SettingsContext } from '../../../../providers/Settings'
import { PostageBatch } from '@ethersphere/bee-js'
import { Context as FMContext } from '../../../../providers/FileManager'
import { DriveInfo } from '@solarpunkltd/file-manager-lib'

const NUMBER_OF_DAYS_WARNING = 7
const DAYS_TO_MILLISECONDS_MULTIPLIER = 24 * 60 * 60 * 1000

interface NotificationBarProps {
  setErrorMessage?: (error: string) => void
}

export function NotificationBar({ setErrorMessage }: NotificationBarProps): ReactElement | null {
  const [showExpiringModal, setShowExpiringModal] = useState(false)
  const [stampsToExpire, setStampsToExpire] = useState<PostageBatch[]>([])
  const [drivesToExpire, setDrivesToExpire] = useState<DriveInfo[]>([])
  const { beeApi } = useContext(SettingsContext)
  const { drives, adminDrive } = useContext(FMContext)

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
          const isExpiring =
            stamp.duration &&
            stamp.duration.toEndDate().getTime() <=
              Date.now() + NUMBER_OF_DAYS_WARNING * DAYS_TO_MILLISECONDS_MULTIPLIER

          if (isExpiring) {
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
  }, [beeApi, drives, adminDrive])

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
          onCancelClick={() => {
            setShowExpiringModal(false)
          }}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  )
}
