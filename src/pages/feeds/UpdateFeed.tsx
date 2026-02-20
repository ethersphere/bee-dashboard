import { Box, Grid, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Bookmark from 'remixicon-react/BookmarkLineIcon'
import X from 'remixicon-react/CloseLineIcon'

import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SelectEvent, SwarmSelect } from '../../components/SwarmSelect'
import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as IdentityContext, Identity, IdentityType } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampContext } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { persistIdentity, updateFeed } from '../../utils/identity'

import { FeedPasswordDialog } from './FeedPasswordDialog'

export default function UpdateFeed(): ReactElement {
  const { identities, setIdentities } = useContext(IdentityContext)
  const { beeApi } = useContext(SettingsContext)
  const { stamps, refresh } = useContext(StampContext)
  const { status } = useContext(BeeContext)
  const { hash } = useParams()

  const [selectedStamp, setSelectedStamp] = useState<string | null>(null)
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  const navigate = useNavigate()

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
    navigate(-1)
  }

  function onBeginUpdatingFeed() {
    if (!selectedIdentity) {
      return
    }

    if (selectedIdentity.type === IdentityType.V3) {
      setShowPasswordPrompt(true)
    } else {
      onFeedUpdate(selectedIdentity)
    }
  }

  async function onFeedUpdate(identity: Identity, password?: string) {
    setLoading(true)

    if (!beeApi || !selectedStamp) {
      enqueueSnackbar(<span>Bee API unavailabe</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    if (!hash) {
      enqueueSnackbar(<span>Hash is invalid</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    try {
      await updateFeed(beeApi, identity, hash, selectedStamp, password as string)
      persistIdentity(identities, identity)
      setIdentities([...identities])
      navigate(ROUTES.ACCOUNT_FEEDS_VIEW.replace(':uuid', identity.uuid))
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
              options={stamps.map(x => ({ value: x.batchID.toHex(), label: x.batchID.toHex().slice(0, 8) }))}
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
