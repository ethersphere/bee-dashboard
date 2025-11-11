import { useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import formbricks from '@formbricks/js'

const FM_CLICK_STORAGE_KEY = 'fm_click_count_v1'
const FM_SURVEY_TRIGGERED_KEY = 'fm_survey_triggered_v1'
const FM_CLICK_THRESHOLD = 25

interface FormbricksIntegrationProps {
  isActive: boolean
}

export function FormbricksIntegration({ isActive }: FormbricksIntegrationProps) {
  const location = useLocation()
  const formbricksInitRef = useRef(false)
  const formbricksReadyRef = useRef(false)
  const pendingEventRef = useRef(false)

  const environmentId = process.env.REACT_APP_FORMBRICKS_ENV_ID
  const appUrl = process.env.REACT_APP_FORMBRICKS_APP_URL

  const flushPendingEvent = useCallback(() => {
    if (pendingEventRef.current && localStorage.getItem(FM_SURVEY_TRIGGERED_KEY) !== 'true') {
      try {
        formbricks.track('file_manager_engagement_25_clicks')
        localStorage.setItem(FM_SURVEY_TRIGGERED_KEY, 'true')
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

        await new Promise(resolve => setTimeout(resolve, 1000))

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
      if (localStorage.getItem(FM_SURVEY_TRIGGERED_KEY) === 'true') return

      let count = 0
      try {
        const stored = localStorage.getItem(FM_CLICK_STORAGE_KEY)

        if (stored) count = parseInt(stored, 10) || 0
      } catch {
        // no-op
      }

      count += 1
      try {
        localStorage.setItem(FM_CLICK_STORAGE_KEY, String(count))
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
          await formbricks.track('file_manager_engagement_25_clicks')
          localStorage.setItem(FM_SURVEY_TRIGGERED_KEY, 'true')
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
