import { Box, Typography } from '@material-ui/core'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { X } from 'react-feather'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as FeedsContext } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { UploadArea } from '../files/UploadArea'

interface MatchParams {
  uuid: string
}

export function FeedSubpage(props: RouteComponentProps<MatchParams>): ReactElement {
  const { feeds } = useContext(FeedsContext)
  const { beeApi } = useContext(SettingsContext)
  const history = useHistory()

  const [available, setAvailable] = useState(false)

  const uuid = props.match.params.uuid
  const feed = feeds.find(x => x.uuid === uuid)

  useEffect(() => {
    if (!feed || !feed.feedHash) {
      return
    }

    try {
      beeApi?.downloadData(feed.feedHash).then(() => setAvailable(true))
    } catch {
      setAvailable(false)
    }
  }, [beeApi, uuid, feed])

  if (!feed) {
    history.replace(ROUTES.FEEDS)

    return <></>
  }

  function onClose() {
    history.push(ROUTES.FEEDS)
  }

  return (
    <div>
      <HistoryHeader>{`${feed.name} Website`}</HistoryHeader>
      <UploadArea showHelp={false} uploadOrigin={{ origin: 'FEED', uuid }} />
      {available && feed.feedHash ? (
        <Box mb={4}>
          <ExpandableListItemKey label="Feed hash" value={feed.feedHash} />
        </Box>
      ) : (
        <Box mb={4}>
          <Typography>
            This feed is curently not pointing anywhere, you can update the feed to fix this. Please refer to the
            official Bee documentation.
          </Typography>
        </Box>
      )}
      <ExpandableListItemActions>
        <SwarmButton iconType={X} onClick={onClose} cancel>
          Close
        </SwarmButton>
      </ExpandableListItemActions>
    </div>
  )
}
