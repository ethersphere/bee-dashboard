import { ReactElement, useState } from 'react'
import './NotificationBar.scss'
import UpIcon from 'remixicon-react/ArrowUpSLineIcon'
import { ExpiringNotificationModal } from '../ExpiringNotificationModal/ExpiringNotificationModal'

interface NotificationBarProps {
  numberOfExpiration?: number
}

export function NotificationBar({ numberOfExpiration = 0 }: NotificationBarProps): ReactElement | null {
  const [showExpiringModal, setShowExpiringModal] = useState(false)
  const showExpiration = numberOfExpiration > 0

  if (!showExpiration) return null

  return (
    <>
      <div className="fm-notification-bar fm-red-font" onClick={() => setShowExpiringModal(true)}>
        {numberOfExpiration} drive{numberOfExpiration !== 1 ? 's' : ''} expiring soon <UpIcon size="16px" />
      </div>
      {showExpiringModal && (
        <ExpiringNotificationModal
          onCancelClick={() => {
            setShowExpiringModal(false)
          }}
        />
      )}
    </>
  )
}
