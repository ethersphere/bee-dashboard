import { Box, Grid, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { Bookmark, X } from 'react-feather'
import { RouteComponentProps, useHistory } from 'react-router'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SelectEvent, SwarmSelect } from '../../components/SwarmSelect'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as IdentityContext, Identity } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampContext } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { persistIdentity, updateFeed } from '../../utils/identity'
import { FeedPasswordDialog } from './FeedPasswordDialog'

interface MatchParams {
  hash: string
}

export default function UpdateFeed(props: RouteComponentProps<MatchParams>): ReactElement {
  const { identities, setIdentities } = useContext(IdentityContext)
  const { beeApi, beeDebugApi } = useContext(SettingsContext)
  const { stamps, refresh } = useContext(StampContext)
  const { status } = useContext(BeeContext)

  const [selectedStamp, setSelectedStamp] = useState<string | null>(null)
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  const history = useHistory()

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onFeedChange(event: SelectEvent) {
    const uuid = event.target.value
    setSelectedIdentity(identities.find(x => x.uuid === uuid) || null)
  }

  function onStampChange(event: SelectEvent) {
    const batchId = event.target.value as string
    setSelectedStamp(batchId)
  }

  function onCancel() {
    history.goBack()
  }

  function onBeginUpdatingFeed() {
    if (!selectedIdentity) {
      return
    }

    if (selectedIdentity.type === 'V3') {
      setShowPasswordPrompt(true)
    } else {
      onFeedUpdate(selectedIdentity)
    }
  }

  async function onFeedUpdate(identity: Identity, password?: string) {
    setLoading(true)

    if (!beeApi || !beeDebugApi || !selectedStamp) {
      enqueueSnackbar(<span>Bee API unavailabe</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    try {
      await updateFeed(beeApi, identity, props.match.params.hash, selectedStamp, password as string)
      persistIdentity(identities, identity)
      setIdentities([...identities])
      history.push(ROUTES.FEEDS_PAGE.replace(':uuid', identity.uuid))
    } catch (error: unknown) {
      setLoading(false)

      const message = (typeof error === 'object' && error !== null && Reflect.get(error, 'message')) || ''

      if (message.includes('possibly wrong passphrase')) {
        enqueueSnackbar('Wrong password, please try again', { variant: 'error' })
      } else {
        enqueueSnackbar('Could not update feed at this time, please try again later', { variant: 'error' })
      }
    }
  }

  if (!status.all) return <TroubleshootConnectionCard />

  return (
    <div>
      {showPasswordPrompt && selectedIdentity && (
        <FeedPasswordDialog
          feedName={selectedIdentity.name + ' Website'}
          onCancel={() => {
            setShowPasswordPrompt(false)
          }}
          onProceed={(password: string) => {
            onFeedUpdate(selectedIdentity, password)
          }}
          loading={loading}
        />
      )}
      <HistoryHeader>Update feed</HistoryHeader>
      <Box mb={2}>
        <Grid container>
          <SwarmSelect
            options={identities.map(x => ({ value: x.uuid, label: `${x.name} Website` }))}
            onChange={onFeedChange}
            label="Feed"
          />
        </Grid>
      </Box>

      <Box mb={4}>
        <Grid container>
          {stamps ? (
            <SwarmSelect
              options={stamps.map(x => ({ value: x.batchID, label: x.batchID.slice(0, 8) }))}
              onChange={onStampChange}
              label="Stamp"
            />
          ) : (
            <Typography>You need to buy a stamp first to be able to update a feed.</Typography>
          )}
        </Grid>
      </Box>
      <ExpandableListItemActions>
        <SwarmButton
          onClick={onBeginUpdatingFeed}
          iconType={Bookmark}
          loading={!showPasswordPrompt && loading}
          disabled={loading || !selectedStamp || !selectedIdentity}
        >
          Update Selected Feed
        </SwarmButton>
        <SwarmButton onClick={onCancel} iconType={X} disabled={loading} cancel>
          Close
        </SwarmButton>
      </ExpandableListItemActions>
    </div>
  )
}
