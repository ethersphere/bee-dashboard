import { Context as SettingsContext } from '../../providers/Settings'
import { Box } from '@material-ui/core'
import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { DocumentationText } from '../../components/DocumentationText'
import { LinearProgressWithLabel } from '../../components/ProgressBar'

interface Props {
  reference: string
}

export function AssetSyncing({ reference }: Props): ReactElement {
  const { beeApi } = useContext(SettingsContext)

  const syncTimer = useRef<NodeJS.Timer>()
  const [isRetrieveChecking, setIsRetrieveChecking] = useState<boolean>(false)
  const [syncProgress, setSyncProgress] = useState<number>(0)

  const syncCheck = async () => {
    if (!beeApi) {
      return
    }

    const tags = await beeApi.getAllTags()
    const tag = tags.find(t => t.address === reference)

    if (tag) {
      const progress = ((tag.seen + tag.synced) / tag.split) * 100
      setSyncProgress(progress)
    }
  }

  useEffect(() => {
    syncTimer.current = setInterval(syncCheck, 2000)

    return () => {
      if (syncTimer.current) {
        clearInterval(syncTimer.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  useEffect(() => {
    if (syncProgress === 100 && syncTimer.current) {
      clearInterval(syncTimer.current)
    }
  }, [syncProgress])

  useEffect(() => {
    /*   
          There are instances when it seems that the content isn't synchronized, despite being already available.
          To ensure it's not due to invalid synchronization data,
          verify availability from at least 70% using one of the stewardship endpoints.
          
          TODO: is 70 a good number?
    */
    if (beeApi && !isRetrieveChecking && syncProgress > 10 && syncProgress < 100) {
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
          <a href="https://docs.ethswarm.org/docs/develop/access-the-swarm/syncing">Learn more about syncing</a>.
        </DocumentationText>
      </Box>
      <Box mb={4}>
        <LinearProgressWithLabel value={syncProgress}></LinearProgressWithLabel>
      </Box>
    </>
  )
}
