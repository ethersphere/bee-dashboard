import { Tag } from '@ethersphere/bee-js'
import { Box } from '@mui/material'
import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { DocumentationText } from '../../components/DocumentationText'
import { LinearProgressWithLabel } from '../../components/ProgressBar'
import { Context as SettingsContext } from '../../providers/Settings'

interface Props {
  reference?: string
}

const SYNC_CHECK_INTERVAL_MS = 2000

export function AssetSyncing({ reference }: Props): ReactElement {
  const { beeApi } = useContext(SettingsContext)

  const syncTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isRetrieveChecking, setIsRetrieveChecking] = useState<boolean>(false)
  const [syncProgress, setSyncProgress] = useState<number>(0)

  const syncCheck = useCallback(async () => {
    if (!beeApi || !reference) return

    let allTags: Tag[] = []
    let offset = 0
    const limit = 1000
    let tagsBatch: Tag[]

    do {
      tagsBatch = await beeApi.getAllTags({ limit, offset })
      allTags = allTags.concat(tagsBatch)
      offset += limit
    } while (tagsBatch.length === limit) // Continue if the batch is full, stop if fewer than the limit

    const tag = allTags.find(t => t.address === reference)

    if (tag && tag.split > 0) {
      const progress = ((tag.seen + tag.synced) / tag.split) * 100
      setSyncProgress(progress)
    }
  }, [beeApi, reference])

  useEffect(() => {
    syncTimer.current = setInterval(syncCheck, SYNC_CHECK_INTERVAL_MS)

    return () => {
      if (syncTimer.current) {
        clearInterval(syncTimer.current)
        syncTimer.current = null
      }
    }
  }, [reference, syncCheck])

  useEffect(() => {
    if (syncProgress === 100 && syncTimer.current) {
      clearInterval(syncTimer.current)
      syncTimer.current = null
    }
  }, [syncProgress])

  useEffect(() => {
    /*   
          There are instances when it seems that the content isn't synchronized, despite being already available.
          To ensure it's not due to invalid synchronization data,
          verify availability from at least 70% using one of the stewardship endpoints.
    */
    if (beeApi && reference && !isRetrieveChecking && syncProgress > 10 && syncProgress < 100) {
      // It's a long running task make sure only one run occurs at a time.
      setIsRetrieveChecking(true)

      beeApi.isReferenceRetrievable(reference).then(isRetriavable => {
        if (isRetriavable) {
          setSyncProgress(100)
        }

        setIsRetrieveChecking(false)
      })
    }
  }, [syncProgress, isRetrieveChecking, beeApi, reference])

  return (
    <>
      <Box mb={2}>
        <DocumentationText>
          Files are not immediately accessible on the Swarm network. Please wait until your upload is synced to the
          network.{' '}
          {/* TODO: syncing article was removed, now the only available doc. is at https://docs.ethswarm.org/api/#tag/Tag */}
          {/* <a href="https://docs.ethswarm.org/docs/develop/access-the-swarm/syncing">Learn more about syncing</a>. */}
        </DocumentationText>
      </Box>
      <Box mb={4}>
        <LinearProgressWithLabel value={syncProgress}></LinearProgressWithLabel>
      </Box>
    </>
  )
}
