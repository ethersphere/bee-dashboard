import { useRef, useCallback } from 'react'
import { PostageBatch } from '@ethersphere/bee-js'
import { POLLING_INTERVAL_MS } from '../constants/common'

interface UseStampPollingOptions {
  onStampUpdated: (stamp: PostageBatch) => void
  onPollingStateChange: (isPolling: boolean) => void
  onTimeout?: (finalStamp: PostageBatch | null) => void
  refreshStamp: (batchId: string) => Promise<PostageBatch | null | undefined>
  timeout: number
}

export function useStampPolling({
  onStampUpdated,
  onPollingStateChange,
  onTimeout,
  refreshStamp,
  timeout,
}: UseStampPollingOptions) {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    onPollingStateChange(false)
  }, [onPollingStateChange])

  const checkStampUpdate = useCallback(
    async (
      batchId: string,
      oldSize: number,
      oldExpiry: number,
    ): Promise<{ updated: boolean; stamp: PostageBatch | null }> => {
      try {
        const updatedStamp = await refreshStamp(batchId)

        if (!updatedStamp) {
          return { updated: false, stamp: null }
        }

        const newSize = updatedStamp.size.toBytes()
        const newExpiry = updatedStamp.duration.toEndDate().getTime()
        const capacityUpdated = newSize > oldSize
        const durationUpdated = newExpiry > oldExpiry

        return {
          updated: capacityUpdated || durationUpdated,
          stamp: updatedStamp,
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[useStampPolling] Error refreshing stamp:', error)

        return { updated: false, stamp: null }
      }
    },
    [refreshStamp],
  )

  const startPolling = useCallback(
    (originalStamp: PostageBatch) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      onPollingStateChange(true)

      const batchId = originalStamp.batchID.toString()
      const oldSize = originalStamp.size.toBytes()
      const oldExpiry = originalStamp.duration.toEndDate().getTime()

      timeoutRef.current = setTimeout(async () => {
        stopPolling()

        if (!onTimeout) return

        const result = await checkStampUpdate(batchId, oldSize, oldExpiry)

        if (result.updated && result.stamp) {
          onStampUpdated(result.stamp)

          return
        }

        onTimeout(result.stamp)
      }, timeout)

      pollingIntervalRef.current = setInterval(async () => {
        const result = await checkStampUpdate(batchId, oldSize, oldExpiry)

        if (result.updated && result.stamp) {
          onStampUpdated(result.stamp)
          stopPolling()
        }
      }, POLLING_INTERVAL_MS)
    },
    [onStampUpdated, onPollingStateChange, onTimeout, stopPolling, timeout, checkStampUpdate],
  )

  return {
    startPolling,
    stopPolling,
  }
}
