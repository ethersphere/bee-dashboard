import { Context as SettingsContext } from '../../providers/Settings'
import { Box } from '@material-ui/core'
import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { DocumentationText } from '../../components/DocumentationText'
import { LinearProgressWithLabel } from '../../components/ProgressBar'

interface Props {
  reference: string
}

export function AssetSyncing({ reference }: Props): ReactElement {
  const { beeApi } = useContext(SettingsContext)

  const syncTimer = useRef<NodeJS.Timer>()
  const [syncProgress, setSyncProgress] = useState<number>(0)

  const syncCheck = useCallback(async () => {
    if (!beeApi) {
      return
    }

    const tags = await beeApi.getAllTags()
    const tag = tags.find(t => t.address === reference)

    if (tag) {
      const progress = ((tag.seen + tag.synced) / tag.split) * 100
      setSyncProgress(progress)

      // Check availablity from 70%
      // There are occasions when it shows that the content is not synced but already available
      if (progress > 70 && progress < 100) {
        const isRetriavable = await beeApi.isReferenceRetrievable(reference)

        if (isRetriavable) {
          setSyncProgress(100)
        }
      }
    }
  }, [beeApi, reference])

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

  return (
    <>
      <Box mb={2}>
        <DocumentationText>
          Files are not immediately accessible on the Swarm network. Please wait until your upload is synced to the
          network.{' '}
          <a href="https://docs.ethswarm.org/docs/develop/access-the-swarm/syncing">Learn more about syncing</a>
        </DocumentationText>
      </Box>
      <Box mb={4}>
        <LinearProgressWithLabel value={syncProgress}></LinearProgressWithLabel>
      </Box>
    </>
  )
}
