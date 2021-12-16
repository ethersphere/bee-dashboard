import { Box, Grid } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { Bookmark, X } from 'react-feather'
import { RouteComponentProps, useHistory } from 'react-router'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SelectEvent, SwarmSelect } from '../../components/SwarmSelect'
import { Context as FeedsContext, Feed } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { persistIdentity, updateFeed } from '../../utils/identity'
import { FeedPasswordDialog } from './FeedPasswordDialog'

interface MatchParams {
  hash: string
}

export default function UpdateFeed(props: RouteComponentProps<MatchParams>): ReactElement {
  const { feeds, setFeeds } = useContext(FeedsContext)
  const { beeApi, beeDebugApi } = useContext(SettingsContext)
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  const history = useHistory()

  function onChange(event: SelectEvent) {
    const uuid = event.target.value
    setSelectedFeed(feeds.find(x => x.uuid === uuid) || null)
  }

  function onCancel() {
    history.goBack()
  }

  function onBeginUpdatingFeed() {
    if (!selectedFeed) {
      return
    }

    if (selectedFeed.type === 'V3') {
      setShowPasswordPrompt(true)
    } else {
      onFeedUpdate(selectedFeed)
    }
  }

  async function onFeedUpdate(identity: Feed, password?: string) {
    setLoading(true)

    if (!beeApi || !beeDebugApi) {
      enqueueSnackbar(<span>Bee API unavailabe</span>, { variant: 'error' })
      setLoading(false)

      return
    }
    const stamps = await beeDebugApi.getAllPostageBatch()

    if (!stamps.length) {
      enqueueSnackbar(<span>No stamp available</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    await updateFeed(beeApi, identity, props.match.params.hash, stamps[0].batchID, password as string)
    persistIdentity(feeds, identity)
    setFeeds([...feeds])
    history.push(ROUTES.FEEDS_PAGE.replace(':uuid', identity.uuid))
  }

  return (
    <div>
      {showPasswordPrompt && selectedFeed && (
        <FeedPasswordDialog
          feedName={selectedFeed.name + ' Website'}
          onCancel={() => {
            setShowPasswordPrompt(false)
          }}
          onProceed={(password: string) => {
            onFeedUpdate(selectedFeed, password)
          }}
          loading={loading}
        />
      )}
      <HistoryHeader>Update feed</HistoryHeader>
      <Box mb={4}>
        <Grid container>
          <SwarmSelect options={feeds.map(x => ({ value: x.uuid, label: `${x.name} Website` }))} onChange={onChange} />
        </Grid>
      </Box>
      <ExpandableListItemActions>
        <SwarmButton onClick={onBeginUpdatingFeed} iconType={Bookmark} loading={loading} disabled={loading}>
          Update Selected Feed
        </SwarmButton>
        <SwarmButton onClick={onCancel} iconType={X} disabled={loading} cancel>
          Close
        </SwarmButton>
      </ExpandableListItemActions>
    </div>
  )
}
