import formbricks from '@formbricks/js'
import { useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { LocalStorageKeys } from '../../../../utils/localStorage'

const FM_CLICK_THRESHOLD = 25
const FM_FORMBRICKS_TRACK_CODE = 'file_manager_engagement_25_clicks'
const FORMBRICKS_INIT_TIMEOUT_MS = 1000

interface FormbricksIntegrationProps {
  isActive: boolean
}

export function FormbricksIntegration({ isActive }: FormbricksIntegrationProps) {
  const location = useLocation()
  const formbricksInitRef = useRef(false)
  const formbricksReadyRef = useRef(false)
  const pendingEventRef = useRef(false)

  const environmentId = import.meta.env.VITE_FORMBRICKS_ENV_ID
  const appUrl = import.meta.env.VITE_FORMBRICKS_APP_URL

  const flushPendingEvent = useCallback(() => {
    if (pendingEventRef.current && localStorage.getItem(LocalStorageKeys.fmSurveyTriggered) !== 'true') {
      try {
        formbricks.track(FM_FORMBRICKS_TRACK_CODE)
        localStorage.setItem(LocalStorageKeys.fmSurveyTriggered, 'true')
        pendingEventRef.current = false
      } catch {
        // no-op
      }
    }
  }, [])

  useEffect(() => {
    if (!environmentId || !appUrl) {
      return
    }

    let cancelled = false

    const initializeFormbricks = async () => {
      try {
        await formbricks.setup({
          environmentId,
          appUrl,
        })

        await new Promise(resolve => setTimeout(resolve, FORMBRICKS_INIT_TIMEOUT_MS))

        if (!cancelled) {
          formbricksReadyRef.current = true
          formbricksInitRef.current = true
          flushPendingEvent()
        }
      } catch {
        formbricksReadyRef.current = false
        formbricksInitRef.current = false
      }
    }

    void initializeFormbricks()

    return () => {
      cancelled = true
    }
  }, [environmentId, appUrl, flushPendingEvent])

  useEffect(() => {
    if (!formbricksInitRef.current) return

    try {
      formbricks?.registerRouteChange()
    } catch {
      // no-op
    }
  }, [location])

  useEffect(() => {
    if (!isActive) return

    const handleClick = async () => {
      if (localStorage.getItem(LocalStorageKeys.fmSurveyTriggered) === 'true') return

      let count = 0
      try {
        const stored = localStorage.getItem(LocalStorageKeys.fmClickStorage)

        if (stored) count = parseInt(stored, 10) || 0
      } catch {
        // no-op
      }

      count += 1
      try {
        localStorage.setItem(LocalStorageKeys.fmClickStorage, String(count))
      } catch {
        // no-op
      }

      if (count >= FM_CLICK_THRESHOLD) {
        window.dispatchEvent(
          new CustomEvent('filemanager-25-clicks', {
            detail: { count, formbricksReady: formbricksReadyRef.current },
          }),
        )

        if (!formbricksReadyRef.current) {
          pendingEventRef.current = true

          return
        }

        try {
          await formbricks.track(FM_FORMBRICKS_TRACK_CODE)
          localStorage.setItem(LocalStorageKeys.fmSurveyTriggered, 'true')
        } catch {
          // no-op
        }
      }
    }

    const rootEl = document.querySelector('.fm-main')

    if (rootEl) {
      rootEl.addEventListener('click', handleClick)
    }

    return () => {
      if (rootEl) {
        rootEl.removeEventListener('click', handleClick)
      }
    }
  }, [isActive])

  return null
}
