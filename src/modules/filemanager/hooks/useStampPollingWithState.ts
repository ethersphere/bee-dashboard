import { useRef, useEffect, useCallback, Dispatch, SetStateAction, MutableRefObject } from 'react'
import { PostageBatch } from '@ethersphere/bee-js'
import { useStampPolling } from './useStampPolling'

interface UseStampPollingWithStateOptions {
  refreshStamp: (batchId: string) => Promise<PostageBatch | null | undefined>
  setActualStamp: Dispatch<SetStateAction<PostageBatch | null>> | Dispatch<SetStateAction<PostageBatch>>
  setIsCapacityUpdating: Dispatch<SetStateAction<boolean>>
}

interface UseStampPollingWithStateReturn {
  startPolling: (batchId: string, originalStamp: PostageBatch) => void
  stopPolling: () => void
  isMountedRef: MutableRefObject<boolean>
}

export function useStampPollingWithState({
  refreshStamp,
  setActualStamp,
  setIsCapacityUpdating,
}: UseStampPollingWithStateOptions): UseStampPollingWithStateReturn {
  const isMountedRef = useRef(true)

  const { startPolling, stopPolling } = useStampPolling({
    onStampUpdated: useCallback(
      (freshStamp: PostageBatch) => {
        if (!isMountedRef.current) return
        setActualStamp(freshStamp)
      },
      [setActualStamp],
    ),
    onPollingStateChange: setIsCapacityUpdating,
    refreshStamp,
  })

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      stopPolling()
    }
  }, [stopPolling])

  return {
    startPolling,
    stopPolling,
    isMountedRef,
  }
}
