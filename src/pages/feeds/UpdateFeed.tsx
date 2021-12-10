import { Reference } from '@ethersphere/bee-js'
import { Box, Button, Grid } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { Bookmark } from 'react-feather'
import { RouteComponentProps, useHistory } from 'react-router'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SelectEvent, SwarmSelect } from '../../components/SwarmSelect'
import { Context as FeedsContext } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'

interface MatchParams {
  hash: string
}

export default function UpdateFeed(props: RouteComponentProps<MatchParams>): ReactElement {
  const { feeds } = useContext(FeedsContext)
  const { beeApi, beeDebugApi } = useContext(SettingsContext)
  const [identityName, setIdentityName] = useState('')
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const history = useHistory()

  function onChange(event: SelectEvent) {
    setIdentityName(event.target.value as string)
  }

  function onCancel() {
    history.goBack()
  }

  async function onFeedUpdate() {
    setLoading(true)

    if (!beeApi || !beeDebugApi) {
      enqueueSnackbar(<span>Bee API unavailabe</span>, { variant: 'error' })
      setLoading(false)

      return
    }
    const identity = feeds.find(x => x.name === identityName)

    if (!identity) {
      enqueueSnackbar(<span>No identity selected</span>, { variant: 'error' })
      setLoading(false)

      return
    }
    const stamps = await beeDebugApi.getAllPostageBatch()

    if (!stamps.length) {
      enqueueSnackbar(<span>No stamp available</span>, { variant: 'error' })
      setLoading(false)

      return
    }
    const writer = beeApi.makeFeedWriter('sequence', '00'.repeat(32), identity.identity)
    await writer.upload(stamps[0].batchID, props.match.params.hash as Reference)
    enqueueSnackbar('Feed successfully updated')
    setLoading(false)
  }

  return (
    <div>
      <HistoryHeader>Update feed</HistoryHeader>
      <Box mb={4}>
        <Grid container>
          <SwarmSelect options={feeds.map(x => ({ value: x.name, label: `${x.name} Website` }))} onChange={onChange} />
        </Grid>
      </Box>
      <Grid container>
        <Box mr={1}>
          <Button onClick={onCancel} variant="contained" startIcon={<Clear />}>
            Close
          </Button>
        </Box>
        <SwarmButton onClick={onFeedUpdate} iconType={Bookmark} loading={loading} disabled={loading}>
          Update Selected Feed
        </SwarmButton>
      </Grid>
    </div>
  )
}
